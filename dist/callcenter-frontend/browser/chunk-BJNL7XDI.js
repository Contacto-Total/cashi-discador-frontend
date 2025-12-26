import {
  ApiSystemConfigService,
  DynamicFieldRendererComponent,
  TypificationV2Service
} from "./chunk-WKJZD4SZ.js";
import {
  ThemeService
} from "./chunk-D3RWIMJ4.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
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
  EventEmitter,
  HttpClient,
  Injectable,
  Input,
  NgForOf,
  NgTemplateOutlet,
  Output,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  inject,
  input,
  output,
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
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction3,
  ɵɵpureFunction5,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
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

// src/app/maintenance/models/typification-v2.model.ts
var ClassificationTypeV2;
(function(ClassificationTypeV22) {
  ClassificationTypeV22["RESULTADO_CONTACTO"] = "RESULTADO_CONTACTO";
  ClassificationTypeV22["TIPO_GESTION"] = "TIPO_GESTION";
  ClassificationTypeV22["MODALIDAD_PAGO"] = "MODALIDAD_PAGO";
  ClassificationTypeV22["TIPO_FRACCIONAMIENTO"] = "TIPO_FRACCIONAMIENTO";
})(ClassificationTypeV2 || (ClassificationTypeV2 = {}));
var FieldTypeV2;
(function(FieldTypeV22) {
  FieldTypeV22["DATE"] = "DATE";
  FieldTypeV22["NUMBER"] = "NUMBER";
  FieldTypeV22["TEXT"] = "TEXT";
  FieldTypeV22["TEXTAREA"] = "TEXTAREA";
  FieldTypeV22["CHIP_SELECT"] = "CHIP_SELECT";
  FieldTypeV22["PAYMENT_SCHEDULE"] = "PAYMENT_SCHEDULE";
})(FieldTypeV2 || (FieldTypeV2 = {}));
var FieldDataSourceV2;
(function(FieldDataSourceV22) {
  FieldDataSourceV22["MANUAL"] = "MANUAL";
  FieldDataSourceV22["DYNAMIC_TABLE"] = "DYNAMIC_TABLE";
})(FieldDataSourceV2 || (FieldDataSourceV2 = {}));
var RestriccionFecha;
(function(RestriccionFecha2) {
  RestriccionFecha2["SIN_RESTRICCION"] = "SIN_RESTRICCION";
  RestriccionFecha2["DENTRO_MES"] = "DENTRO_MES";
  RestriccionFecha2["FUERA_MES"] = "FUERA_MES";
})(RestriccionFecha || (RestriccionFecha = {}));

// src/app/maintenance/components/field-config-dialog/field-config-dialog.component.ts
var _c0 = (a0) => [a0];
var _c1 = (a0) => ({ fields: a0 });
var _forTrack0 = ($index, $item) => $item.id;
function FieldConfigDialogComponent_Conditional_0_For_11_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const type_r5 = ctx.$implicit;
    \u0275\u0275property("value", type_r5.typeCode);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(type_r5.typeName);
  }
}
function FieldConfigDialogComponent_Conditional_0_For_11_Conditional_24_For_7_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const colType_r9 = ctx.$implicit;
    \u0275\u0275property("value", colType_r9.typeCode);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(colType_r9.typeName);
  }
}
function FieldConfigDialogComponent_Conditional_0_For_11_Conditional_24_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 41)(1, "input", 42);
    \u0275\u0275twoWayListener("ngModelChange", function FieldConfigDialogComponent_Conditional_0_For_11_Conditional_24_For_7_Template_input_ngModelChange_1_listener($event) {
      const column_r8 = \u0275\u0275restoreView(_r7).$implicit;
      \u0275\u0275twoWayBindingSet(column_r8.id, $event) || (column_r8.id = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function FieldConfigDialogComponent_Conditional_0_For_11_Conditional_24_For_7_Template_input_ngModelChange_2_listener($event) {
      const column_r8 = \u0275\u0275restoreView(_r7).$implicit;
      \u0275\u0275twoWayBindingSet(column_r8.label, $event) || (column_r8.label = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 44)(4, "select", 45);
    \u0275\u0275twoWayListener("ngModelChange", function FieldConfigDialogComponent_Conditional_0_For_11_Conditional_24_For_7_Template_select_ngModelChange_4_listener($event) {
      const column_r8 = \u0275\u0275restoreView(_r7).$implicit;
      \u0275\u0275twoWayBindingSet(column_r8.type, $event) || (column_r8.type = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(5, FieldConfigDialogComponent_Conditional_0_For_11_Conditional_24_For_7_For_6_Template, 2, 2, "option", 24, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 46);
    \u0275\u0275listener("click", function FieldConfigDialogComponent_Conditional_0_For_11_Conditional_24_For_7_Template_button_click_7_listener() {
      const \u0275$index_77_r10 = \u0275\u0275restoreView(_r7).$index;
      const field_r4 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeColumn(field_r4, \u0275$index_77_r10));
    });
    \u0275\u0275element(8, "lucide-angular", 37);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const column_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", column_r8.id);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", column_r8.label);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", column_r8.type);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.columnFieldTypes());
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
  }
}
function FieldConfigDialogComponent_Conditional_0_For_11_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 38)(2, "h4", 39);
    \u0275\u0275text(3, "Columnas de la Tabla");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 40);
    \u0275\u0275listener("click", function FieldConfigDialogComponent_Conditional_0_For_11_Conditional_24_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r6);
      const field_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addColumn(field_r4));
    });
    \u0275\u0275text(5, " + Agregar Columna ");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(6, FieldConfigDialogComponent_Conditional_0_For_11_Conditional_24_For_7_Template, 9, 4, "div", 41, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(6);
    \u0275\u0275repeater(field_r4.columns);
  }
}
function FieldConfigDialogComponent_Conditional_0_For_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 17)(2, "div", 18)(3, "div", 19)(4, "div")(5, "label", 20);
    \u0275\u0275text(6, " ID del Campo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 21);
    \u0275\u0275twoWayListener("ngModelChange", function FieldConfigDialogComponent_Conditional_0_For_11_Template_input_ngModelChange_7_listener($event) {
      const field_r4 = \u0275\u0275restoreView(_r3).$implicit;
      \u0275\u0275twoWayBindingSet(field_r4.id, $event) || (field_r4.id = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "label", 20);
    \u0275\u0275text(10, " Etiqueta ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function FieldConfigDialogComponent_Conditional_0_For_11_Template_input_ngModelChange_11_listener($event) {
      const field_r4 = \u0275\u0275restoreView(_r3).$implicit;
      \u0275\u0275twoWayBindingSet(field_r4.label, $event) || (field_r4.label = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 19)(13, "div")(14, "label", 20);
    \u0275\u0275text(15, " Tipo de Campo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "select", 23);
    \u0275\u0275twoWayListener("ngModelChange", function FieldConfigDialogComponent_Conditional_0_For_11_Template_select_ngModelChange_16_listener($event) {
      const field_r4 = \u0275\u0275restoreView(_r3).$implicit;
      \u0275\u0275twoWayBindingSet(field_r4.type, $event) || (field_r4.type = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function FieldConfigDialogComponent_Conditional_0_For_11_Template_select_ngModelChange_16_listener() {
      const field_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onFieldTypeChange(field_r4));
    });
    \u0275\u0275repeaterCreate(17, FieldConfigDialogComponent_Conditional_0_For_11_For_18_Template, 2, 2, "option", 24, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 25)(20, "label", 26)(21, "input", 27);
    \u0275\u0275twoWayListener("ngModelChange", function FieldConfigDialogComponent_Conditional_0_For_11_Template_input_ngModelChange_21_listener($event) {
      const field_r4 = \u0275\u0275restoreView(_r3).$implicit;
      \u0275\u0275twoWayBindingSet(field_r4.required, $event) || (field_r4.required = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 28);
    \u0275\u0275text(23, " Campo Requerido ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(24, FieldConfigDialogComponent_Conditional_0_For_11_Conditional_24_Template, 8, 0, "div", 29);
    \u0275\u0275elementStart(25, "div")(26, "label", 20);
    \u0275\u0275text(27, " Texto de Ayuda (opcional) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "input", 30);
    \u0275\u0275twoWayListener("ngModelChange", function FieldConfigDialogComponent_Conditional_0_For_11_Template_input_ngModelChange_28_listener($event) {
      const field_r4 = \u0275\u0275restoreView(_r3).$implicit;
      \u0275\u0275twoWayBindingSet(field_r4.helpText, $event) || (field_r4.helpText = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 31)(30, "div", 32);
    \u0275\u0275element(31, "lucide-angular", 33);
    \u0275\u0275elementStart(32, "h5", 34);
    \u0275\u0275text(33, "Vista Previa");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "app-dynamic-field-renderer", 35);
    \u0275\u0275listener("dataChange", function FieldConfigDialogComponent_Conditional_0_For_11_Template_app_dynamic_field_renderer_dataChange_34_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onPreviewDataChange($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(35, "button", 36);
    \u0275\u0275listener("click", function FieldConfigDialogComponent_Conditional_0_For_11_Template_button_click_35_listener() {
      const \u0275$index_21_r11 = \u0275\u0275restoreView(_r3).$index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeField(\u0275$index_21_r11));
    });
    \u0275\u0275element(36, "lucide-angular", 37);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const field_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", field_r4.id);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", field_r4.label);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", field_r4.type);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.fieldTypes());
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", field_r4.required);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(field_r4.type === "table" ? 24 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", field_r4.helpText);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275property("schema", \u0275\u0275pureFunction1(11, _c1, \u0275\u0275pureFunction1(9, _c0, field_r4)));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
  }
}
function FieldConfigDialogComponent_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "p");
    \u0275\u0275text(2, "No hay campos configurados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 47);
    \u0275\u0275text(4, 'Haz clic en "Agregar Campo" para empezar');
    \u0275\u0275elementEnd()();
  }
}
function FieldConfigDialogComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3);
    \u0275\u0275element(4, "lucide-angular", 4);
    \u0275\u0275text(5, " Configurar Campos Personalizados ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 5);
    \u0275\u0275listener("click", function FieldConfigDialogComponent_Conditional_0_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.handleCancel());
    });
    \u0275\u0275element(7, "lucide-angular", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 7)(9, "div", 8);
    \u0275\u0275repeaterCreate(10, FieldConfigDialogComponent_Conditional_0_For_11_Template, 37, 13, "div", 9, _forTrack0);
    \u0275\u0275conditionalCreate(12, FieldConfigDialogComponent_Conditional_0_Conditional_12_Template, 5, 0, "div", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 11);
    \u0275\u0275listener("click", function FieldConfigDialogComponent_Conditional_0_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addField());
    });
    \u0275\u0275element(14, "lucide-angular", 12);
    \u0275\u0275text(15, " Agregar Campo ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 13)(17, "button", 14);
    \u0275\u0275listener("click", function FieldConfigDialogComponent_Conditional_0_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.handleCancel());
    });
    \u0275\u0275text(18, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 15);
    \u0275\u0275listener("click", function FieldConfigDialogComponent_Conditional_0_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.handleSave());
    });
    \u0275\u0275element(20, "lucide-angular", 16);
    \u0275\u0275text(21, " Guardar Configuraci\xF3n ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.fields());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.fields().length === 0 ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 20);
  }
}
var _FieldConfigDialogComponent = class _FieldConfigDialogComponent {
  constructor() {
    this.apiSystemConfigService = inject(ApiSystemConfigService);
    this.isOpen = input.required(...ngDevMode ? [{ debugName: "isOpen" }] : []);
    this.existingSchema = input(null, ...ngDevMode ? [{ debugName: "existingSchema" }] : []);
    this.save = output();
    this.cancel = output();
    this.fields = signal([], ...ngDevMode ? [{ debugName: "fields" }] : []);
    this.fieldTypes = signal([], ...ngDevMode ? [{ debugName: "fieldTypes" }] : []);
    this.columnFieldTypes = signal([], ...ngDevMode ? [{ debugName: "columnFieldTypes" }] : []);
    this.apiSystemConfigService.getFieldTypesForMainFields().subscribe((types) => {
      const hasPaymentSchedule = types.some((t) => t.typeCode === "payment_schedule");
      if (!hasPaymentSchedule) {
        types.push({
          id: 999,
          typeCode: "payment_schedule",
          typeName: "Cronograma de Pagos",
          description: "Permite dividir un monto en m\xFAltiples cuotas con fechas",
          icon: "calendar-check",
          availableForMainField: true,
          availableForTableColumn: false,
          displayOrder: 100
        });
      }
      this.fieldTypes.set(types);
    });
    this.apiSystemConfigService.getFieldTypesForTableColumns().subscribe((types) => {
      this.columnFieldTypes.set(types);
    });
    effect(() => {
      const schema = this.existingSchema();
      if (schema && schema.fields) {
        const normalizedFields = JSON.parse(JSON.stringify(schema.fields)).map((field) => __spreadProps(__spreadValues({}, field), {
          type: field.type?.toLowerCase() || "text",
          columns: field.columns?.map((col) => __spreadProps(__spreadValues({}, col), {
            type: col.type?.toLowerCase() || "text"
          }))
        }));
        this.fields.set(normalizedFields);
      } else {
        this.fields.set([]);
      }
    });
  }
  addField() {
    const newField = {
      id: `field_${Date.now()}`,
      label: "Nuevo Campo",
      type: "text",
      required: false,
      displayOrder: this.fields().length
    };
    this.fields.update((fields) => [...fields, newField]);
  }
  removeField(index) {
    this.fields.update((fields) => fields.filter((_, i) => i !== index));
  }
  onFieldTypeChange(field) {
    if (field.type === "table") {
      if (!field.columns || field.columns.length === 0) {
        field.columns = [
          { id: "cuota", label: "Cuota", type: "auto-number", required: true },
          { id: "fecha", label: "Fecha", type: "date", required: true },
          { id: "monto", label: "Monto", type: "currency", required: true }
        ];
      }
      field.allowAddRow = true;
      field.allowDeleteRow = true;
    }
  }
  addColumn(field) {
    if (!field.columns) {
      field.columns = [];
    }
    const newColumn = {
      id: `column_${Date.now()}`,
      label: "Nueva Columna",
      type: "text"
    };
    field.columns.push(newColumn);
    this.fields.set([...this.fields()]);
  }
  removeColumn(field, columnIndex) {
    if (field.columns) {
      field.columns.splice(columnIndex, 1);
      this.fields.set([...this.fields()]);
    }
  }
  handleSave() {
    const schema = {
      fields: this.fields()
    };
    this.save.emit(schema);
  }
  handleCancel() {
    this.cancel.emit();
  }
  onPreviewDataChange(_data) {
  }
};
_FieldConfigDialogComponent.\u0275fac = function FieldConfigDialogComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FieldConfigDialogComponent)();
};
_FieldConfigDialogComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FieldConfigDialogComponent, selectors: [["app-field-config-dialog"]], inputs: { isOpen: [1, "isOpen"], existingSchema: [1, "existingSchema"] }, outputs: { save: "save", cancel: "cancel" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "p-4"], [1, "bg-white", "dark:bg-gray-800", "rounded-lg", "shadow-xl", "max-w-4xl", "w-full", "max-h-[90vh]", "flex", "flex-col"], [1, "flex", "items-center", "justify-between", "p-6", "border-b", "border-gray-200", "dark:border-gray-700"], [1, "text-xl", "font-bold", "text-gray-900", "dark:text-white", "flex", "items-center", "gap-2"], ["name", "settings", 1, "text-blue-600", 3, "size"], ["type", "button", 1, "text-gray-400", "hover:text-gray-600", "dark:hover:text-gray-300", 3, "click"], ["name", "x", 3, "size"], [1, "flex-1", "overflow-y-auto", "p-6", "space-y-4"], [1, "space-y-3"], [1, "bg-gray-50", "dark:bg-gray-700", "p-4", "rounded-lg", "border", "border-gray-200", "dark:border-gray-600"], [1, "text-center", "py-8", "text-gray-500", "dark:text-gray-400"], ["type", "button", 1, "w-full", "py-3", "border-2", "border-dashed", "border-gray-300", "dark:border-gray-600", "rounded-lg", "text-gray-600", "dark:text-gray-400", "hover:border-blue-500", "hover:text-blue-500", "dark:hover:border-blue-400", "dark:hover:text-blue-400", "transition-colors", "flex", "items-center", "justify-center", "gap-2", 3, "click"], ["name", "plus", 3, "size"], [1, "flex", "items-center", "justify-end", "gap-3", "p-6", "border-t", "border-gray-200", "dark:border-gray-700"], ["type", "button", 1, "px-4", "py-2", "text-gray-700", "dark:text-gray-300", "bg-gray-100", "dark:bg-gray-700", "rounded-lg", "hover:bg-gray-200", "dark:hover:bg-gray-600", 3, "click"], ["type", "button", 1, "px-4", "py-2", "bg-blue-600", "text-white", "rounded-lg", "hover:bg-blue-700", "flex", "items-center", "gap-2", 3, "click"], ["name", "save", 3, "size"], [1, "flex", "items-start", "justify-between", "gap-4"], [1, "flex-1", "space-y-3"], [1, "grid", "grid-cols-2", "gap-3"], [1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], ["type", "text", "placeholder", "payment_schedule", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "dark:border-gray-600", "rounded-md", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Cronograma de Pago", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "dark:border-gray-600", "rounded-md", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "w-full", "px-3", "py-2", "border", "border-gray-300", "dark:border-gray-600", "rounded-md", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "flex", "items-cent", "er", "pt-6"], [1, "flex", "items-center", "gap-2", "cursor-pointer"], ["type", "checkbox", 1, "w-4", "h-4", "text-blue-600", "border-gray-300", "rounded", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], [1, "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300"], [1, "mt-4", "p-4", "bg-white", "dark:bg-gray-800", "rounded", "border", "border-gray-300", "dark:border-gray-600"], ["type", "text", "placeholder", "Instrucciones para el usuario...", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "dark:border-gray-600", "rounded-md", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "mt-4", "p-4", "bg-gradient-to-br", "from-purple-50", "to-blue-50", "dark:from-purple-950/30", "dark:to-blue-950/30", "rounded-lg", "border-2", "border-purple-200", "dark:border-purple-800"], [1, "flex", "items-center", "gap-2", "mb-3"], ["name", "eye", 1, "text-purple-600", "dark:text-purple-400", 3, "size"], [1, "text-xs", "font-bold", "text-purple-900", "dark:text-purple-200", "uppercase", "tracking-wide"], [3, "dataChange", "schema"], ["type", "button", 1, "text-red-600", "hover:text-red-800", "dark:text-red-400", "dark:hover:text-red-300", 3, "click"], ["name", "trash-2", 3, "size"], [1, "flex", "items-center", "justify-between", "mb-3"], [1, "font-medium", "text-gray-900", "dark:text-white"], ["type", "button", 1, "text-sm", "px-3", "py-1", "bg-blue-600", "text-white", "rounded", "hover:bg-blue-700", 3, "click"], [1, "grid", "grid-cols-3", "gap-2", "mb-2"], ["type", "text", "placeholder", "ID", 1, "px-2", "py-1", "text-sm", "border", "border-gray-300", "dark:border-gray-600", "rounded", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Etiqueta", 1, "px-2", "py-1", "text-sm", "border", "border-gray-300", "dark:border-gray-600", "rounded", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "flex", "gap-1"], [1, "flex-1", "px-2", "py-1", "text-sm", "border", "border-gray-300", "dark:border-gray-600", "rounded", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white", 3, "ngModelChange", "ngModel"], ["type", "button", 1, "px-2", "text-red-600", "hover:text-red-800", 3, "click"], [1, "text-sm"]], template: function FieldConfigDialogComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FieldConfigDialogComponent_Conditional_0_Template, 22, 5, "div", 0);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.isOpen() ? 0 : -1);
  }
}, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, LucideAngularModule, LucideAngularComponent, DynamicFieldRendererComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: contents;\n}\n/*# sourceMappingURL=field-config-dialog.component.css.map */"] });
var FieldConfigDialogComponent = _FieldConfigDialogComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldConfigDialogComponent, [{
    type: Component,
    args: [{ selector: "app-field-config-dialog", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule, DynamicFieldRendererComponent], template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <lucide-angular name="settings" [size]="24" class="text-blue-600"></lucide-angular>
              Configurar Campos Personalizados
            </h2>
            <button
              type="button"
              (click)="handleCancel()"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <lucide-angular name="x" [size]="24"></lucide-angular>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- Lista de campos configurados -->
            <div class="space-y-3">
              @for (field of fields(); track field.id; let idx = $index) {
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1 space-y-3">
                      <div class="grid grid-cols-2 gap-3">
                        <!-- ID del campo -->
                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ID del Campo
                          </label>
                          <input
                            type="text"
                            [(ngModel)]="field.id"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="payment_schedule"
                          />
                        </div>

                        <!-- Label -->
                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Etiqueta
                          </label>
                          <input
                            type="text"
                            [(ngModel)]="field.label"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Cronograma de Pago"
                          />
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-3">
                        <!-- Tipo de campo -->
                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tipo de Campo
                          </label>
                          <select
                            [(ngModel)]="field.type"
                            (ngModelChange)="onFieldTypeChange(field)"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            @for (type of fieldTypes(); track type.id) {
                              <option [value]="type.typeCode">{{ type.typeName }}</option>
                            }
                          </select>
                        </div>

                        <!-- Requerido -->
                        <div class="flex items-cent
                        er pt-6">
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              [(ngModel)]="field.required"
                              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Campo Requerido
                            </span>
                          </label>
                        </div>
                      </div>

                      <!-- Configuraci\xF3n de tabla/cronograma -->
                      @if (field.type === 'table') {
                        <div class="mt-4 p-4 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                          <div class="flex items-center justify-between mb-3">
                            <h4 class="font-medium text-gray-900 dark:text-white">Columnas de la Tabla</h4>
                            <button
                              type="button"
                              (click)="addColumn(field)"
                              class="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              + Agregar Columna
                            </button>
                          </div>

                          @for (column of field.columns; track column.id; let colIdx = $index) {
                            <div class="grid grid-cols-3 gap-2 mb-2">
                              <input
                                type="text"
                                [(ngModel)]="column.id"
                                class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="ID"
                              />
                              <input
                                type="text"
                                [(ngModel)]="column.label"
                                class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="Etiqueta"
                              />
                              <div class="flex gap-1">
                                <select
                                  [(ngModel)]="column.type"
                                  class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                  @for (colType of columnFieldTypes(); track colType.id) {
                                    <option [value]="colType.typeCode">{{ colType.typeName }}</option>
                                  }
                                </select>
                                <button
                                  type="button"
                                  (click)="removeColumn(field, colIdx)"
                                  class="px-2 text-red-600 hover:text-red-800"
                                >
                                  <lucide-angular name="trash-2" [size]="16"></lucide-angular>
                                </button>
                              </div>
                            </div>
                          }
                        </div>
                      }

                      <!-- Texto de ayuda -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Texto de Ayuda (opcional)
                        </label>
                        <input
                          type="text"
                          [(ngModel)]="field.helpText"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Instrucciones para el usuario..."
                        />
                      </div>

                      <!-- Vista Previa -->
                      <div class="mt-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                        <div class="flex items-center gap-2 mb-3">
                          <lucide-angular name="eye" [size]="16" class="text-purple-600 dark:text-purple-400"></lucide-angular>
                          <h5 class="text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wide">Vista Previa</h5>
                        </div>
                        <app-dynamic-field-renderer
                          [schema]="{ fields: [field] }"
                          (dataChange)="onPreviewDataChange($event)"
                        ></app-dynamic-field-renderer>
                      </div>
                    </div>

                    <!-- Bot\xF3n eliminar campo -->
                    <button
                      type="button"
                      (click)="removeField(idx)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <lucide-angular name="trash-2" [size]="20"></lucide-angular>
                    </button>
                  </div>
                </div>
              }

              @if (fields().length === 0) {
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                  
                  <p>No hay campos configurados</p>
                  <p class="text-sm">Haz clic en "Agregar Campo" para empezar</p>
                </div>
              }
            </div>

            <!-- Bot\xF3n agregar campo -->
            <button
              type="button"
              (click)="addField()"
              class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
            >
              <lucide-angular name="plus" [size]="20"></lucide-angular>
              Agregar Campo
            </button>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              (click)="handleCancel()"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="handleSave()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <lucide-angular name="save" [size]="20"></lucide-angular>
              Guardar Configuraci\xF3n
            </button>
          </div>
        </div>
      </div>
    }
  `, styles: ["/* angular:styles/component:css;93756b56e987a68945ac88192773c1a2bb21a2d9096208e7060585053fff0968;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/maintenance/components/field-config-dialog/field-config-dialog.component.ts */\n:host {\n  display: contents;\n}\n/*# sourceMappingURL=field-config-dialog.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FieldConfigDialogComponent, { className: "FieldConfigDialogComponent", filePath: "src/app/maintenance/components/field-config-dialog/field-config-dialog.component.ts", lineNumber: 243 });
})();

// src/app/maintenance/components/typification-form-dialog/typification-form-dialog.component.ts
var _forTrack02 = ($index, $item) => $item.hex;
var _forTrack1 = ($index, $item) => $item.name;
function TypificationFormDialogComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errors()["codigo"]);
  }
}
function TypificationFormDialogComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errors()["nombre"]);
  }
}
function TypificationFormDialogComponent_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errors()["tipoClasificacion"]);
  }
}
function TypificationFormDialogComponent_For_57_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 46);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 20);
  }
}
function TypificationFormDialogComponent_For_57_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 45);
    \u0275\u0275listener("click", function TypificationFormDialogComponent_For_57_Template_button_click_0_listener() {
      const color_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.form.colorSugerido = color_r3.hex);
    });
    \u0275\u0275conditionalCreate(1, TypificationFormDialogComponent_For_57_Conditional_1_Template, 1, 1, "lucide-angular", 46);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const color_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap("w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 flex items-center justify-center " + (ctx_r0.form.colorSugerido === color_r3.hex ? "border-gray-900 dark:border-white ring-2 ring-offset-2 ring-gray-900 dark:ring-white" : "border-gray-300 dark:border-gray-600"));
    \u0275\u0275styleProp("background-color", color_r3.hex);
    \u0275\u0275property("title", color_r3.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.form.colorSugerido === color_r3.hex ? 1 : -1);
  }
}
function TypificationFormDialogComponent_For_75_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 45);
    \u0275\u0275listener("click", function TypificationFormDialogComponent_For_75_Template_button_click_0_listener() {
      const icon_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.form.iconoSugerido = icon_r5.name);
    });
    \u0275\u0275element(1, "lucide-angular", 47);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const icon_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap("p-2.5 rounded-lg border-2 transition-all hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center " + (ctx_r0.form.iconoSugerido === icon_r5.name ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-300" : "border-gray-300 dark:border-gray-600"));
    \u0275\u0275property("title", icon_r5.label);
    \u0275\u0275advance();
    \u0275\u0275property("name", icon_r5.name)("size", 18);
  }
}
function TypificationFormDialogComponent_Conditional_76_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "lucide-angular", 48);
    \u0275\u0275elementStart(2, "span", 49);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 50);
    \u0275\u0275listener("click", function TypificationFormDialogComponent_Conditional_76_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.form.iconoSugerido = "");
    });
    \u0275\u0275element(5, "lucide-angular", 6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r0.form.iconoSugerido)("size", 28);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Icono seleccionado: ", ctx_r0.form.iconoSugerido);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
  }
}
function TypificationFormDialogComponent_Conditional_77_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 33);
    \u0275\u0275text(1, "No has seleccionado ning\xFAn icono");
    \u0275\u0275elementEnd();
  }
}
function TypificationFormDialogComponent_Conditional_87_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "input", 51);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationFormDialogComponent_Conditional_87_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.form.estaActiva, $event) || (ctx_r0.form.estaActiva = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "label", 52);
    \u0275\u0275text(3, " Tipificaci\xF3n Activa ");
    \u0275\u0275elementStart(4, "span", 53);
    \u0275\u0275text(5, "Desmarca para desactivar temporalmente esta tipificaci\xF3n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.form.estaActiva);
  }
}
function TypificationFormDialogComponent_Conditional_88_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37)(1, "div", 54);
    \u0275\u0275element(2, "lucide-angular", 55);
    \u0275\u0275elementStart(3, "span", 56);
    \u0275\u0275text(4, "Tipificaci\xF3n Hijo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "p", 57)(6, "span", 58);
    \u0275\u0275text(7, "Padre:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275elementStart(9, "span", 59);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "p", 60);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r0.parentClassification.nombre, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("(", ctx_r0.parentClassification.codigo, ")");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Esta tipificaci\xF3n ser\xE1 nivel ", ctx_r0.parentClassification.nivelJerarquia + 1, " en la jerarqu\xEDa ");
  }
}
function TypificationFormDialogComponent_Conditional_98_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 61);
    \u0275\u0275text(1, " Guardando... ");
  }
}
function TypificationFormDialogComponent_Conditional_99_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 62);
    \u0275\u0275text(1, " Guardar ");
  }
  if (rf & 2) {
    \u0275\u0275property("size", 18);
  }
}
function TypificationFormDialogComponent_Conditional_100_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-field-config-dialog", 63);
    \u0275\u0275listener("save", function TypificationFormDialogComponent_Conditional_100_Template_app_field_config_dialog_save_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onFieldConfigSave($event));
    })("cancel", function TypificationFormDialogComponent_Conditional_100_Template_app_field_config_dialog_cancel_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onFieldConfigCancel());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("isOpen", ctx_r0.showFieldConfig())("existingSchema", ctx_r0.form.metadataSchema || null);
  }
}
var _TypificationFormDialogComponent = class _TypificationFormDialogComponent {
  constructor(classificationService) {
    this.classificationService = classificationService;
    this.mode = "create";
    this.save = new EventEmitter();
    this.cancel = new EventEmitter();
    this.ClassificationTypeV2 = ClassificationTypeV2;
    this.isEditMode = false;
    this.form = {
      codigo: "",
      nombre: "",
      tipoClasificacion: "",
      descripcion: "",
      ordenVisualizacion: 0,
      iconoSugerido: "",
      colorSugerido: "#3B82F6",
      estaActiva: true
    };
    this.showFieldConfig = signal(false, ...ngDevMode ? [{ debugName: "showFieldConfig" }] : []);
    this.presetColors = [
      { hex: "#3B82F6", name: "Azul" },
      { hex: "#10B981", name: "Verde" },
      { hex: "#EF4444", name: "Rojo" },
      { hex: "#F59E0B", name: "Naranja" },
      { hex: "#8B5CF6", name: "Violeta" },
      { hex: "#EC4899", name: "Rosa" },
      { hex: "#6366F1", name: "\xCDndigo" },
      { hex: "#14B8A6", name: "Turquesa" },
      { hex: "#F97316", name: "Naranja Oscuro" },
      { hex: "#06B6D4", name: "Cyan" },
      { hex: "#84CC16", name: "Lima" },
      { hex: "#A855F7", name: "P\xFArpura" },
      { hex: "#64748B", name: "Gris" },
      { hex: "#0EA5E9", name: "Azul Cielo" },
      { hex: "#22C55E", name: "Verde Claro" },
      { hex: "#DC2626", name: "Rojo Oscuro" }
    ];
    this.commonIcons = [
      { name: "phone", label: "Tel\xE9fono" },
      { name: "phone-call", label: "Llamada" },
      { name: "phone-incoming", label: "Llamada Entrante" },
      { name: "phone-outgoing", label: "Llamada Saliente" },
      { name: "phone-missed", label: "Llamada Perdida" },
      { name: "check-circle", label: "\xC9xito" },
      { name: "x-circle", label: "Error" },
      { name: "alert-circle", label: "Alerta" },
      { name: "alert-triangle", label: "Advertencia" },
      { name: "info", label: "Informaci\xF3n" },
      { name: "user", label: "Usuario" },
      { name: "users", label: "Usuarios" },
      { name: "user-check", label: "Usuario Verificado" },
      { name: "user-x", label: "Usuario Rechazado" },
      { name: "credit-card", label: "Tarjeta" },
      { name: "dollar-sign", label: "Dinero" },
      { name: "banknote", label: "Billete" },
      { name: "coins", label: "Monedas" },
      { name: "calendar", label: "Calendario" },
      { name: "calendar-check", label: "Fecha Confirmada" },
      { name: "calendar-x", label: "Fecha Cancelada" },
      { name: "clock", label: "Reloj" },
      { name: "timer", label: "Temporizador" },
      { name: "mail", label: "Correo" },
      { name: "message-square", label: "Mensaje" },
      { name: "message-circle", label: "Chat" },
      { name: "file-text", label: "Documento" },
      { name: "file-check", label: "Documento Aprobado" },
      { name: "file-x", label: "Documento Rechazado" },
      { name: "building", label: "Edificio" },
      { name: "home", label: "Casa" },
      { name: "wallet", label: "Billetera" },
      { name: "briefcase", label: "Malet\xEDn" },
      { name: "trending-up", label: "Tendencia Positiva" },
      { name: "trending-down", label: "Tendencia Negativa" },
      { name: "thumbs-up", label: "Me gusta" },
      { name: "thumbs-down", label: "No me gusta" },
      { name: "star", label: "Estrella" },
      { name: "heart", label: "Coraz\xF3n" },
      { name: "bell", label: "Campana" },
      { name: "bell-off", label: "Silenciar" },
      { name: "settings", label: "Configuraci\xF3n" },
      { name: "shield", label: "Seguridad" },
      { name: "shield-check", label: "Verificado" },
      { name: "lock", label: "Bloqueado" },
      { name: "unlock", label: "Desbloqueado" },
      { name: "map-pin", label: "Ubicaci\xF3n" },
      { name: "navigation", label: "Navegaci\xF3n" },
      { name: "send", label: "Enviar" },
      { name: "download", label: "Descargar" },
      { name: "upload", label: "Subir" },
      { name: "plus-circle", label: "Agregar" },
      { name: "minus-circle", label: "Quitar" },
      { name: "edit", label: "Editar" },
      { name: "trash", label: "Eliminar" },
      { name: "archive", label: "Archivar" },
      { name: "bookmark", label: "Marcador" },
      { name: "tag", label: "Etiqueta" },
      { name: "flag", label: "Bandera" },
      { name: "zap", label: "Rayo" },
      { name: "target", label: "Objetivo" }
    ];
    this.saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
    this.errors = signal({}, ...ngDevMode ? [{ debugName: "errors" }] : []);
  }
  ngOnInit() {
    this.isEditMode = this.mode === "edit";
    if (this.defaultType) {
      this.form.tipoClasificacion = this.defaultType;
    }
    if (this.isEditMode && this.typification) {
      this.form = {
        codigo: this.typification.codigo,
        nombre: this.typification.nombre,
        tipoClasificacion: this.typification.tipoClasificacion,
        descripcion: this.typification.descripcion || "",
        ordenVisualizacion: this.typification.ordenVisualizacion || 0,
        iconoSugerido: this.typification.iconoSugerido || "",
        colorSugerido: this.typification.colorSugerido || "#3B82F6",
        estaActiva: this.typification.estaActiva
      };
      this.loadExistingFields();
    }
  }
  /**
   * Carga los campos adicionales existentes de la tipificación
   */
  loadExistingFields() {
    if (!this.typification?.id)
      return;
    this.classificationService.getAdditionalFields(this.typification.id).subscribe({
      next: (fields) => {
        if (fields && fields.length > 0) {
          this.form.metadataSchema = this.convertAdditionalFieldsToMetadata(fields);
          console.log("\u2705 Campos existentes cargados:", fields.length);
        }
      },
      error: (error) => {
        console.warn("No se pudieron cargar campos existentes:", error);
      }
    });
  }
  /**
   * Convierte AdditionalFieldV2[] a MetadataSchema para el editor
   */
  convertAdditionalFieldsToMetadata(fields) {
    return {
      fields: fields.map((field) => ({
        id: field.nombreCampo,
        label: field.labelCampo,
        type: this.mapFieldTypeV2ToFieldType(field.tipoCampo),
        required: field.esRequerido,
        displayOrder: field.ordenVisualizacion,
        min: field.valorMinimo,
        max: field.valorMaximo,
        maxLength: field.longitudMaxima
      }))
    };
  }
  /**
   * Mapea tipo del backend a FieldType para el editor
   */
  mapFieldTypeV2ToFieldType(type) {
    const typeStr = String(type).toUpperCase();
    const typeMap = {
      "TEXT": "text",
      "TEXTAREA": "textarea",
      "NUMBER": "number",
      "DECIMAL": "decimal",
      "CURRENCY": "currency",
      "DATE": "date",
      "TIME": "time",
      "DATETIME": "datetime",
      "CHECKBOX": "checkbox",
      "SELECT": "select",
      "CHIP_SELECT": "select",
      "MULTISELECT": "multiselect",
      "EMAIL": "email",
      "PHONE": "phone",
      "URL": "url",
      "TABLE": "table",
      "PAYMENT_SCHEDULE": "payment_schedule"
    };
    return typeMap[typeStr] || "text";
  }
  validate() {
    const newErrors = {};
    if (!this.form.codigo.trim()) {
      newErrors["codigo"] = "El c\xF3digo es requerido";
    }
    if (!this.form.nombre.trim()) {
      newErrors["nombre"] = "El nombre es requerido";
    }
    if (!this.form.tipoClasificacion) {
      newErrors["tipoClasificacion"] = "El tipo de clasificaci\xF3n es requerido";
    }
    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  onSave() {
    if (!this.validate())
      return;
    this.saving.set(true);
    if (this.isEditMode && this.typification) {
      this.updateTypification();
    } else {
      this.createTypification();
    }
  }
  createTypification() {
    const command = {
      codigo: this.form.codigo.trim(),
      nombre: this.form.nombre.trim(),
      tipoClasificacion: this.form.tipoClasificacion,
      parentTypificationId: this.parentClassification ? this.parentClassification.id : void 0,
      descripcion: this.form.descripcion.trim() || void 0,
      ordenVisualizacion: this.form.ordenVisualizacion,
      iconoSugerido: this.form.iconoSugerido.trim() || void 0,
      colorSugerido: this.form.colorSugerido || void 0
    };
    this.classificationService.createTypification(command).subscribe({
      next: (created) => {
        console.log("\u2705 Clasificaci\xF3n creada:", created);
        if (this.tenantId) {
          console.log(`\u{1F504} Auto-habilitando clasificaci\xF3n ${created.id} para tenant ${this.tenantId}`);
          this.classificationService.enableClassification(this.tenantId, created.id, this.portfolioId).subscribe({
            next: () => {
              console.log("\u2705 Clasificaci\xF3n auto-habilitada para el tenant");
              this.saving.set(false);
              this.save.emit(created);
            },
            error: (error) => {
              console.error("\u26A0\uFE0F Error al auto-habilitar (pero la clasificaci\xF3n se cre\xF3):", error);
              this.saving.set(false);
              this.save.emit(created);
            }
          });
        } else {
          this.saving.set(false);
          this.save.emit(created);
        }
      },
      error: (error) => {
        console.error("Error al crear tipificaci\xF3n:", error);
        this.saving.set(false);
        alert("Error al crear la tipificaci\xF3n. Verifique que el c\xF3digo no est\xE9 duplicado.");
      }
    });
  }
  updateTypification() {
    if (!this.typification)
      return;
    const command = {
      nombre: this.form.nombre.trim(),
      descripcion: this.form.descripcion.trim() || void 0,
      ordenVisualizacion: this.form.ordenVisualizacion,
      iconoSugerido: this.form.iconoSugerido.trim() || void 0,
      colorSugerido: this.form.colorSugerido || void 0,
      estaActiva: this.form.estaActiva
    };
    this.classificationService.updateTypification(this.typification.id, command).subscribe({
      next: (updated) => {
        if (this.form.metadataSchema?.fields?.length) {
          const additionalFields = this.convertMetadataToAdditionalFields(this.form.metadataSchema);
          this.classificationService.saveAdditionalFields(this.typification.id, additionalFields).subscribe({
            next: () => {
              console.log("\u2705 Campos adicionales guardados");
              this.saving.set(false);
              this.save.emit(updated);
            },
            error: (error) => {
              console.error("\u26A0\uFE0F Error al guardar campos adicionales:", error);
              this.saving.set(false);
              this.save.emit(updated);
            }
          });
        } else {
          this.saving.set(false);
          this.save.emit(updated);
        }
      },
      error: (error) => {
        console.error("Error al actualizar tipificaci\xF3n:", error);
        this.saving.set(false);
        alert("Error al actualizar la tipificaci\xF3n.");
      }
    });
  }
  /**
   * Convierte MetadataSchema a AdditionalFieldV2[] para el backend
   */
  convertMetadataToAdditionalFields(schema) {
    return schema.fields.map((field, index) => ({
      id: 0,
      // El backend asignará el ID
      nombreCampo: field.id,
      tipoCampo: this.mapFieldType(field.type),
      labelCampo: field.label,
      esRequerido: field.required || false,
      ordenVisualizacion: field.displayOrder ?? index * 10,
      valorMinimo: field.min,
      valorMaximo: field.max,
      longitudMaxima: field.maxLength
    }));
  }
  /**
   * Mapea tipos de FieldConfig a string para el backend
   */
  mapFieldType(type) {
    return type.toUpperCase().replace("_", "_");
  }
  onCancel() {
    this.cancel.emit();
  }
  getDialogTitle() {
    if (this.isEditMode) {
      return "Editar Tipificaci\xF3n";
    }
    if (this.parentClassification) {
      return `Nueva Tipificaci\xF3n - Nivel ${this.parentClassification.nivelJerarquia + 1}`;
    }
    return "Nueva Tipificaci\xF3n - Nivel 1";
  }
  openFieldConfig() {
    console.log("\u{1F527} Abriendo configuraci\xF3n de campos din\xE1micos");
    this.showFieldConfig.set(true);
  }
  onFieldConfigSave(schema) {
    console.log("\u{1F4BE} Guardando configuraci\xF3n de campos:", schema);
    this.form.metadataSchema = schema;
    this.showFieldConfig.set(false);
  }
  onFieldConfigCancel() {
    console.log("\u274C Cancelando configuraci\xF3n de campos");
    this.showFieldConfig.set(false);
  }
};
_TypificationFormDialogComponent.\u0275fac = function TypificationFormDialogComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TypificationFormDialogComponent)(\u0275\u0275directiveInject(TypificationV2Service));
};
_TypificationFormDialogComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TypificationFormDialogComponent, selectors: [["app-typification-form-dialog"]], inputs: { mode: "mode", typification: "typification", parentClassification: "parentClassification", defaultType: "defaultType", tenantId: "tenantId", portfolioId: "portfolioId" }, outputs: { save: "save", cancel: "cancel" }, decls: 101, vars: 37, consts: [[1, "fixed", "inset-0", "bg-black/50", "dark:bg-black/70", "flex", "items-center", "justify-center", "z-50", "p-4", "transition-opacity", "duration-300", 3, "click"], [1, "bg-white", "dark:bg-slate-900", "rounded-lg", "shadow-2xl", "max-w-4xl", "w-full", "max-h-[90vh]", "overflow-auto", "transition-all", "duration-300", "transform", 3, "click"], [1, "sticky", "top-0", "bg-gradient-to-r", "from-blue-600", "to-blue-700", "dark:from-blue-700", "dark:to-blue-800", "text-white", "px-6", "py-4", "flex", "items-center", "justify-between", "rounded-t-lg", "z-10"], [1, "text-xl", "font-bold"], [1, "text-sm", "text-blue-100", "dark:text-blue-200"], [1, "p-2", "hover:bg-white/20", "rounded-lg", "transition-colors", 3, "click"], ["name", "x", 3, "size"], [1, "p-6", "space-y-6"], [1, "grid", "grid-cols-2", "gap-4"], [1, "block", "text-sm", "font-bold", "text-gray-700", "dark:text-gray-200", "mb-2"], [1, "text-red-500"], ["type", "text", "placeholder", "Ej: CPC, ACP, PPR", "maxlength", "20", 1, "w-full", "px-4", "py-2.5", "border", "border-gray-300", "dark:border-gray-600", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", "placeholder:text-gray-400", "dark:placeholder:text-gray-500", "disabled:bg-gray-100", "dark:disabled:bg-slate-700", "disabled:cursor-not-allowed", "text-sm", 3, "ngModelChange", "ngModel", "disabled"], [1, "text-red-500", "text-xs", "mt-1"], ["type", "text", "placeholder", "Ej: Contacto con Cliente, Promesa de Pago", "maxlength", "255", 1, "w-full", "px-4", "py-2.5", "border", "border-gray-300", "dark:border-gray-600", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", "placeholder:text-gray-400", "dark:placeholder:text-gray-500", "text-sm", 3, "ngModelChange", "ngModel"], [1, "w-full", "px-4", "py-2.5", "border", "border-gray-300", "dark:border-gray-600", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", "disabled:bg-gray-100", "dark:disabled:bg-slate-700", "disabled:cursor-not-allowed", "text-sm", 3, "ngModelChange", "ngModel", "disabled"], ["value", ""], [3, "value"], [1, "text-xs", "font-normal", "text-gray-500", "dark:text-gray-400", "ml-1"], ["rows", "3", "placeholder", "Descripci\xF3n detallada de la tipificaci\xF3n...", 1, "w-full", "px-4", "py-2.5", "border", "border-gray-300", "dark:border-gray-600", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "resize-none", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", "placeholder:text-gray-400", "dark:placeholder:text-gray-500", "text-sm", 3, "ngModelChange", "ngModel"], [1, "block", "text-sm", "font-bold", "text-gray-700", "dark:text-gray-200", "mb-3"], [1, "space-y-3"], [1, "grid", "grid-cols-8", "gap-2"], ["type", "button", 3, "class", "background-color", "title"], [1, "flex", "items-center", "gap-3", "p-3", "bg-gray-50", "dark:bg-slate-800", "rounded-lg", "border", "border-gray-200", "dark:border-gray-700"], [1, "text-sm", "font-semibold", "text-gray-700", "dark:text-gray-200"], ["type", "color", 1, "h-12", "w-24", "border-2", "border-gray-300", "dark:border-gray-600", "rounded-lg", "cursor-pointer", 3, "ngModelChange", "ngModel"], [1, "flex-1", "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-lg", "border-2", "border-gray-300", "dark:border-gray-600"], [1, "text-sm", "font-mono", "font-bold", "text-gray-700", "dark:text-gray-300"], [1, "max-h-64", "overflow-y-auto", "border", "border-gray-200", "dark:border-gray-700", "rounded-lg", "p-3", "bg-gray-50", "dark:bg-slate-800/50"], [1, "grid", "grid-cols-8", "md:grid-cols-10", "lg:grid-cols-12", "gap-2"], ["type", "button", 3, "class", "title"], [1, "flex", "items-center", "gap-3", "p-3", "bg-blue-50", "dark:bg-blue-950/30", "rounded-lg", "border", "border-blue-200", "dark:border-blue-900"], [1, "text-xs", "text-gray-500", "dark:text-gray-400"], ["type", "number", "min", "0", "step", "10", "placeholder", "0, 10, 20, 30...", 1, "w-full", "px-4", "py-2.5", "border", "border-gray-300", "dark:border-gray-600", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", "text-sm", 3, "ngModelChange", "ngModel"], [1, "text-xs", "text-gray-500", "dark:text-gray-400", "mt-1", "flex", "items-center", "gap-1"], ["name", "alert-circle", 3, "size"], [1, "bg-blue-50", "dark:bg-blue-950/30", "border", "border-blue-200", "dark:border-blue-900/50", "rounded-lg", "p-4"], [1, "sticky", "bottom-0", "bg-gray-50", "dark:bg-slate-800", "px-6", "py-4", "flex", "justify-between", "items-center", "rounded-b-lg", "border-t", "border-gray-200", "dark:border-gray-700"], ["type", "button", 1, "px-4", "py-2.5", "text-indigo-600", "dark:text-indigo-400", "bg-indigo-50", "dark:bg-indigo-950/30", "border", "border-indigo-300", "dark:border-indigo-800", "rounded-lg", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/50", "font-semibold", "transition-colors", "flex", "items-center", "gap-2", "text-sm", 3, "click"], ["name", "settings", 3, "size"], [1, "flex", "gap-3"], [1, "px-6", "py-2.5", "text-gray-700", "dark:text-gray-200", "bg-white", "dark:bg-slate-700", "border", "border-gray-300", "dark:border-gray-600", "rounded-lg", "hover:bg-gray-50", "dark:hover:bg-slate-600", "font-semibold", "transition-colors", "flex", "items-center", "gap-2", "text-sm", 3, "click"], [1, "px-6", "py-2.5", "bg-gradient-to-r", "from-blue-600", "to-blue-700", "hover:from-blue-700", "hover:to-blue-800", "disabled:from-gray-400", "disabled:to-gray-500", "text-white", "rounded-lg", "font-semibold", "transition-all", "shadow-md", "hover:shadow-lg", "flex", "items-center", "gap-2", "text-sm", 3, "click", "disabled"], [3, "isOpen", "existingSchema"], ["type", "button", 3, "click", "title"], ["name", "check-circle", 1, "text-white", "drop-shadow-lg", 3, "size"], [1, "text-gray-700", "dark:text-gray-200", 3, "name", "size"], [1, "text-blue-600", "dark:text-blue-400", 3, "name", "size"], [1, "text-sm", "font-semibold", "text-blue-800", "dark:text-blue-200"], ["type", "button", 1, "ml-auto", "text-blue-600", "dark:text-blue-400", "hover:text-blue-800", "dark:hover:text-blue-200", 3, "click"], ["type", "checkbox", "id", "estaActiva", 1, "w-5", "h-5", "text-blue-600", "bg-gray-100", "dark:bg-gray-700", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-blue-500", "cursor-pointer", 3, "ngModelChange", "ngModel"], ["for", "estaActiva", 1, "text-sm", "font-bold", "text-gray-700", "dark:text-gray-200", "cursor-pointer", "flex-1"], [1, "block", "text-xs", "font-normal", "text-gray-500", "dark:text-gray-400", "mt-0.5"], [1, "flex", "items-center", "gap-2", "text-blue-800", "dark:text-blue-200", "mb-1"], ["name", "git-branch", 3, "size"], [1, "font-bold"], [1, "text-sm", "text-blue-700", "dark:text-blue-300"], [1, "font-semibold"], [1, "text-xs", "opacity-75"], [1, "text-xs", "text-blue-600", "dark:text-blue-400", "mt-1"], [1, "w-4", "h-4", "border-2", "border-white", "border-t-transparent", "rounded-full", "animate-spin"], ["name", "save", 3, "size"], [3, "save", "cancel", "isOpen", "existingSchema"]], template: function TypificationFormDialogComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275listener("click", function TypificationFormDialogComponent_Template_div_click_0_listener() {
      return ctx.onCancel();
    });
    \u0275\u0275elementStart(1, "div", 1);
    \u0275\u0275listener("click", function TypificationFormDialogComponent_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(2, "div", 2)(3, "div")(4, "h2", 3);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 4);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 5);
    \u0275\u0275listener("click", function TypificationFormDialogComponent_Template_button_click_8_listener() {
      return ctx.onCancel();
    });
    \u0275\u0275element(9, "lucide-angular", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 7)(11, "div", 8)(12, "div")(13, "label", 9);
    \u0275\u0275text(14, " C\xF3digo ");
    \u0275\u0275elementStart(15, "span", 10);
    \u0275\u0275text(16, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "input", 11);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationFormDialogComponent_Template_input_ngModelChange_17_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.form.codigo, $event) || (ctx.form.codigo = $event);
      return $event;
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, TypificationFormDialogComponent_Conditional_18_Template, 2, 1, "p", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div")(20, "label", 9);
    \u0275\u0275text(21, " Nombre ");
    \u0275\u0275elementStart(22, "span", 10);
    \u0275\u0275text(23, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "input", 13);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationFormDialogComponent_Template_input_ngModelChange_24_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.form.nombre, $event) || (ctx.form.nombre = $event);
      return $event;
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(25, TypificationFormDialogComponent_Conditional_25_Template, 2, 1, "p", 12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div")(27, "label", 9);
    \u0275\u0275text(28, " Tipo de Clasificaci\xF3n ");
    \u0275\u0275elementStart(29, "span", 10);
    \u0275\u0275text(30, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "select", 14);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationFormDialogComponent_Template_select_ngModelChange_31_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.form.tipoClasificacion, $event) || (ctx.form.tipoClasificacion = $event);
      return $event;
    });
    \u0275\u0275elementStart(32, "option", 15);
    \u0275\u0275text(33, "-- Seleccionar --");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "option", 16);
    \u0275\u0275text(35, "Resultado de Contacto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "option", 16);
    \u0275\u0275text(37, "Tipo de Gesti\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "option", 16);
    \u0275\u0275text(39, "Modalidad de Pago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "option", 16);
    \u0275\u0275text(41, "Tipo de Fraccionamiento");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(42, TypificationFormDialogComponent_Conditional_42_Template, 2, 1, "p", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "div")(44, "label", 9);
    \u0275\u0275text(45, " Descripci\xF3n ");
    \u0275\u0275elementStart(46, "span", 17);
    \u0275\u0275text(47, "(Opcional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(48, "textarea", 18);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationFormDialogComponent_Template_textarea_ngModelChange_48_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.form.descripcion, $event) || (ctx.form.descripcion = $event);
      return $event;
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(49, "div")(50, "label", 19);
    \u0275\u0275text(51, " Color de Identificaci\xF3n ");
    \u0275\u0275elementStart(52, "span", 17);
    \u0275\u0275text(53, "(Selecciona el color que representar\xE1 esta tipificaci\xF3n)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(54, "div", 20)(55, "div", 21);
    \u0275\u0275repeaterCreate(56, TypificationFormDialogComponent_For_57_Template, 2, 6, "button", 22, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "div", 23)(59, "label", 24);
    \u0275\u0275text(60, "Color personalizado:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "input", 25);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationFormDialogComponent_Template_input_ngModelChange_61_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.form.colorSugerido, $event) || (ctx.form.colorSugerido = $event);
      return $event;
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "div", 26);
    \u0275\u0275element(63, "div", 27);
    \u0275\u0275elementStart(64, "span", 28);
    \u0275\u0275text(65);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(66, "div")(67, "label", 19);
    \u0275\u0275text(68, " Icono Visual ");
    \u0275\u0275elementStart(69, "span", 17);
    \u0275\u0275text(70);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(71, "div", 20)(72, "div", 29)(73, "div", 30);
    \u0275\u0275repeaterCreate(74, TypificationFormDialogComponent_For_75_Template, 2, 5, "button", 31, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(76, TypificationFormDialogComponent_Conditional_76_Template, 6, 4, "div", 32)(77, TypificationFormDialogComponent_Conditional_77_Template, 2, 0, "p", 33);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(78, "div")(79, "label", 9);
    \u0275\u0275text(80, " Orden de Visualizaci\xF3n ");
    \u0275\u0275elementStart(81, "span", 17);
    \u0275\u0275text(82, "(Menor n\xFAmero aparece primero)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(83, "input", 34);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationFormDialogComponent_Template_input_ngModelChange_83_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.form.ordenVisualizacion, $event) || (ctx.form.ordenVisualizacion = $event);
      return $event;
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "p", 35);
    \u0275\u0275element(85, "lucide-angular", 36);
    \u0275\u0275text(86, " Tip: Usa m\xFAltiplos de 10 (10, 20, 30...) para facilitar inserciones futuras ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(87, TypificationFormDialogComponent_Conditional_87_Template, 6, 1, "div", 23);
    \u0275\u0275conditionalCreate(88, TypificationFormDialogComponent_Conditional_88_Template, 13, 4, "div", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(89, "div", 38)(90, "button", 39);
    \u0275\u0275listener("click", function TypificationFormDialogComponent_Template_button_click_90_listener() {
      return ctx.openFieldConfig();
    });
    \u0275\u0275element(91, "lucide-angular", 40);
    \u0275\u0275text(92, " Configurar Campos Din\xE1micos ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(93, "div", 41)(94, "button", 42);
    \u0275\u0275listener("click", function TypificationFormDialogComponent_Template_button_click_94_listener() {
      return ctx.onCancel();
    });
    \u0275\u0275element(95, "lucide-angular", 6);
    \u0275\u0275text(96, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "button", 43);
    \u0275\u0275listener("click", function TypificationFormDialogComponent_Template_button_click_97_listener() {
      return ctx.onSave();
    });
    \u0275\u0275conditionalCreate(98, TypificationFormDialogComponent_Conditional_98_Template, 2, 0)(99, TypificationFormDialogComponent_Conditional_99_Template, 2, 1);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275conditionalCreate(100, TypificationFormDialogComponent_Conditional_100_Template, 1, 2, "app-field-config-dialog", 44);
  }
  if (rf & 2) {
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx.getDialogTitle());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx.isEditMode ? "Modificar tipificaci\xF3n existente" : "Crear nueva tipificaci\xF3n", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(8);
    \u0275\u0275classProp("border-red-500", ctx.errors()["codigo"]);
    \u0275\u0275twoWayProperty("ngModel", ctx.form.codigo);
    \u0275\u0275property("disabled", ctx.isEditMode);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.errors()["codigo"] ? 18 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("border-red-500", ctx.errors()["nombre"]);
    \u0275\u0275twoWayProperty("ngModel", ctx.form.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.errors()["nombre"] ? 25 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("border-red-500", ctx.errors()["tipoClasificacion"]);
    \u0275\u0275twoWayProperty("ngModel", ctx.form.tipoClasificacion);
    \u0275\u0275property("disabled", ctx.isEditMode || !!ctx.defaultType);
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx.ClassificationTypeV2.RESULTADO_CONTACTO);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx.ClassificationTypeV2.TIPO_GESTION);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx.ClassificationTypeV2.MODALIDAD_PAGO);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx.ClassificationTypeV2.TIPO_FRACCIONAMIENTO);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.errors()["tipoClasificacion"] ? 42 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx.form.descripcion);
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx.presetColors);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx.form.colorSugerido);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background-color", ctx.form.colorSugerido);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.form.colorSugerido);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("(", ctx.commonIcons.length, " iconos disponibles)");
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx.commonIcons);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.form.iconoSugerido ? 76 : 77);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx.form.ordenVisualizacion);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.isEditMode ? 87 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.parentClassification ? 88 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx.saving());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.saving() ? 98 : 99);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.showFieldConfig() ? 100 : -1);
  }
}, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, MaxLengthValidator, MinValidator, NgModel, LucideAngularModule, LucideAngularComponent, FieldConfigDialogComponent], encapsulation: 2 });
var TypificationFormDialogComponent = _TypificationFormDialogComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TypificationFormDialogComponent, [{
    type: Component,
    args: [{
      selector: "app-typification-form-dialog",
      standalone: true,
      imports: [CommonModule, FormsModule, LucideAngularModule, FieldConfigDialogComponent],
      template: `
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
         (click)="onCancel()">

      <!-- Dialog -->
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto transition-all duration-300 transform"
           (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white px-6 py-4 flex items-center justify-between rounded-t-lg z-10">
          <div>
            <h2 class="text-xl font-bold">{{ getDialogTitle() }}</h2>
            <p class="text-sm text-blue-100 dark:text-blue-200">
              {{ isEditMode ? 'Modificar tipificaci\xF3n existente' : 'Crear nueva tipificaci\xF3n' }}
            </p>
          </div>
          <button
            (click)="onCancel()"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <lucide-angular name="x" [size]="24"></lucide-angular>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-6">
          <!-- Code and Name -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                C\xF3digo <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="form.codigo"
                [disabled]="isEditMode"
                placeholder="Ej: CPC, ACP, PPR"
                maxlength="20"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-sm"
                [class.border-red-500]="errors()['codigo']"
              />
              @if (errors()['codigo']) {
                <p class="text-red-500 text-xs mt-1">{{ errors()['codigo'] }}</p>
              }
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                Nombre <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="form.nombre"
                placeholder="Ej: Contacto con Cliente, Promesa de Pago"
                maxlength="255"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm"
                [class.border-red-500]="errors()['nombre']"
              />
              @if (errors()['nombre']) {
                <p class="text-red-500 text-xs mt-1">{{ errors()['nombre'] }}</p>
              }
            </div>
          </div>

          <!-- Classification Type -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              Tipo de Clasificaci\xF3n <span class="text-red-500">*</span>
            </label>
            <select
              [(ngModel)]="form.tipoClasificacion"
              [disabled]="isEditMode || !!defaultType"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-sm"
              [class.border-red-500]="errors()['tipoClasificacion']">
              <option value="">-- Seleccionar --</option>
              <option [value]="ClassificationTypeV2.RESULTADO_CONTACTO">Resultado de Contacto</option>
              <option [value]="ClassificationTypeV2.TIPO_GESTION">Tipo de Gesti\xF3n</option>
              <option [value]="ClassificationTypeV2.MODALIDAD_PAGO">Modalidad de Pago</option>
              <option [value]="ClassificationTypeV2.TIPO_FRACCIONAMIENTO">Tipo de Fraccionamiento</option>
            </select>
            @if (errors()['tipoClasificacion']) {
              <p class="text-red-500 text-xs mt-1">{{ errors()['tipoClasificacion'] }}</p>
            }
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              Descripci\xF3n
              <span class="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">(Opcional)</span>
            </label>
            <textarea
              [(ngModel)]="form.descripcion"
              rows="3"
              placeholder="Descripci\xF3n detallada de la tipificaci\xF3n..."
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm"
            ></textarea>
          </div>

          <!-- Color Selector -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
              Color de Identificaci\xF3n
              <span class="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">(Selecciona el color que representar\xE1 esta tipificaci\xF3n)</span>
            </label>
            <div class="space-y-3">
              <!-- Preset Colors -->
              <div class="grid grid-cols-8 gap-2">
                @for (color of presetColors; track color.hex) {
                  <button
                    type="button"
                    (click)="form.colorSugerido = color.hex"
                    [class]="'w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 flex items-center justify-center ' +
                             (form.colorSugerido === color.hex ? 'border-gray-900 dark:border-white ring-2 ring-offset-2 ring-gray-900 dark:ring-white' : 'border-gray-300 dark:border-gray-600')"
                    [style.background-color]="color.hex"
                    [title]="color.name">
                    @if (form.colorSugerido === color.hex) {
                      <lucide-angular name="check-circle" [size]="20" class="text-white drop-shadow-lg"></lucide-angular>
                    }
                  </button>
                }
              </div>

              <!-- Custom Color Picker -->
              <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Color personalizado:</label>
                <input
                  type="color"
                  [(ngModel)]="form.colorSugerido"
                  class="h-12 w-24 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
                <div class="flex-1 flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                    [style.background-color]="form.colorSugerido">
                  </div>
                  <span class="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">{{ form.colorSugerido }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Icon Selector -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
              Icono Visual
              <span class="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">({{ commonIcons.length }} iconos disponibles)</span>
            </label>
            <div class="space-y-3">
              <!-- Common Icons - Scrollable Grid -->
              <div class="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-slate-800/50">
                <div class="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                  @for (icon of commonIcons; track icon.name) {
                    <button
                      type="button"
                      (click)="form.iconoSugerido = icon.name"
                      [class]="'p-2.5 rounded-lg border-2 transition-all hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center ' +
                               (form.iconoSugerido === icon.name ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-300' : 'border-gray-300 dark:border-gray-600')"
                      [title]="icon.label">
                      <lucide-angular [name]="icon.name" [size]="18" class="text-gray-700 dark:text-gray-200"></lucide-angular>
                    </button>
                  }
                </div>
              </div>

              <!-- Selected Icon Preview -->
              @if (form.iconoSugerido) {
                <div class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <lucide-angular [name]="form.iconoSugerido" [size]="28" class="text-blue-600 dark:text-blue-400"></lucide-angular>
                  <span class="text-sm font-semibold text-blue-800 dark:text-blue-200">Icono seleccionado: {{ form.iconoSugerido }}</span>
                  <button
                    type="button"
                    (click)="form.iconoSugerido = ''"
                    class="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                    <lucide-angular name="x" [size]="18"></lucide-angular>
                  </button>
                </div>
              } @else {
                <p class="text-xs text-gray-500 dark:text-gray-400">No has seleccionado ning\xFAn icono</p>
              }
            </div>
          </div>

          <!-- Display Order -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              Orden de Visualizaci\xF3n
              <span class="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">(Menor n\xFAmero aparece primero)</span>
            </label>
            <input
              type="number"
              [(ngModel)]="form.ordenVisualizacion"
              min="0"
              step="10"
              placeholder="0, 10, 20, 30..."
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <lucide-angular name="alert-circle" [size]="12"></lucide-angular>
              Tip: Usa m\xFAltiplos de 10 (10, 20, 30...) para facilitar inserciones futuras
            </p>
          </div>

          <!-- Is Active -->
          @if (isEditMode) {
            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                id="estaActiva"
                [(ngModel)]="form.estaActiva"
                class="w-5 h-5 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label for="estaActiva" class="text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer flex-1">
                Tipificaci\xF3n Activa
                <span class="block text-xs font-normal text-gray-500 dark:text-gray-400 mt-0.5">Desmarca para desactivar temporalmente esta tipificaci\xF3n</span>
              </label>
            </div>
          }

          @if (parentClassification) {
            <div class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4">
              <div class="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-1">
                <lucide-angular name="git-branch" [size]="16"></lucide-angular>
                <span class="font-bold">Tipificaci\xF3n Hijo</span>
              </div>
              <p class="text-sm text-blue-700 dark:text-blue-300">
                <span class="font-semibold">Padre:</span> {{ parentClassification.nombre }} <span class="text-xs opacity-75">({{ parentClassification.codigo }})</span>
              </p>
              <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Esta tipificaci\xF3n ser\xE1 nivel {{ parentClassification.nivelJerarquia + 1 }} en la jerarqu\xEDa
              </p>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 dark:bg-slate-800 px-6 py-4 flex justify-between items-center rounded-b-lg border-t border-gray-200 dark:border-gray-700">
          <!-- Left side: Configure Fields button -->
          <button
            type="button"
            (click)="openFieldConfig()"
            class="px-4 py-2.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-300 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-semibold transition-colors flex items-center gap-2 text-sm">
            <lucide-angular name="settings" [size]="18"></lucide-angular>
            Configurar Campos Din\xE1micos
          </button>

          <!-- Right side: Cancel and Save buttons -->
          <div class="flex gap-3">
            <button
              (click)="onCancel()"
              class="px-6 py-2.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 font-semibold transition-colors flex items-center gap-2 text-sm">
              <lucide-angular name="x" [size]="18"></lucide-angular>
              Cancelar
            </button>
            <button
              (click)="onSave()"
              [disabled]="saving()"
              class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm">
              @if (saving()) {
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              } @else {
                <lucide-angular name="save" [size]="18"></lucide-angular>
                Guardar
              }
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Field Config Dialog -->
    @if (showFieldConfig()) {
      <app-field-config-dialog
        [isOpen]="showFieldConfig()"
        [existingSchema]="form.metadataSchema || null"
        (save)="onFieldConfigSave($event)"
        (cancel)="onFieldConfigCancel()"
      />
    }
  `
    }]
  }], () => [{ type: TypificationV2Service }], { mode: [{
    type: Input
  }], typification: [{
    type: Input
  }], parentClassification: [{
    type: Input
  }], defaultType: [{
    type: Input
  }], tenantId: [{
    type: Input
  }], portfolioId: [{
    type: Input
  }], save: [{
    type: Output
  }], cancel: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TypificationFormDialogComponent, { className: "TypificationFormDialogComponent", filePath: "src/app/maintenance/components/typification-form-dialog/typification-form-dialog.component.ts", lineNumber: 315 });
})();

// src/app/maintenance/models/typification.model.ts
var ClassificationType;
(function(ClassificationType2) {
  ClassificationType2["CONTACT_RESULT"] = "CONTACT_RESULT";
  ClassificationType2["MANAGEMENT_TYPE"] = "MANAGEMENT_TYPE";
  ClassificationType2["PAYMENT_TYPE"] = "PAYMENT_TYPE";
  ClassificationType2["COMPLAINT_TYPE"] = "COMPLAINT_TYPE";
  ClassificationType2["PAYMENT_SCHEDULE"] = "PAYMENT_SCHEDULE";
  ClassificationType2["CUSTOM"] = "CUSTOM";
})(ClassificationType || (ClassificationType = {}));
var FieldType;
(function(FieldType2) {
  FieldType2["DATE"] = "DATE";
  FieldType2["NUMBER"] = "NUMBER";
  FieldType2["TEXT"] = "TEXT";
  FieldType2["TEXTAREA"] = "TEXTAREA";
})(FieldType || (FieldType = {}));

// src/app/maintenance/services/classification-type.service.ts
var _ClassificationTypeService = class _ClassificationTypeService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${environment.gatewayUrl}/classification-types`;
  }
  /**
   * Obtiene todos los tipos de clasificación activos
   */
  getActiveTypes() {
    return this.http.get(`${this.baseUrl}/active`);
  }
  /**
   * Obtiene todos los tipos de clasificación
   */
  getAllTypes() {
    return this.http.get(`${this.baseUrl}`);
  }
  /**
   * Obtiene un tipo por ID
   */
  getTypeById(id) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  /**
   * Obtiene un tipo por código
   */
  getTypeByCode(code) {
    return this.http.get(`${this.baseUrl}/code/${code}`);
  }
  /**
   * Crea un nuevo tipo de clasificación
   */
  createType(type) {
    return this.http.post(`${this.baseUrl}`, type);
  }
  /**
   * Actualiza un tipo de clasificación
   */
  updateType(id, type) {
    return this.http.put(`${this.baseUrl}/${id}`, type);
  }
  /**
   * Elimina un tipo de clasificación
   */
  deleteType(id) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  /**
   * Desactiva un tipo de clasificación
   */
  deactivateType(id) {
    return this.http.patch(`${this.baseUrl}/${id}/deactivate`, {});
  }
};
_ClassificationTypeService.\u0275fac = function ClassificationTypeService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ClassificationTypeService)(\u0275\u0275inject(HttpClient));
};
_ClassificationTypeService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ClassificationTypeService, factory: _ClassificationTypeService.\u0275fac, providedIn: "root" });
var ClassificationTypeService = _ClassificationTypeService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ClassificationTypeService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/maintenance/components/category-form-dialog/category-form-dialog.component.ts
var _forTrack03 = ($index, $item) => $item.type;
function CategoryFormDialogComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errors()["code"]);
  }
}
function CategoryFormDialogComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errors()["name"]);
  }
}
function CategoryFormDialogComponent_Conditional_45_For_7_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "p", 39);
    \u0275\u0275text(2, "Ejemplo:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 40)(4, "span", 41);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 42);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const example_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(example_r2.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(example_r2.name);
  }
}
function CategoryFormDialogComponent_Conditional_45_For_7_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "p", 43);
    \u0275\u0275text(2, "No hay clasificaciones de este tipo a\xFAn");
    \u0275\u0275elementEnd()();
  }
}
function CategoryFormDialogComponent_Conditional_45_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "div", 33)(2, "div", 34)(3, "p", 35);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 36);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 37);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, CategoryFormDialogComponent_Conditional_45_For_7_Conditional_9_Template, 8, 2, "div", 38)(10, CategoryFormDialogComponent_Conditional_45_For_7_Conditional_10_Template, 3, 0, "div", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const example_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("border-blue-200", example_r2.count > 0)("dark:border-blue-900", example_r2.count > 0)("border-gray-200", example_r2.count === 0)("dark:border-gray-700", example_r2.count === 0)("opacity-60", example_r2.count === 0);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("text-blue-700", example_r2.count > 0)("dark:text-blue-300", example_r2.count > 0)("text-gray-500", example_r2.count === 0)("dark:text-gray-500", example_r2.count === 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", example_r2.type, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getTypeLabel(example_r2.type));
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-blue-100", example_r2.count > 0)("dark:bg-blue-900/50", example_r2.count > 0)("text-blue-700", example_r2.count > 0)("dark:text-blue-300", example_r2.count > 0)("bg-gray-100", example_r2.count === 0)("dark:bg-gray-700", example_r2.count === 0)("text-gray-500", example_r2.count === 0)("dark:text-gray-400", example_r2.count === 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", example_r2.count, " ", example_r2.count === 1 ? "clasificaci\xF3n" : "clasificaciones", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(example_r2.count > 0 ? 9 : 10);
  }
}
function CategoryFormDialogComponent_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 27);
    \u0275\u0275element(2, "lucide-angular", 28);
    \u0275\u0275elementStart(3, "span", 29);
    \u0275\u0275text(4, "Tipos de Clasificaci\xF3n en el Sistema:");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 30);
    \u0275\u0275repeaterCreate(6, CategoryFormDialogComponent_Conditional_45_For_7_Template, 11, 39, "div", 31, _forTrack03);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.typeExamples());
  }
}
function CategoryFormDialogComponent_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 44);
    \u0275\u0275element(2, "lucide-angular", 18);
    \u0275\u0275elementStart(3, "span", 45);
    \u0275\u0275text(4, "No hay clasificaciones existentes para mostrar como ejemplo.");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
  }
}
function CategoryFormDialogComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 46);
    \u0275\u0275text(1, " Creando... ");
  }
}
function CategoryFormDialogComponent_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 47);
    \u0275\u0275text(1, " Crear Categor\xEDa ");
  }
  if (rf & 2) {
    \u0275\u0275property("size", 18);
  }
}
var _CategoryFormDialogComponent = class _CategoryFormDialogComponent {
  constructor(classificationTypeService) {
    this.classificationTypeService = classificationTypeService;
    this.typifications = [];
    this.save = new EventEmitter();
    this.cancel = new EventEmitter();
    this.form = {
      code: "",
      name: "",
      description: ""
    };
    this.saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
    this.errors = signal({}, ...ngDevMode ? [{ debugName: "errors" }] : []);
    this.typeExamples = signal([], ...ngDevMode ? [{ debugName: "typeExamples" }] : []);
  }
  ngOnInit() {
    this.buildTypeExamples();
  }
  ngOnChanges(changes) {
    if (changes["typifications"] && changes["typifications"].currentValue) {
      this.buildTypeExamples();
    }
  }
  buildTypeExamples() {
    const typeMap = /* @__PURE__ */ new Map();
    Object.values(ClassificationType).forEach((type) => {
      typeMap.set(type, { codes: [], names: [], count: 0 });
    });
    this.typifications.forEach((typification) => {
      const type = typification.classificationType;
      if (typeMap.has(type)) {
        const typeData = typeMap.get(type);
        typeData.count++;
        if (typeData.codes.length < 1) {
          typeData.codes.push(typification.code);
          typeData.names.push(typification.name);
        }
      }
    });
    const examples = [];
    typeMap.forEach((data, type) => {
      examples.push({
        type,
        code: data.codes[0] || "-",
        name: data.names[0] || "Sin ejemplos disponibles",
        count: data.count
      });
    });
    this.typeExamples.set(examples);
  }
  getTypeLabel(type) {
    const labels = {
      [ClassificationType.CONTACT_RESULT]: "Resultado de Contacto",
      [ClassificationType.MANAGEMENT_TYPE]: "Tipo de Gesti\xF3n",
      [ClassificationType.PAYMENT_TYPE]: "Tipo de Pago",
      [ClassificationType.COMPLAINT_TYPE]: "Tipo de Reclamo",
      [ClassificationType.PAYMENT_SCHEDULE]: "Cronograma de Pagos",
      [ClassificationType.CUSTOM]: "Personalizado"
    };
    return labels[type];
  }
  validate() {
    const newErrors = {};
    if (!this.form.code.trim()) {
      newErrors["code"] = "El c\xF3digo es requerido";
    } else if (!/^[A-Z_]+$/.test(this.form.code.trim())) {
      newErrors["code"] = "El c\xF3digo debe contener solo MAY\xDASCULAS y guiones bajos";
    }
    if (!this.form.name.trim()) {
      newErrors["name"] = "El nombre es requerido";
    }
    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  onSave() {
    if (!this.validate())
      return;
    this.saving.set(true);
    const newType = {
      code: this.form.code.trim(),
      name: this.form.name.trim(),
      description: this.form.description.trim() || void 0,
      isActive: true,
      isSystem: false,
      displayOrder: 0
    };
    this.classificationTypeService.createType(newType).subscribe({
      next: (created) => {
        console.log("\u2705 Tipo de clasificaci\xF3n creado:", created);
        this.saving.set(false);
        this.save.emit(created.code);
      },
      error: (error) => {
        console.error("\u274C Error creando tipo de clasificaci\xF3n:", error);
        this.saving.set(false);
        const errorMessage = error.error || error.message || "Error desconocido al crear la categor\xEDa";
        alert(`\u274C Error al crear la categor\xEDa:

${errorMessage}`);
      }
    });
  }
  onCancel() {
    this.cancel.emit();
  }
};
_CategoryFormDialogComponent.\u0275fac = function CategoryFormDialogComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CategoryFormDialogComponent)(\u0275\u0275directiveInject(ClassificationTypeService));
};
_CategoryFormDialogComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CategoryFormDialogComponent, selectors: [["app-category-form-dialog"]], inputs: { typifications: "typifications" }, outputs: { save: "save", cancel: "cancel" }, features: [\u0275\u0275NgOnChangesFeature], decls: 54, vars: 17, consts: [[1, "fixed", "inset-0", "bg-black/50", "dark:bg-black/70", "flex", "items-center", "justify-center", "z-50", "p-4", "transition-opacity", "duration-300", 3, "click"], [1, "bg-white", "dark:bg-slate-900", "rounded-lg", "shadow-2xl", "max-w-2xl", "w-full", "max-h-[90vh]", "overflow-auto", "transition-all", "duration-300", "transform", 3, "click"], [1, "sticky", "top-0", "bg-gradient-to-r", "from-purple-600", "to-purple-700", "dark:from-purple-700", "dark:to-purple-800", "text-white", "px-6", "py-4", "flex", "items-center", "justify-between", "rounded-t-lg", "z-10"], [1, "text-xl", "font-bold"], [1, "text-sm", "text-purple-100", "dark:text-purple-200"], [1, "p-2", "hover:bg-white/20", "rounded-lg", "transition-colors", 3, "click"], ["name", "x", 3, "size"], [1, "p-6", "space-y-6"], [1, "bg-yellow-50", "dark:bg-yellow-900/20", "border-l-4", "border-yellow-500", "p-4", "rounded"], [1, "flex", "items-start", "gap-3"], ["name", "alert-circle", 1, "text-yellow-600", "dark:text-yellow-400", "flex-shrink-0", "mt-0.5", 3, "size"], [1, "text-sm", "text-yellow-800", "dark:text-yellow-200"], [1, "font-bold", "mb-1"], [1, "block", "text-sm", "font-bold", "text-gray-700", "dark:text-gray-200", "mb-2"], [1, "text-red-500"], ["type", "text", "placeholder", "Ej: CUSTOM_TYPE, NEW_CATEGORY", "maxlength", "50", 1, "w-full", "px-4", "py-2.5", "border", "border-gray-300", "dark:border-gray-600", "rounded-lg", "focus:ring-2", "focus:ring-purple-500", "focus:border-transparent", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", "placeholder:text-gray-400", "dark:placeholder:text-gray-500", "uppercase", "text-sm", "font-mono", 3, "ngModelChange", "ngModel"], [1, "text-red-500", "text-xs", "mt-1"], [1, "text-xs", "text-gray-500", "dark:text-gray-400", "mt-1", "flex", "items-center", "gap-1"], ["name", "info", 3, "size"], ["type", "text", "placeholder", "Ej: M\xE9todo de Pago, Resultado de Llamada", "maxlength", "100", 1, "w-full", "px-4", "py-2.5", "border", "border-gray-300", "dark:border-gray-600", "rounded-lg", "focus:ring-2", "focus:ring-purple-500", "focus:border-transparent", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", "placeholder:text-gray-400", "dark:placeholder:text-gray-500", "text-sm", 3, "ngModelChange", "ngModel"], [1, "text-xs", "font-normal", "text-gray-500", "dark:text-gray-400", "ml-1"], ["rows", "3", "placeholder", "Describe el prop\xF3sito de esta categor\xEDa y cu\xE1ndo debe ser usada...", 1, "w-full", "px-4", "py-2.5", "border", "border-gray-300", "dark:border-gray-600", "rounded-lg", "focus:ring-2", "focus:ring-purple-500", "focus:border-transparent", "resize-none", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", "placeholder:text-gray-400", "dark:placeholder:text-gray-500", "text-sm", 3, "ngModelChange", "ngModel"], [1, "bg-blue-50", "dark:bg-blue-950/30", "border", "border-blue-200", "dark:border-blue-900/50", "rounded-lg", "p-4"], [1, "bg-yellow-50", "dark:bg-yellow-950/30", "border", "border-yellow-200", "dark:border-yellow-900/50", "rounded-lg", "p-4"], [1, "sticky", "bottom-0", "bg-gray-50", "dark:bg-slate-800", "px-6", "py-4", "flex", "justify-end", "gap-3", "rounded-b-lg", "border-t", "border-gray-200", "dark:border-gray-700"], [1, "px-6", "py-2.5", "text-gray-700", "dark:text-gray-200", "bg-white", "dark:bg-slate-700", "border", "border-gray-300", "dark:border-gray-600", "rounded-lg", "hover:bg-gray-50", "dark:hover:bg-slate-600", "font-semibold", "transition-colors", "flex", "items-center", "gap-2", "text-sm", 3, "click"], [1, "px-6", "py-2.5", "bg-gradient-to-r", "from-purple-600", "to-purple-700", "hover:from-purple-700", "hover:to-purple-800", "disabled:from-gray-400", "disabled:to-gray-500", "text-white", "rounded-lg", "font-semibold", "transition-all", "shadow-md", "hover:shadow-lg", "flex", "items-center", "gap-2", "text-sm", 3, "click", "disabled"], [1, "flex", "items-center", "gap-2", "text-blue-800", "dark:text-blue-200", "mb-3"], ["name", "settings", 3, "size"], [1, "font-bold", "text-sm"], [1, "grid", "grid-cols-1", "gap-2", "text-xs"], [1, "bg-white", "dark:bg-slate-800", "p-3", "rounded", "border", 3, "border-blue-200", "dark:border-blue-900", "border-gray-200", "dark:border-gray-700", "opacity-60"], [1, "bg-white", "dark:bg-slate-800", "p-3", "rounded", "border"], [1, "flex", "items-start", "justify-between", "mb-1"], [1, "flex-1"], [1, "font-mono", "font-bold", "mb-1"], [1, "text-gray-600", "dark:text-gray-400", "font-medium"], [1, "px-2", "py-1", "rounded", "text-xs", "font-semibold"], [1, "mt-2", "pt-2", "border-t", "border-gray-200", "dark:border-gray-700"], [1, "text-gray-500", "dark:text-gray-400", "text-xs", "mb-1"], [1, "flex", "items-center", "gap-2"], [1, "font-mono", "text-xs", "bg-gray-100", "dark:bg-gray-700", "px-2", "py-1", "rounded", "text-gray-700", "dark:text-gray-300"], [1, "text-gray-600", "dark:text-gray-400"], [1, "text-gray-400", "dark:text-gray-500", "text-xs", "italic"], [1, "flex", "items-center", "gap-2", "text-yellow-800", "dark:text-yellow-200"], [1, "text-sm"], [1, "w-4", "h-4", "border-2", "border-white", "border-t-transparent", "rounded-full", "animate-spin"], ["name", "save", 3, "size"]], template: function CategoryFormDialogComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275listener("click", function CategoryFormDialogComponent_Template_div_click_0_listener() {
      return ctx.onCancel();
    });
    \u0275\u0275elementStart(1, "div", 1);
    \u0275\u0275listener("click", function CategoryFormDialogComponent_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(2, "div", 2)(3, "div")(4, "h2", 3);
    \u0275\u0275text(5, "Nueva Categor\xEDa de Clasificaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 4);
    \u0275\u0275text(7, " Crea un nuevo tipo de clasificaci\xF3n personalizado ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 5);
    \u0275\u0275listener("click", function CategoryFormDialogComponent_Template_button_click_8_listener() {
      return ctx.onCancel();
    });
    \u0275\u0275element(9, "lucide-angular", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 7)(11, "div", 8)(12, "div", 9);
    \u0275\u0275element(13, "lucide-angular", 10);
    \u0275\u0275elementStart(14, "div", 11)(15, "p", 12);
    \u0275\u0275text(16, "\u26A0\uFE0F Advertencia Importante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p");
    \u0275\u0275text(18, "Las categor\xEDas son tipos de clasificaci\xF3n a nivel de sistema. Una vez creadas, no se pueden eliminar f\xE1cilmente ya que pueden estar siendo usadas por m\xFAltiples tipificaciones.");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(19, "div")(20, "label", 13);
    \u0275\u0275text(21, " C\xF3digo de Categor\xEDa ");
    \u0275\u0275elementStart(22, "span", 14);
    \u0275\u0275text(23, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "input", 15);
    \u0275\u0275twoWayListener("ngModelChange", function CategoryFormDialogComponent_Template_input_ngModelChange_24_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.form.code, $event) || (ctx.form.code = $event);
      return $event;
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(25, CategoryFormDialogComponent_Conditional_25_Template, 2, 1, "p", 16);
    \u0275\u0275elementStart(26, "p", 17);
    \u0275\u0275element(27, "lucide-angular", 18);
    \u0275\u0275text(28, " Usa MAY\xDASCULAS y guiones bajos (snake_case). Ejemplo: PAYMENT_METHOD, CALL_RESULT ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div")(30, "label", 13);
    \u0275\u0275text(31, " Nombre Descriptivo ");
    \u0275\u0275elementStart(32, "span", 14);
    \u0275\u0275text(33, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "input", 19);
    \u0275\u0275twoWayListener("ngModelChange", function CategoryFormDialogComponent_Template_input_ngModelChange_34_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.form.name, $event) || (ctx.form.name = $event);
      return $event;
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(35, CategoryFormDialogComponent_Conditional_35_Template, 2, 1, "p", 16);
    \u0275\u0275elementStart(36, "p", 17);
    \u0275\u0275element(37, "lucide-angular", 18);
    \u0275\u0275text(38, " Este ser\xE1 el nombre que ver\xE1n los usuarios en la interfaz ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div")(40, "label", 13);
    \u0275\u0275text(41, " Descripci\xF3n ");
    \u0275\u0275elementStart(42, "span", 20);
    \u0275\u0275text(43, "(Opcional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "textarea", 21);
    \u0275\u0275twoWayListener("ngModelChange", function CategoryFormDialogComponent_Template_textarea_ngModelChange_44_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.form.description, $event) || (ctx.form.description = $event);
      return $event;
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(45, CategoryFormDialogComponent_Conditional_45_Template, 8, 1, "div", 22)(46, CategoryFormDialogComponent_Conditional_46_Template, 5, 1, "div", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 24)(48, "button", 25);
    \u0275\u0275listener("click", function CategoryFormDialogComponent_Template_button_click_48_listener() {
      return ctx.onCancel();
    });
    \u0275\u0275element(49, "lucide-angular", 6);
    \u0275\u0275text(50, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "button", 26);
    \u0275\u0275listener("click", function CategoryFormDialogComponent_Template_button_click_51_listener() {
      return ctx.onSave();
    });
    \u0275\u0275conditionalCreate(52, CategoryFormDialogComponent_Conditional_52_Template, 2, 0)(53, CategoryFormDialogComponent_Conditional_53_Template, 2, 1);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(9);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(11);
    \u0275\u0275classProp("border-red-500", ctx.errors()["code"]);
    \u0275\u0275twoWayProperty("ngModel", ctx.form.code);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.errors()["code"] ? 25 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(7);
    \u0275\u0275classProp("border-red-500", ctx.errors()["name"]);
    \u0275\u0275twoWayProperty("ngModel", ctx.form.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.errors()["name"] ? 35 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx.form.description);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.typeExamples().length > 0 ? 45 : 46);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx.saving());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.saving() ? 52 : 53);
  }
}, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, LucideAngularModule, LucideAngularComponent], encapsulation: 2 });
var CategoryFormDialogComponent = _CategoryFormDialogComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CategoryFormDialogComponent, [{
    type: Component,
    args: [{
      selector: "app-category-form-dialog",
      standalone: true,
      imports: [CommonModule, FormsModule, LucideAngularModule],
      template: `
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
         (click)="onCancel()">

      <!-- Dialog -->
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto transition-all duration-300 transform"
           (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white px-6 py-4 flex items-center justify-between rounded-t-lg z-10">
          <div>
            <h2 class="text-xl font-bold">Nueva Categor\xEDa de Clasificaci\xF3n</h2>
            <p class="text-sm text-purple-100 dark:text-purple-200">
              Crea un nuevo tipo de clasificaci\xF3n personalizado
            </p>
          </div>
          <button
            (click)="onCancel()"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <lucide-angular name="x" [size]="24"></lucide-angular>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-6">
          <!-- Warning Notice -->
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
            <div class="flex items-start gap-3">
              <lucide-angular name="alert-circle" [size]="20" class="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"></lucide-angular>
              <div class="text-sm text-yellow-800 dark:text-yellow-200">
                <p class="font-bold mb-1">\u26A0\uFE0F Advertencia Importante</p>
                <p>Las categor\xEDas son tipos de clasificaci\xF3n a nivel de sistema. Una vez creadas, no se pueden eliminar f\xE1cilmente ya que pueden estar siendo usadas por m\xFAltiples tipificaciones.</p>
              </div>
            </div>
          </div>

          <!-- Code -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              C\xF3digo de Categor\xEDa <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              [(ngModel)]="form.code"
              placeholder="Ej: CUSTOM_TYPE, NEW_CATEGORY"
              maxlength="50"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 uppercase text-sm font-mono"
              [class.border-red-500]="errors()['code']"
            />
            @if (errors()['code']) {
              <p class="text-red-500 text-xs mt-1">{{ errors()['code'] }}</p>
            }
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <lucide-angular name="info" [size]="12"></lucide-angular>
              Usa MAY\xDASCULAS y guiones bajos (snake_case). Ejemplo: PAYMENT_METHOD, CALL_RESULT
            </p>
          </div>

          <!-- Name -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              Nombre Descriptivo <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              [(ngModel)]="form.name"
              placeholder="Ej: M\xE9todo de Pago, Resultado de Llamada"
              maxlength="100"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm"
              [class.border-red-500]="errors()['name']"
            />
            @if (errors()['name']) {
              <p class="text-red-500 text-xs mt-1">{{ errors()['name'] }}</p>
            }
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <lucide-angular name="info" [size]="12"></lucide-angular>
              Este ser\xE1 el nombre que ver\xE1n los usuarios en la interfaz
            </p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              Descripci\xF3n
              <span class="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">(Opcional)</span>
            </label>
            <textarea
              [(ngModel)]="form.description"
              rows="3"
              placeholder="Describe el prop\xF3sito de esta categor\xEDa y cu\xE1ndo debe ser usada..."
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm"
            ></textarea>
          </div>

          <!-- Examples - Clasificaciones Existentes -->
          @if (typeExamples().length > 0) {
            <div class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4">
              <div class="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-3">
                <lucide-angular name="settings" [size]="16"></lucide-angular>
                <span class="font-bold text-sm">Tipos de Clasificaci\xF3n en el Sistema:</span>
              </div>
              <div class="grid grid-cols-1 gap-2 text-xs">
                @for (example of typeExamples(); track example.type) {
                  <div class="bg-white dark:bg-slate-800 p-3 rounded border"
                       [class.border-blue-200]="example.count > 0"
                       [class.dark:border-blue-900]="example.count > 0"
                       [class.border-gray-200]="example.count === 0"
                       [class.dark:border-gray-700]="example.count === 0"
                       [class.opacity-60]="example.count === 0">
                    <div class="flex items-start justify-between mb-1">
                      <div class="flex-1">
                        <p class="font-mono font-bold mb-1"
                           [class.text-blue-700]="example.count > 0"
                           [class.dark:text-blue-300]="example.count > 0"
                           [class.text-gray-500]="example.count === 0"
                           [class.dark:text-gray-500]="example.count === 0">
                          {{ example.type }}
                        </p>
                        <p class="text-gray-600 dark:text-gray-400 font-medium">{{ getTypeLabel(example.type) }}</p>
                      </div>
                      <span class="px-2 py-1 rounded text-xs font-semibold"
                            [class.bg-blue-100]="example.count > 0"
                            [class.dark:bg-blue-900/50]="example.count > 0"
                            [class.text-blue-700]="example.count > 0"
                            [class.dark:text-blue-300]="example.count > 0"
                            [class.bg-gray-100]="example.count === 0"
                            [class.dark:bg-gray-700]="example.count === 0"
                            [class.text-gray-500]="example.count === 0"
                            [class.dark:text-gray-400]="example.count === 0">
                        {{ example.count }} {{ example.count === 1 ? 'clasificaci\xF3n' : 'clasificaciones' }}
                      </span>
                    </div>
                    @if (example.count > 0) {
                      <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p class="text-gray-500 dark:text-gray-400 text-xs mb-1">Ejemplo:</p>
                        <div class="flex items-center gap-2">
                          <span class="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">{{ example.code }}</span>
                          <span class="text-gray-600 dark:text-gray-400">{{ example.name }}</span>
                        </div>
                      </div>
                    } @else {
                      <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p class="text-gray-400 dark:text-gray-500 text-xs italic">No hay clasificaciones de este tipo a\xFAn</p>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          } @else {
            <div class="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4">
              <div class="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <lucide-angular name="info" [size]="16"></lucide-angular>
                <span class="text-sm">No hay clasificaciones existentes para mostrar como ejemplo.</span>
              </div>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 dark:bg-slate-800 px-6 py-4 flex justify-end gap-3 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
          <button
            (click)="onCancel()"
            class="px-6 py-2.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 font-semibold transition-colors flex items-center gap-2 text-sm">
            <lucide-angular name="x" [size]="18"></lucide-angular>
            Cancelar
          </button>
          <button
            (click)="onSave()"
            [disabled]="saving()"
            class="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm">
            @if (saving()) {
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creando...
            } @else {
              <lucide-angular name="save" [size]="18"></lucide-angular>
              Crear Categor\xEDa
            }
          </button>
        </div>
      </div>
    </div>
  `
    }]
  }], () => [{ type: ClassificationTypeService }], { typifications: [{
    type: Input
  }], save: [{
    type: Output
  }], cancel: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CategoryFormDialogComponent, { className: "CategoryFormDialogComponent", filePath: "src/app/maintenance/components/category-form-dialog/category-form-dialog.component.ts", lineNumber: 210 });
})();

// src/app/maintenance/components/typification-additional-fields-dialog/typification-additional-fields-dialog.component.ts
var _forTrack04 = ($index, $item) => $item.id;
var _forTrack12 = ($index, $item) => $item.codigoOpcion;
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275element(1, "lucide-angular", 22);
    \u0275\u0275text(2, " Cargando subcarteras... ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Conditional_5_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const subPortfolio_r4 = ctx.$implicit;
    \u0275\u0275property("ngValue", subPortfolio_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(subPortfolio_r4.nombre || subPortfolio_r4.nombreSubcartera);
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 23);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Conditional_5_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedSubPortfolioId, $event) || (ctx_r1.selectedSubPortfolioId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Conditional_5_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onSubPortfolioChange($event));
    });
    \u0275\u0275elementStart(1, "option", 24);
    \u0275\u0275text(2, "-- Seleccione una subcartera --");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Conditional_5_For_4_Template, 2, 2, "option", 24, _forTrack04);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedSubPortfolioId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", void 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.subPortfolios());
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1, " No hay subcarteras disponibles ");
    \u0275\u0275elementEnd();
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "label", 17);
    \u0275\u0275element(2, "lucide-angular", 18);
    \u0275\u0275text(3, " Subcartera ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Conditional_4_Template, 3, 1, "div", 19)(5, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Conditional_5_Template, 5, 2, "select", 20)(6, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Conditional_6_Template, 2, 0, "p", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.loadingSubPortfolios() ? 4 : ctx_r1.subPortfolios().length > 0 ? 5 : 6);
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r1.getOpcionesHabilitadasCount(), "/", ctx_r1.opciones().length, " habilitados ");
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275element(1, "lucide-angular", 32);
    \u0275\u0275elementStart(2, "p", 33);
    \u0275\u0275text(3, "Cargando montos disponibles...");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 40);
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" (", opcion_r6.campoTablaDinamica, ") ");
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 44);
    \u0275\u0275text(1, " Manual ");
    \u0275\u0275elementEnd();
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 46);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 20);
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 47);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 20);
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275listener("click", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_14_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(1, "div", 50);
    \u0275\u0275element(2, "lucide-angular", 51);
    \u0275\u0275elementStart(3, "span", 52);
    \u0275\u0275text(4, "Restricci\xF3n de fecha:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "select", 53);
    \u0275\u0275listener("ngModelChange", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_14_Template_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r7);
      const opcion_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onRestriccionFechaChange(opcion_r6.codigoOpcion, $event));
    });
    \u0275\u0275elementStart(6, "option", 54);
    \u0275\u0275text(7, "Sin restricci\xF3n (cualquier fecha)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "option", 55);
    \u0275\u0275text(9, "Solo dentro del mes actual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "option", 56);
    \u0275\u0275text(11, "Solo fuera del mes (pr\xF3ximo mes+)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 50);
    \u0275\u0275element(13, "lucide-angular", 57);
    \u0275\u0275elementStart(14, "span", 52);
    \u0275\u0275text(15, "Genera Carta de Acuerdo:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "label", 58)(17, "input", 39);
    \u0275\u0275listener("change", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_14_Template_input_change_17_listener($event) {
      \u0275\u0275restoreView(_r7);
      const opcion_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onGeneraCartaChange(opcion_r6.codigoOpcion, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "div", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 12);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const opcion_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", opcion_r6.restriccionFecha || "SIN_RESTRICCION");
    \u0275\u0275advance(8);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(4);
    \u0275\u0275property("checked", opcion_r6.generaCartaAcuerdo);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", opcion_r6.generaCartaAcuerdo ? "S\xED" : "No", " ");
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 35)(1, "div", 36);
    \u0275\u0275listener("click", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Template_div_click_1_listener() {
      const opcion_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.toggleOpcionOriginal(opcion_r6));
    });
    \u0275\u0275elementStart(2, "div", 37)(3, "label", 38);
    \u0275\u0275listener("click", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Template_label_click_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(4, "input", 39);
    \u0275\u0275listener("change", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Template_input_change_4_listener() {
      const opcion_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.toggleOpcionOriginal(opcion_r6));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "div", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 41)(7, "span", 42);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_9_Template, 2, 1, "span", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_10_Template, 2, 0, "span", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 45);
    \u0275\u0275conditionalCreate(12, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_12_Template, 1, 1, "lucide-angular", 46)(13, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_13_Template, 1, 1, "lucide-angular", 47);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(14, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_14_Template, 21, 5, "div", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r6 = ctx.$implicit;
    \u0275\u0275classProp("bg-green-50", opcion_r6.estaHabilitada)("dark:bg-green-900/20", opcion_r6.estaHabilitada)("border-green-300", opcion_r6.estaHabilitada)("dark:border-green-700", opcion_r6.estaHabilitada)("bg-gray-50", !opcion_r6.estaHabilitada)("dark:bg-gray-700/50", !opcion_r6.estaHabilitada)("border-gray-200", !opcion_r6.estaHabilitada)("dark:border-gray-600", !opcion_r6.estaHabilitada);
    \u0275\u0275advance(4);
    \u0275\u0275property("checked", opcion_r6.estaHabilitada);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", opcion_r6.visualName, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(opcion_r6.codigoOpcion !== "personalizado" ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(opcion_r6.codigoOpcion === "personalizado" ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(opcion_r6.estaHabilitada ? 12 : 13);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(opcion_r6.estaHabilitada ? 14 : -1);
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275repeaterCreate(1, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Template, 15, 22, "div", 34, _forTrack12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.opcionesConNombres());
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275element(1, "lucide-angular", 60);
    \u0275\u0275elementStart(2, "p", 33);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 61);
    \u0275\u0275listener("click", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_8_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.retryLoadOpciones());
    });
    \u0275\u0275text(5, " Reintentar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("size", 40);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage());
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275element(1, "lucide-angular", 62);
    \u0275\u0275elementStart(2, "p", 33);
    \u0275\u0275text(3, "No se encontraron campos num\xE9ricos en esta subcartera");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 40);
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 25)(2, "h3", 26);
    \u0275\u0275element(3, "lucide-angular", 27);
    \u0275\u0275text(4, " Montos disponibles para el agente ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_5_Template, 2, 2, "span", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_6_Template, 4, 1, "div", 28)(7, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_7_Template, 3, 0, "div", 29)(8, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_8_Template, 6, 2, "div", 30)(9, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Conditional_9_Template, 4, 1, "div", 31);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.opciones().length > 0 ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.loadingOpciones() ? 6 : ctx_r1.opcionesConNombres().length > 0 ? 7 : ctx_r1.errorMessage() ? 8 : 9);
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "lucide-angular", 63);
    \u0275\u0275elementStart(2, "p", 33);
    \u0275\u0275text(3, "Seleccione una subcartera para ver los montos disponibles");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 48);
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 64);
    \u0275\u0275text(1, " Los montos habilitados aparecer\xE1n como opciones para el agente ");
  }
  if (rf & 2) {
    \u0275\u0275property("size", 14);
  }
}
function TypificationAdditionalFieldsDialogComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3);
    \u0275\u0275element(4, "lucide-angular", 4);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 5);
    \u0275\u0275listener("click", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.handleCancel());
    });
    \u0275\u0275element(7, "lucide-angular", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 7);
    \u0275\u0275conditionalCreate(9, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_9_Template, 7, 2, "div", 8);
    \u0275\u0275conditionalCreate(10, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_10_Template, 10, 3, "div", 9)(11, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_11_Template, 4, 1, "div", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 11)(13, "div", 12);
    \u0275\u0275conditionalCreate(14, TypificationAdditionalFieldsDialogComponent_Conditional_0_Conditional_14_Template, 2, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 13)(16, "button", 14);
    \u0275\u0275listener("click", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.handleCancel());
    });
    \u0275\u0275text(17, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 15);
    \u0275\u0275listener("click", function TypificationAdditionalFieldsDialogComponent_Conditional_0_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.handleSave());
    });
    \u0275\u0275element(19, "lucide-angular", 16);
    \u0275\u0275text(20, " Guardar ");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 22);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Configurar Montos - ", ctx_r1.typificationName(), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.portfolioId() ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.selectedSubPortfolioId() ? 10 : 11);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.opciones().length > 0 ? 14 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r1.canSave());
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
var _TypificationAdditionalFieldsDialogComponent = class _TypificationAdditionalFieldsDialogComponent {
  constructor() {
    this.isOpen = input.required(...ngDevMode ? [{ debugName: "isOpen" }] : []);
    this.typificationName = input("", ...ngDevMode ? [{ debugName: "typificationName" }] : []);
    this.typificationId = input.required(...ngDevMode ? [{ debugName: "typificationId" }] : []);
    this.tenantId = input.required(...ngDevMode ? [{ debugName: "tenantId" }] : []);
    this.portfolioId = input(void 0, ...ngDevMode ? [{ debugName: "portfolioId" }] : []);
    this.subPortfolioId = input(void 0, ...ngDevMode ? [{ debugName: "subPortfolioId" }] : []);
    this.close = output();
    this.save = output();
    this.opciones = signal([], ...ngDevMode ? [{ debugName: "opciones" }] : []);
    this.loadingOpciones = signal(false, ...ngDevMode ? [{ debugName: "loadingOpciones" }] : []);
    this.errorMessage = signal("", ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
    this.subPortfolios = signal([], ...ngDevMode ? [{ debugName: "subPortfolios" }] : []);
    this.loadingSubPortfolios = signal(false, ...ngDevMode ? [{ debugName: "loadingSubPortfolios" }] : []);
    this.selectedSubPortfolioId = signal(void 0, ...ngDevMode ? [{ debugName: "selectedSubPortfolioId" }] : []);
    this.paymentScheduleFieldId = signal(null, ...ngDevMode ? [{ debugName: "paymentScheduleFieldId" }] : []);
    this.cabeceras = signal([], ...ngDevMode ? [{ debugName: "cabeceras" }] : []);
    this.cabecerasUrl = `${environment.apiUrl}/configuracion-cabeceras`;
    this.opcionesConNombres = computed(() => {
      const opciones = this.opciones();
      const cabeceras = this.cabeceras();
      const codigoToNombre = /* @__PURE__ */ new Map();
      for (const c of cabeceras) {
        codigoToNombre.set(c.codigo.toLowerCase(), c.nombre);
      }
      return opciones.map((opcion) => {
        let visualName = opcion.labelOpcion || opcion.codigoOpcion;
        if (opcion.codigoOpcion === "personalizado") {
          visualName = "Personalizado";
        } else if (opcion.campoTablaDinamica) {
          const nombre = codigoToNombre.get(opcion.campoTablaDinamica.toLowerCase());
          if (nombre) {
            visualName = nombre;
          }
        }
        return __spreadProps(__spreadValues({}, opcion), { visualName });
      });
    }, ...ngDevMode ? [{ debugName: "opcionesConNombres" }] : []);
    this.typificationService = inject(TypificationV2Service);
    this.http = inject(HttpClient);
    effect(() => {
      if (this.isOpen()) {
        this.resetState();
        this.loadSubPortfolios();
        this.loadPaymentScheduleField();
      }
    });
  }
  resetState() {
    this.opciones.set([]);
    this.cabeceras.set([]);
    this.errorMessage.set("");
    this.selectedSubPortfolioId.set(void 0);
    this.paymentScheduleFieldId.set(null);
  }
  loadPaymentScheduleField() {
    const typificationId = this.typificationId();
    if (!typificationId)
      return;
    this.typificationService.getAdditionalFields(typificationId).subscribe({
      next: (fields) => {
        const paymentField = fields.find((f) => f.tipoCampo === FieldTypeV2.PAYMENT_SCHEDULE);
        if (paymentField) {
          this.paymentScheduleFieldId.set(paymentField.id);
          console.log("Found PAYMENT_SCHEDULE field:", paymentField.id);
        } else {
          console.warn("No PAYMENT_SCHEDULE field found for typification", typificationId);
        }
      },
      error: (error) => {
        console.error("Error loading fields:", error);
      }
    });
  }
  loadSubPortfolios() {
    const portfolioId = this.portfolioId();
    if (!portfolioId)
      return;
    this.loadingSubPortfolios.set(true);
    this.typificationService.getSubPortfoliosByPortfolio(portfolioId).subscribe({
      next: (subPortfolios) => {
        this.subPortfolios.set(subPortfolios);
        this.loadingSubPortfolios.set(false);
        if (subPortfolios.length === 1) {
          this.selectedSubPortfolioId.set(subPortfolios[0].id);
          this.loadCabeceras(subPortfolios[0].id);
          this.loadOpcionesAutomatically();
        }
      },
      error: (error) => {
        console.error("Error loading subportfolios:", error);
        this.subPortfolios.set([]);
        this.loadingSubPortfolios.set(false);
      }
    });
  }
  onSubPortfolioChange(subPortfolioId) {
    this.selectedSubPortfolioId.set(subPortfolioId);
    this.opciones.set([]);
    this.cabeceras.set([]);
    this.errorMessage.set("");
    if (subPortfolioId) {
      this.loadCabeceras(subPortfolioId);
      this.loadOpcionesAutomatically();
    }
  }
  loadCabeceras(subPortfolioId) {
    this.http.get(`${this.cabecerasUrl}/subcartera/${subPortfolioId}/montos`).subscribe({
      next: (cabeceras) => {
        this.cabeceras.set(cabeceras);
        console.log("[DIALOG] Loaded cabeceras:", cabeceras.length);
      },
      error: (error) => {
        console.warn("[DIALOG] Error loading cabeceras:", error);
      }
    });
  }
  loadOpcionesAutomatically() {
    const tenantId = this.tenantId();
    const portfolioId = this.portfolioId();
    const subPortfolioId = this.selectedSubPortfolioId();
    const campoId = this.paymentScheduleFieldId();
    if (!tenantId || !portfolioId || !subPortfolioId) {
      return;
    }
    if (!campoId) {
      setTimeout(() => this.loadOpcionesAutomatically(), 500);
      return;
    }
    this.loadingOpciones.set(true);
    this.errorMessage.set("");
    this.typificationService.getOpcionesCampo(campoId).subscribe({
      next: (opciones) => {
        if (opciones && opciones.length > 0) {
          this.opciones.set(opciones);
          this.loadingOpciones.set(false);
        } else {
          this.initializeOpciones(campoId, tenantId, portfolioId, subPortfolioId);
        }
      },
      error: () => {
        this.initializeOpciones(campoId, tenantId, portfolioId, subPortfolioId);
      }
    });
  }
  initializeOpciones(campoId, tenantId, portfolioId, subPortfolioId) {
    this.typificationService.inicializarOpcionesCampo(campoId, tenantId, portfolioId, subPortfolioId).subscribe({
      next: (opciones) => {
        this.opciones.set(opciones);
        this.loadingOpciones.set(false);
      },
      error: (error) => {
        console.error("Error initializing options:", error);
        this.errorMessage.set("Error al cargar las opciones. Verifique la configuraci\xF3n de la subcartera.");
        this.loadingOpciones.set(false);
      }
    });
  }
  retryLoadOpciones() {
    this.loadOpcionesAutomatically();
  }
  toggleOpcionOriginal(opcionConNombre) {
    const opciones = this.opciones();
    const opcionOriginal = opciones.find((o) => o.codigoOpcion === opcionConNombre.codigoOpcion);
    if (opcionOriginal) {
      opcionOriginal.estaHabilitada = !opcionOriginal.estaHabilitada;
      if (opcionOriginal.estaHabilitada && !opcionOriginal.restriccionFecha) {
        opcionOriginal.restriccionFecha = RestriccionFecha.SIN_RESTRICCION;
      }
      this.opciones.set([...opciones]);
    }
  }
  onRestriccionFechaChange(codigoOpcion, restriccion) {
    const opciones = this.opciones();
    const opcion = opciones.find((o) => o.codigoOpcion === codigoOpcion);
    if (opcion) {
      opcion.restriccionFecha = restriccion;
      this.opciones.set([...opciones]);
    }
  }
  onGeneraCartaChange(codigoOpcion, event) {
    const checkbox = event.target;
    const opciones = this.opciones();
    const opcion = opciones.find((o) => o.codigoOpcion === codigoOpcion);
    if (opcion) {
      opcion.generaCartaAcuerdo = checkbox.checked;
      this.opciones.set([...opciones]);
    }
  }
  getOpcionesHabilitadasCount() {
    return this.opciones().filter((o) => o.estaHabilitada).length;
  }
  canSave() {
    return this.selectedSubPortfolioId() !== void 0 && this.paymentScheduleFieldId() !== null && this.opciones().length > 0 && !this.loadingOpciones();
  }
  handleCancel() {
    this.close.emit();
  }
  handleSave() {
    const campoId = this.paymentScheduleFieldId();
    const opcionesActuales = this.opciones();
    if (!campoId || opcionesActuales.length === 0) {
      return;
    }
    const request = {
      idCampo: campoId,
      opciones: opcionesActuales.map((o) => ({
        codigoOpcion: o.codigoOpcion,
        estaHabilitada: o.estaHabilitada,
        ordenVisualizacion: o.ordenVisualizacion,
        restriccionFecha: o.restriccionFecha || RestriccionFecha.SIN_RESTRICCION,
        generaCartaAcuerdo: o.generaCartaAcuerdo || false
      }))
    };
    this.typificationService.configurarOpciones(request).subscribe({
      next: (opcionesActualizadas) => {
        console.log("Options saved successfully:", opcionesActualizadas.length);
        this.opciones.set(opcionesActualizadas);
        this.save.emit();
      },
      error: (error) => {
        console.error("Error saving options:", error);
        this.errorMessage.set("Error al guardar la configuraci\xF3n");
      }
    });
  }
};
_TypificationAdditionalFieldsDialogComponent.\u0275fac = function TypificationAdditionalFieldsDialogComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TypificationAdditionalFieldsDialogComponent)();
};
_TypificationAdditionalFieldsDialogComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TypificationAdditionalFieldsDialogComponent, selectors: [["app-typification-additional-fields-dialog"]], inputs: { isOpen: [1, "isOpen"], typificationName: [1, "typificationName"], typificationId: [1, "typificationId"], tenantId: [1, "tenantId"], portfolioId: [1, "portfolioId"], subPortfolioId: [1, "subPortfolioId"] }, outputs: { close: "close", save: "save" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "p-4"], [1, "bg-white", "dark:bg-gray-800", "rounded-lg", "shadow-xl", "max-w-3xl", "w-full", "max-h-[90vh]", "flex", "flex-col"], [1, "flex", "items-center", "justify-between", "p-5", "border-b", "border-gray-200", "dark:border-gray-700", "bg-gradient-to-r", "from-purple-600", "to-blue-600"], [1, "text-lg", "font-bold", "text-white", "flex", "items-center", "gap-2"], ["name", "sliders", 1, "text-white", 3, "size"], ["type", "button", 1, "text-white/80", "hover:text-white", 3, "click"], ["name", "x", 3, "size"], [1, "flex-1", "overflow-y-auto", "p-5", "space-y-4"], [1, "p-4", "bg-blue-50", "dark:bg-blue-900/20", "border", "border-blue-200", "dark:border-blue-800", "rounded-lg"], [1, "space-y-3"], [1, "text-center", "py-12", "text-gray-400", "dark:text-gray-500"], [1, "flex", "justify-between", "items-center", "gap-3", "p-5", "border-t", "border-gray-200", "dark:border-gray-700", "bg-gray-50", "dark:bg-gray-800/50"], [1, "text-xs", "text-gray-500", "dark:text-gray-400"], [1, "flex", "gap-3"], ["type", "button", 1, "px-4", "py-2", "border", "border-gray-300", "dark:border-gray-600", "text-gray-700", "dark:text-gray-300", "rounded-lg", "hover:bg-gray-100", "dark:hover:bg-gray-700", "text-sm", 3, "click"], ["type", "button", 1, "px-4", "py-2", "bg-green-600", "text-white", "rounded-lg", "hover:bg-green-700", "disabled:opacity-50", "disabled:cursor-not-allowed", "flex", "items-center", "gap-2", "text-sm", "font-medium", 3, "click", "disabled"], ["name", "save", 3, "size"], [1, "block", "text-sm", "font-bold", "text-gray-700", "dark:text-gray-300", "mb-2", "flex", "items-center", "gap-2"], ["name", "database", 1, "text-blue-600", 3, "size"], [1, "flex", "items-center", "gap-2", "py-2", "text-sm", "text-gray-600", "dark:text-gray-400"], [1, "w-full", "px-3", "py-2", "border", "border-blue-300", "dark:border-blue-600", "rounded-md", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white", "text-sm", "focus:ring-2", "focus:ring-blue-500", 3, "ngModel"], [1, "text-sm", "text-gray-600", "dark:text-gray-400"], ["name", "loader", 1, "animate-spin", 3, "size"], [1, "w-full", "px-3", "py-2", "border", "border-blue-300", "dark:border-blue-600", "rounded-md", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white", "text-sm", "focus:ring-2", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [1, "flex", "items-center", "justify-between"], [1, "text-base", "font-semibold", "text-gray-900", "dark:text-white", "flex", "items-center", "gap-2"], ["name", "list-checks", 1, "text-green-600", 3, "size"], [1, "flex", "flex-col", "items-center", "justify-center", "py-12", "text-gray-500"], [1, "space-y-2", "max-h-[400px]", "overflow-y-auto", "pr-2"], [1, "text-center", "py-8", "text-red-500", "dark:text-red-400"], [1, "text-center", "py-8", "text-yellow-600", "dark:text-yellow-400"], ["name", "loader", 1, "animate-spin", "text-blue-600", "mb-3", 3, "size"], [1, "text-sm"], [1, "p-3", "rounded-lg", "border", "transition-all", 3, "bg-green-50", "dark:bg-green-900/20", "border-green-300", "dark:border-green-700", "bg-gray-50", "dark:bg-gray-700/50", "border-gray-200", "dark:border-gray-600"], [1, "p-3", "rounded-lg", "border", "transition-all"], [1, "flex", "items-center", "justify-between", "cursor-pointer", 3, "click"], [1, "flex", "items-center", "gap-3", "flex-1"], [1, "relative", "inline-flex", "items-center", "cursor-pointer", 3, "click"], ["type", "checkbox", 1, "sr-only", "peer", 3, "change", "checked"], [1, "w-10", "h-5", "bg-gray-300", "peer-focus:outline-none", "peer-focus:ring-2", "peer-focus:ring-green-300", "rounded-full", "peer", "dark:bg-gray-600", "peer-checked:after:translate-x-full", "peer-checked:after:border-white", "after:content-['']", "after:absolute", "after:top-[2px]", "after:left-[2px]", "after:bg-white", "after:border-gray-300", "after:border", "after:rounded-full", "after:h-4", "after:w-4", "after:transition-all", "peer-checked:bg-green-500"], [1, "flex-1"], [1, "text-sm", "font-medium", "text-gray-900", "dark:text-white"], [1, "ml-2", "text-xs", "text-gray-500", "dark:text-gray-400"], [1, "px-2", "py-0.5", "bg-purple-100", "dark:bg-purple-900/40", "text-purple-700", "dark:text-purple-300", "text-xs", "font-semibold", "rounded-full"], [1, "ml-2"], ["name", "check-circle", 1, "text-green-600", 3, "size"], ["name", "circle", 1, "text-gray-300", "dark:text-gray-500", 3, "size"], [1, "mt-2", "pt-2", "border-t", "border-green-200", "dark:border-green-800", "space-y-2"], [1, "mt-2", "pt-2", "border-t", "border-green-200", "dark:border-green-800", "space-y-2", 3, "click"], [1, "flex", "items-center", "gap-2"], ["name", "calendar", 1, "text-blue-600", 3, "size"], [1, "text-xs", "font-medium", "text-gray-700", "dark:text-gray-300"], [1, "flex-1", "px-2", "py-1", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "bg-white", "dark:bg-gray-700", "text-gray-900", "dark:text-white", "focus:ring-2", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], ["value", "SIN_RESTRICCION"], ["value", "DENTRO_MES"], ["value", "FUERA_MES"], ["name", "file-text", 1, "text-purple-600", 3, "size"], [1, "relative", "inline-flex", "items-center", "cursor-pointer"], [1, "w-9", "h-5", "bg-gray-300", "peer-focus:outline-none", "peer-focus:ring-2", "peer-focus:ring-purple-300", "rounded-full", "peer", "dark:bg-gray-600", "peer-checked:after:translate-x-full", "peer-checked:after:border-white", "after:content-['']", "after:absolute", "after:top-[2px]", "after:left-[2px]", "after:bg-white", "after:border-gray-300", "after:border", "after:rounded-full", "after:h-4", "after:w-4", "after:transition-all", "peer-checked:bg-purple-500"], ["name", "alert-circle", 1, "mx-auto", "mb-3", 3, "size"], [1, "mt-3", "px-4", "py-2", "bg-red-100", "dark:bg-red-900/30", "text-red-700", "dark:text-red-300", "rounded-lg", "text-sm", "hover:bg-red-200", 3, "click"], ["name", "inbox", 1, "mx-auto", "mb-3", "opacity-60", 3, "size"], ["name", "pointer", 1, "mx-auto", "mb-4", "opacity-50", 3, "size"], ["name", "info", 1, "inline", "mr-1", 3, "size"]], template: function TypificationAdditionalFieldsDialogComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TypificationAdditionalFieldsDialogComponent_Conditional_0_Template, 21, 8, "div", 0);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.isOpen() ? 0 : -1);
  }
}, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, NgModel, LucideAngularModule, LucideAngularComponent], encapsulation: 2 });
var TypificationAdditionalFieldsDialogComponent = _TypificationAdditionalFieldsDialogComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TypificationAdditionalFieldsDialogComponent, [{
    type: Component,
    args: [{
      selector: "app-typification-additional-fields-dialog",
      standalone: true,
      imports: [CommonModule, FormsModule, LucideAngularModule],
      template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <lucide-angular name="sliders" [size]="22" class="text-white"></lucide-angular>
              Configurar Montos - {{ typificationName() }}
            </h2>
            <button
              type="button"
              (click)="handleCancel()"
              class="text-white/80 hover:text-white"
            >
              <lucide-angular name="x" [size]="24"></lucide-angular>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-5 space-y-4">
            <!-- Selector de Subcartera -->
            @if (portfolioId()) {
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <lucide-angular name="database" [size]="16" class="text-blue-600"></lucide-angular>
                  Subcartera
                </label>

                @if (loadingSubPortfolios()) {
                  <div class="flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-400">
                    <lucide-angular name="loader" [size]="16" class="animate-spin"></lucide-angular>
                    Cargando subcarteras...
                  </div>
                } @else if (subPortfolios().length > 0) {
                  <select
                    [(ngModel)]="selectedSubPortfolioId"
                    (ngModelChange)="onSubPortfolioChange($event)"
                    class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option [ngValue]="undefined">-- Seleccione una subcartera --</option>
                    @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                      <option [ngValue]="subPortfolio.id">{{ subPortfolio.nombre || subPortfolio.nombreSubcartera }}</option>
                    }
                  </select>
                } @else {
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    No hay subcarteras disponibles
                  </p>
                }
              </div>
            }

            <!-- Lista de Opciones con Toggles -->
            @if (selectedSubPortfolioId()) {
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <lucide-angular name="list-checks" [size]="18" class="text-green-600"></lucide-angular>
                    Montos disponibles para el agente
                  </h3>
                  @if (opciones().length > 0) {
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ getOpcionesHabilitadasCount() }}/{{ opciones().length }} habilitados
                    </span>
                  }
                </div>

                @if (loadingOpciones()) {
                  <div class="flex flex-col items-center justify-center py-12 text-gray-500">
                    <lucide-angular name="loader" [size]="40" class="animate-spin text-blue-600 mb-3"></lucide-angular>
                    <p class="text-sm">Cargando montos disponibles...</p>
                  </div>
                } @else if (opcionesConNombres().length > 0) {
                  <div class="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    @for (opcion of opcionesConNombres(); track opcion.codigoOpcion) {
                      <div
                        class="p-3 rounded-lg border transition-all"
                        [class.bg-green-50]="opcion.estaHabilitada"
                        [class.dark:bg-green-900/20]="opcion.estaHabilitada"
                        [class.border-green-300]="opcion.estaHabilitada"
                        [class.dark:border-green-700]="opcion.estaHabilitada"
                        [class.bg-gray-50]="!opcion.estaHabilitada"
                        [class.dark:bg-gray-700/50]="!opcion.estaHabilitada"
                        [class.border-gray-200]="!opcion.estaHabilitada"
                        [class.dark:border-gray-600]="!opcion.estaHabilitada"
                      >
                        <!-- Row 1: Toggle + Label + Badge -->
                        <div class="flex items-center justify-between cursor-pointer" (click)="toggleOpcionOriginal(opcion)">
                          <div class="flex items-center gap-3 flex-1">
                            <!-- Toggle Switch -->
                            <label class="relative inline-flex items-center cursor-pointer" (click)="$event.stopPropagation()">
                              <input
                                type="checkbox"
                                [checked]="opcion.estaHabilitada"
                                (change)="toggleOpcionOriginal(opcion)"
                                class="sr-only peer"
                              >
                              <div class="w-10 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                            </label>

                            <!-- Label -->
                            <div class="flex-1">
                              <span class="text-sm font-medium text-gray-900 dark:text-white">
                                {{ opcion.visualName }}
                              </span>
                              @if (opcion.codigoOpcion !== 'personalizado') {
                                <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                  ({{ opcion.campoTablaDinamica }})
                                </span>
                              }
                            </div>

                            <!-- Badge -->
                            @if (opcion.codigoOpcion === 'personalizado') {
                              <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                                Manual
                              </span>
                            }
                          </div>

                          <!-- Status Icon -->
                          <div class="ml-2">
                            @if (opcion.estaHabilitada) {
                              <lucide-angular name="check-circle" [size]="20" class="text-green-600"></lucide-angular>
                            } @else {
                              <lucide-angular name="circle" [size]="20" class="text-gray-300 dark:text-gray-500"></lucide-angular>
                            }
                          </div>
                        </div>

                        <!-- Row 2: Restricci\xF3n de Fecha y Genera Carta (solo si est\xE1 habilitada) -->
                        @if (opcion.estaHabilitada) {
                          <div class="mt-2 pt-2 border-t border-green-200 dark:border-green-800 space-y-2" (click)="$event.stopPropagation()">
                            <!-- Restricci\xF3n de fecha -->
                            <div class="flex items-center gap-2">
                              <lucide-angular name="calendar" [size]="14" class="text-blue-600"></lucide-angular>
                              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Restricci\xF3n de fecha:</span>
                              <select
                                [ngModel]="opcion.restriccionFecha || 'SIN_RESTRICCION'"
                                (ngModelChange)="onRestriccionFechaChange(opcion.codigoOpcion, $event)"
                                class="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="SIN_RESTRICCION">Sin restricci\xF3n (cualquier fecha)</option>
                                <option value="DENTRO_MES">Solo dentro del mes actual</option>
                                <option value="FUERA_MES">Solo fuera del mes (pr\xF3ximo mes+)</option>
                              </select>
                            </div>
                            <!-- Genera Carta de Acuerdo -->
                            <div class="flex items-center gap-2">
                              <lucide-angular name="file-text" [size]="14" class="text-purple-600"></lucide-angular>
                              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Genera Carta de Acuerdo:</span>
                              <label class="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  [checked]="opcion.generaCartaAcuerdo"
                                  (change)="onGeneraCartaChange(opcion.codigoOpcion, $event)"
                                  class="sr-only peer"
                                >
                                <div class="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                              </label>
                              <span class="text-xs text-gray-500 dark:text-gray-400">
                                {{ opcion.generaCartaAcuerdo ? 'S\xED' : 'No' }}
                              </span>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                } @else if (errorMessage()) {
                  <div class="text-center py-8 text-red-500 dark:text-red-400">
                    <lucide-angular name="alert-circle" [size]="40" class="mx-auto mb-3"></lucide-angular>
                    <p class="text-sm">{{ errorMessage() }}</p>
                    <button
                      (click)="retryLoadOpciones()"
                      class="mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm hover:bg-red-200"
                    >
                      Reintentar
                    </button>
                  </div>
                } @else {
                  <div class="text-center py-8 text-yellow-600 dark:text-yellow-400">
                    <lucide-angular name="inbox" [size]="40" class="mx-auto mb-3 opacity-60"></lucide-angular>
                    <p class="text-sm">No se encontraron campos num\xE9ricos en esta subcartera</p>
                  </div>
                }
              </div>
            } @else {
              <!-- Estado inicial: seleccionar subcartera -->
              <div class="text-center py-12 text-gray-400 dark:text-gray-500">
                <lucide-angular name="pointer" [size]="48" class="mx-auto mb-4 opacity-50"></lucide-angular>
                <p class="text-sm">Seleccione una subcartera para ver los montos disponibles</p>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="flex justify-between items-center gap-3 p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              @if (opciones().length > 0) {
                <lucide-angular name="info" [size]="14" class="inline mr-1"></lucide-angular>
                Los montos habilitados aparecer\xE1n como opciones para el agente
              }
            </div>
            <div class="flex gap-3">
              <button
                type="button"
                (click)="handleCancel()"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                (click)="handleSave()"
                [disabled]="!canSave()"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
              >
                <lucide-angular name="save" [size]="18"></lucide-angular>
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
    }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TypificationAdditionalFieldsDialogComponent, { className: "TypificationAdditionalFieldsDialogComponent", filePath: "src/app/maintenance/components/typification-additional-fields-dialog/typification-additional-fields-dialog.component.ts", lineNumber: 250 });
})();

// src/app/maintenance/components/typification-maintenance/typification-maintenance.component.ts
var _c02 = (a0, a1, a2) => ({ node: a0, depth: 0, index: a1, siblings: a2, parent: null });
var _c12 = (a0) => ({ node: a0 });
var _c2 = (a0, a1, a2, a3, a4) => ({ node: a0, depth: a1, index: a2, siblings: a3, parent: a4 });
var _forTrack05 = ($index, $item) => $item.typification.id;
var _forTrack13 = ($index, $item) => $item.hex;
function TypificationMaintenanceComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "div", 33)(2, "div")(3, "div", 34);
    \u0275\u0275text(4, "\xA1Cambio Guardado!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 35);
    \u0275\u0275text(6, "La configuraci\xF3n se actualiz\xF3 correctamente");
    \u0275\u0275elementEnd()()()();
  }
}
function TypificationMaintenanceComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1, "OSCURO");
    \u0275\u0275elementEnd();
  }
}
function TypificationMaintenanceComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1, "CLARO");
    \u0275\u0275elementEnd();
  }
}
function TypificationMaintenanceComponent_Conditional_23_option_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tenant_r4 = ctx.$implicit;
    \u0275\u0275property("ngValue", tenant_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tenant_r4.tenantName, " ");
  }
}
function TypificationMaintenanceComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 19);
    \u0275\u0275text(2, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 20);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationMaintenanceComponent_Conditional_23_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.selectedTenantId, $event) || (ctx_r2.selectedTenantId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function TypificationMaintenanceComponent_Conditional_23_Template_select_change_3_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onTenantChange());
    });
    \u0275\u0275template(4, TypificationMaintenanceComponent_Conditional_23_option_4_Template, 2, 2, "option", 22);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(5, "div", 36);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.selectedTenantId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.tenants);
  }
}
function TypificationMaintenanceComponent_Conditional_24_option_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r6 = ctx.$implicit;
    \u0275\u0275property("ngValue", portfolio_r6.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", portfolio_r6.portfolioName, " ");
  }
}
function TypificationMaintenanceComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 19);
    \u0275\u0275text(2, "Cartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 37);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationMaintenanceComponent_Conditional_24_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.selectedPortfolioId, $event) || (ctx_r2.selectedPortfolioId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function TypificationMaintenanceComponent_Conditional_24_Template_select_change_3_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onPortfolioChange());
    });
    \u0275\u0275elementStart(4, "option", 21);
    \u0275\u0275text(5, "Todas las Carteras");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, TypificationMaintenanceComponent_Conditional_24_option_6_Template, 2, 2, "option", 22);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(7, "div", 36);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.selectedPortfolioId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", void 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r2.portfolios);
  }
}
function TypificationMaintenanceComponent_option_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const type_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngValue", type_r7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.getTypeLabel(type_r7), " ");
  }
}
function TypificationMaintenanceComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-typification-form-dialog", 38);
    \u0275\u0275listener("save", function TypificationMaintenanceComponent_Conditional_43_Template_app_typification_form_dialog_save_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onClassificationSaved($event));
    })("cancel", function TypificationMaintenanceComponent_Conditional_43_Template_app_typification_form_dialog_cancel_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeClassificationDialog());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("mode", ctx_r2.classificationDialogMode())("typification", ctx_r2.selectedClassificationForEdit())("parentClassification", ctx_r2.parentClassificationForCreate())("defaultType", ctx_r2.selectedType)("tenantId", ctx_r2.selectedTenantId)("portfolioId", ctx_r2.selectedPortfolioId);
  }
}
function TypificationMaintenanceComponent_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-category-form-dialog", 39);
    \u0275\u0275listener("save", function TypificationMaintenanceComponent_Conditional_44_Template_app_category_form_dialog_save_0_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onCategorySaved($event));
    })("cancel", function TypificationMaintenanceComponent_Conditional_44_Template_app_category_form_dialog_cancel_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeCategoryDialog());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("typifications", ctx_r2.typifications);
  }
}
function TypificationMaintenanceComponent_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-typification-additional-fields-dialog", 40);
    \u0275\u0275listener("save", function TypificationMaintenanceComponent_Conditional_45_Template_app_typification_additional_fields_dialog_save_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onAdditionalFieldsSaved());
    })("close", function TypificationMaintenanceComponent_Conditional_45_Template_app_typification_additional_fields_dialog_close_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeAdditionalFieldsDialog());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("isOpen", ctx_r2.showAdditionalFieldsDialog())("typificationName", ((tmp_4_0 = ctx_r2.selectedTypificationForFields()) == null ? null : tmp_4_0.nombre) || "")("typificationId", (tmp_5_0 = ctx_r2.selectedTypificationForFields()) == null ? null : tmp_5_0.id)("tenantId", ctx_r2.selectedTenantId)("portfolioId", ctx_r2.selectedPortfolioId)("subPortfolioId", void 0);
  }
}
function TypificationMaintenanceComponent_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 41);
    \u0275\u0275element(2, "div", 42);
    \u0275\u0275elementStart(3, "p", 43);
    \u0275\u0275text(4, "Cargando tipificaciones...");
    \u0275\u0275elementEnd()()();
  }
}
function TypificationMaintenanceComponent_Conditional_47_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45)(1, "p", 46);
    \u0275\u0275text(2, "No hay tipificaciones configuradas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 47);
    \u0275\u0275text(4, "Comienza creando tu primera tipificaci\xF3n");
    \u0275\u0275elementEnd()();
  }
}
function TypificationMaintenanceComponent_Conditional_47_Conditional_3_Conditional_0_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 49);
  }
  if (rf & 2) {
    const node_r11 = ctx.$implicit;
    const \u0275$index_162_r12 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(4);
    const treeNodeTemplate_r13 = \u0275\u0275reference(49);
    \u0275\u0275property("ngTemplateOutlet", treeNodeTemplate_r13)("ngTemplateOutletContext", \u0275\u0275pureFunction3(2, _c02, node_r11, \u0275$index_162_r12, ctx_r2.treeNodes));
  }
}
function TypificationMaintenanceComponent_Conditional_47_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275repeaterCreate(1, TypificationMaintenanceComponent_Conditional_47_Conditional_3_Conditional_0_For_2_Template, 1, 6, "ng-container", 49, _forTrack05);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.treeNodes);
  }
}
function TypificationMaintenanceComponent_Conditional_47_Conditional_3_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 49);
  }
  if (rf & 2) {
    const node_r14 = ctx.$implicit;
    \u0275\u0275nextContext(4);
    const flatNodeTemplate_r15 = \u0275\u0275reference(51);
    \u0275\u0275property("ngTemplateOutlet", flatNodeTemplate_r15)("ngTemplateOutletContext", \u0275\u0275pureFunction1(2, _c12, node_r14));
  }
}
function TypificationMaintenanceComponent_Conditional_47_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275repeaterCreate(1, TypificationMaintenanceComponent_Conditional_47_Conditional_3_Conditional_1_For_2_Template, 1, 4, "ng-container", 49, _forTrack05);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.getFilteredNodes(ctx_r2.treeNodes));
  }
}
function TypificationMaintenanceComponent_Conditional_47_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TypificationMaintenanceComponent_Conditional_47_Conditional_3_Conditional_0_Template, 3, 0, "div", 48)(1, TypificationMaintenanceComponent_Conditional_47_Conditional_3_Conditional_1_Template, 3, 0, "div", 48);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r2.selectedType ? 0 : 1);
  }
}
function TypificationMaintenanceComponent_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "div", 44);
    \u0275\u0275conditionalCreate(2, TypificationMaintenanceComponent_Conditional_47_Conditional_2_Template, 5, 0, "div", 45)(3, TypificationMaintenanceComponent_Conditional_47_Conditional_3_Template, 2, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.treeNodes.length === 0 ? 2 : 3);
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_2_Conditional_1_Template(rf, ctx) {
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_2_Conditional_2_Template(rf, ctx) {
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 65);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r16);
      const node_r17 = \u0275\u0275nextContext(2).node;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.toggleNode(node_r17.typification.id);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275conditionalCreate(1, TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_2_Conditional_1_Template, 0, 0)(2, TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_2_Conditional_2_Template, 0, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const node_r17 = \u0275\u0275nextContext(2).node;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isExpanded(node_r17.typification.id) ? 1 : 2);
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 57);
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 59);
  }
  if (rf & 2) {
    const node_r17 = \u0275\u0275nextContext(2).node;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("name", ctx_r2.getEffectiveValue(node_r17.config, node_r17.typification, "icono"))("size", ctx_r2.matchesTypeFilter(node_r17.typification) ? 18 : 14);
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const node_r17 = \u0275\u0275nextContext(2).node;
    \u0275\u0275textInterpolate1(" ", (node_r17.typification.codigo == null ? null : node_r17.typification.codigo.substring(0, 2)) || "NA", " ");
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_10_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 66);
    \u0275\u0275text(1, "PERSONALIZADO");
    \u0275\u0275elementEnd();
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275text(1);
    \u0275\u0275conditionalCreate(2, TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_10_Conditional_2_Template, 2, 0, "span", 66);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const node_r17 = \u0275\u0275nextContext(2).node;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.getTypeLabel(node_r17.typification.tipoClasificacion), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.hasCustomizations(node_r17.config) ? 2 : -1);
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 80);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Conditional_6_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r19);
      const node_r17 = \u0275\u0275nextContext(3).node;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.resetCustomization(node_r17, $event));
    });
    \u0275\u0275element(1, "lucide-angular", 81);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 64)(1, "label", 67);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Template_label_click_1_listener($event) {
      \u0275\u0275restoreView(_r18);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "input", 68);
    \u0275\u0275listener("change", function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Template_input_change_2_listener($event) {
      \u0275\u0275restoreView(_r18);
      const node_r17 = \u0275\u0275nextContext(2).node;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.toggleTypification(node_r17, $event);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "div", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 70);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Template_button_click_4_listener($event) {
      \u0275\u0275restoreView(_r18);
      const node_r17 = \u0275\u0275nextContext(2).node;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.startEdit(node_r17, $event));
    });
    \u0275\u0275text(5, " EDITAR ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Conditional_6_Template, 2, 1, "button", 71);
    \u0275\u0275elementStart(7, "button", 72);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Template_button_click_7_listener($event) {
      \u0275\u0275restoreView(_r18);
      const node_r17 = \u0275\u0275nextContext(2).node;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.openCreateChildDialog(node_r17.typification);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(8, "lucide-angular", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 74);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Template_button_click_9_listener($event) {
      \u0275\u0275restoreView(_r18);
      const node_r17 = \u0275\u0275nextContext(2).node;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.openAdditionalFieldsDialog(node_r17.typification);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(10, "lucide-angular", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 76);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Template_button_click_11_listener($event) {
      \u0275\u0275restoreView(_r18);
      const node_r17 = \u0275\u0275nextContext(2).node;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.openEditDialog(node_r17.typification);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(12, "lucide-angular", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 78);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Template_button_click_13_listener($event) {
      \u0275\u0275restoreView(_r18);
      const node_r17 = \u0275\u0275nextContext(2).node;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.deleteTypification(node_r17.typification);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(14, "lucide-angular", 79);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const node_r17 = \u0275\u0275nextContext(2).node;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("title", (node_r17.config == null ? null : node_r17.config.estaHabilitada) ? "Desactivar" : "Activar");
    \u0275\u0275advance();
    \u0275\u0275property("checked", (node_r17.config == null ? null : node_r17.config.estaHabilitada) === true);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.hasCustomizations(node_r17.config) ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275classProp("opacity-30", node_r17.typification.esSistema)("cursor-not-allowed", node_r17.typification.esSistema);
    \u0275\u0275property("disabled", node_r17.typification.esSistema);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54)(1, "div", 55);
    \u0275\u0275conditionalCreate(2, TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_2_Template, 3, 1, "button", 56)(3, TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_3_Template, 1, 0, "div", 57);
    \u0275\u0275elementStart(4, "div", 58);
    \u0275\u0275conditionalCreate(5, TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_5_Template, 1, 2, "lucide-angular", 59)(6, TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_6_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 60)(8, "div", 61);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_10_Template, 3, 2, "div", 62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 63);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, TypificationMaintenanceComponent_ng_template_48_Conditional_1_Conditional_13_Template, 15, 12, "div", 64);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const node_r17 = \u0275\u0275nextContext().node;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("py-1", ctx_r2.matchesTypeFilter(node_r17.typification))("py-0", !ctx_r2.matchesTypeFilter(node_r17.typification))("opacity-40", !ctx_r2.matchesTypeFilter(node_r17.typification))("scale-95", !ctx_r2.matchesTypeFilter(node_r17.typification))("bg-green-50", (node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("dark:bg-green-950/40", (node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("hover:bg-green-100", (node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("dark:hover:bg-green-900/50", (node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("bg-slate-100", !(node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("dark:bg-slate-800/50", !(node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("hover:bg-slate-200", !(node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("dark:hover:bg-slate-700/50", !(node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("bg-gray-50", !ctx_r2.matchesTypeFilter(node_r17.typification))("dark:bg-gray-900/20", !ctx_r2.matchesTypeFilter(node_r17.typification))("border-l-green-500", (node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("dark:border-l-green-600", (node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("border-l-slate-400", !(node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("dark:border-l-slate-600", !(node_r17.config == null ? null : node_r17.config.estaHabilitada) && ctx_r2.matchesTypeFilter(node_r17.typification))("border-l-gray-300", !ctx_r2.matchesTypeFilter(node_r17.typification))("dark:border-l-gray-700", !ctx_r2.matchesTypeFilter(node_r17.typification))("ring-2", ctx_r2.hasCustomizations(node_r17.config) && ctx_r2.matchesTypeFilter(node_r17.typification))("ring-purple-400", ctx_r2.hasCustomizations(node_r17.config) && ctx_r2.matchesTypeFilter(node_r17.typification))("dark:ring-purple-600", ctx_r2.hasCustomizations(node_r17.config) && ctx_r2.matchesTypeFilter(node_r17.typification));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(node_r17.children && node_r17.children.length > 0 ? 2 : 3);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background-color", ctx_r2.getEffectiveValue(node_r17.config, node_r17.typification, "color") || "#6B7280");
    \u0275\u0275classProp("w-8", ctx_r2.matchesTypeFilter(node_r17.typification))("h-8", ctx_r2.matchesTypeFilter(node_r17.typification))("text-xs", ctx_r2.matchesTypeFilter(node_r17.typification))("w-6", !ctx_r2.matchesTypeFilter(node_r17.typification))("h-6", !ctx_r2.matchesTypeFilter(node_r17.typification))("text-[9px]", !ctx_r2.matchesTypeFilter(node_r17.typification));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.getEffectiveValue(node_r17.config, node_r17.typification, "icono") ? 5 : 6);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("text-sm", ctx_r2.matchesTypeFilter(node_r17.typification))("text-slate-800", ctx_r2.matchesTypeFilter(node_r17.typification))("dark:text-slate-100", ctx_r2.matchesTypeFilter(node_r17.typification))("text-xs", !ctx_r2.matchesTypeFilter(node_r17.typification))("text-gray-500", !ctx_r2.matchesTypeFilter(node_r17.typification))("dark:text-gray-500", !ctx_r2.matchesTypeFilter(node_r17.typification));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.getEffectiveValue(node_r17.config, node_r17.typification, "nombre"), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.matchesTypeFilter(node_r17.typification) ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("text-[10px]", ctx_r2.matchesTypeFilter(node_r17.typification))("text-[8px]", !ctx_r2.matchesTypeFilter(node_r17.typification));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" N", node_r17.level, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.matchesTypeFilter(node_r17.typification) ? 13 : -1);
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_2_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 95);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_48_Conditional_2_For_7_Template_button_click_0_listener() {
      const color_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.editingForm().colorPersonalizado = color_r22.hex);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const color_r22 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap("w-6 h-6 rounded border-2 transition-all " + (ctx_r2.editingForm().colorPersonalizado === color_r22.hex ? "border-gray-900 dark:border-white ring-2 ring-purple-500" : "border-gray-300"));
    \u0275\u0275styleProp("background-color", color_r22.hex);
    \u0275\u0275property("title", color_r22.name);
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_2_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 93);
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 52)(1, "div", 82)(2, "div", 83)(3, "label", 84);
    \u0275\u0275text(4, "Color");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 85);
    \u0275\u0275repeaterCreate(6, TypificationMaintenanceComponent_ng_template_48_Conditional_2_For_7_Template, 1, 5, "button", 86, _forTrack13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 87)(9, "div")(10, "label", 84);
    \u0275\u0275text(11, "Nombre Personalizado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 88);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationMaintenanceComponent_ng_template_48_Conditional_2_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.editingForm().nombrePersonalizado, $event) || (ctx_r2.editingForm().nombrePersonalizado = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div")(14, "label", 84);
    \u0275\u0275text(15, "Descripci\xF3n (Opcional)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "textarea", 89);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationMaintenanceComponent_ng_template_48_Conditional_2_Template_textarea_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.editingForm().descripcionPersonalizada, $event) || (ctx_r2.editingForm().descripcionPersonalizada = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275text(17, "              ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div")(19, "label", 84);
    \u0275\u0275text(20, "Orden");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 90);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationMaintenanceComponent_ng_template_48_Conditional_2_Template_input_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.editingForm().ordenVisualizacionPersonalizado, $event) || (ctx_r2.editingForm().ordenVisualizacionPersonalizado = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 91)(23, "button", 92);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_48_Conditional_2_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r20);
      const node_r17 = \u0275\u0275nextContext().node;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.saveEdit(node_r17));
    });
    \u0275\u0275conditionalCreate(24, TypificationMaintenanceComponent_ng_template_48_Conditional_2_Conditional_24_Template, 1, 0, "div", 93);
    \u0275\u0275text(25, " GUARDAR ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 94);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_48_Conditional_2_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cancelEdit());
    });
    \u0275\u0275text(27, " CANCELAR ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r2.presetColors);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.editingForm().nombrePersonalizado);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.editingForm().descripcionPersonalizada);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.editingForm().ordenVisualizacionPersonalizado);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.savingEdit());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.savingEdit() ? 24 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.savingEdit());
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 49);
  }
  if (rf & 2) {
    const child_r23 = ctx.$implicit;
    const \u0275$index_297_r24 = ctx.$index;
    const ctx_r24 = \u0275\u0275nextContext(2);
    const node_r17 = ctx_r24.node;
    const depth_r26 = ctx_r24.depth;
    \u0275\u0275nextContext();
    const treeNodeTemplate_r13 = \u0275\u0275reference(49);
    \u0275\u0275property("ngTemplateOutlet", treeNodeTemplate_r13)("ngTemplateOutletContext", \u0275\u0275pureFunction5(2, _c2, child_r23, depth_r26 + 1, \u0275$index_297_r24, node_r17.children, node_r17));
  }
}
function TypificationMaintenanceComponent_ng_template_48_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275repeaterCreate(1, TypificationMaintenanceComponent_ng_template_48_Conditional_3_For_2_Template, 1, 8, "ng-container", 49, _forTrack05);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const node_r17 = \u0275\u0275nextContext().node;
    \u0275\u0275advance();
    \u0275\u0275repeater(node_r17.children);
  }
}
function TypificationMaintenanceComponent_ng_template_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50);
    \u0275\u0275conditionalCreate(1, TypificationMaintenanceComponent_ng_template_48_Conditional_1_Template, 14, 82, "div", 51);
    \u0275\u0275conditionalCreate(2, TypificationMaintenanceComponent_ng_template_48_Conditional_2_Template, 28, 6, "div", 52);
    \u0275\u0275conditionalCreate(3, TypificationMaintenanceComponent_ng_template_48_Conditional_3_Template, 3, 0, "div", 53);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const node_r17 = ctx.node;
    const depth_r26 = ctx.depth;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("margin-left", depth_r26 * 16, "px");
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.isEditing(node_r17.config == null ? null : node_r17.config.id) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isEditing(node_r17.config == null ? null : node_r17.config.id) && ctx_r2.editingForm() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isExpanded(node_r17.typification.id) && node_r17.children && node_r17.children.length > 0 ? 3 : -1);
  }
}
function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 59);
  }
  if (rf & 2) {
    const node_r28 = \u0275\u0275nextContext(2).node;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("name", ctx_r2.getEffectiveValue(node_r28.config, node_r28.typification, "icono"))("size", 20);
  }
}
function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const node_r28 = \u0275\u0275nextContext(2).node;
    \u0275\u0275textInterpolate1(" ", (node_r28.typification.codigo == null ? null : node_r28.typification.codigo.substring(0, 2)) || "NA", " ");
  }
}
function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 100);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const node_r28 = \u0275\u0275nextContext(2).node;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.getParentBreadcrumb(node_r28), " ");
  }
}
function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 102);
    \u0275\u0275text(1, "PERSONALIZADO");
    \u0275\u0275elementEnd();
  }
}
function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 80);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Conditional_18_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r29);
      const node_r28 = \u0275\u0275nextContext(2).node;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.resetCustomization(node_r28, $event));
    });
    \u0275\u0275element(1, "lucide-angular", 81);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 97)(1, "div", 98)(2, "div", 99);
    \u0275\u0275conditionalCreate(3, TypificationMaintenanceComponent_ng_template_50_Conditional_1_Conditional_3_Template, 1, 2, "lucide-angular", 59)(4, TypificationMaintenanceComponent_ng_template_50_Conditional_1_Conditional_4_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 60);
    \u0275\u0275conditionalCreate(6, TypificationMaintenanceComponent_ng_template_50_Conditional_1_Conditional_6_Template, 2, 1, "div", 100);
    \u0275\u0275elementStart(7, "div", 101);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, TypificationMaintenanceComponent_ng_template_50_Conditional_1_Conditional_9_Template, 2, 0, "span", 102);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 103);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 104)(13, "label", 67);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Template_label_click_13_listener($event) {
      \u0275\u0275restoreView(_r27);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(14, "input", 68);
    \u0275\u0275listener("change", function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Template_input_change_14_listener($event) {
      \u0275\u0275restoreView(_r27);
      const node_r28 = \u0275\u0275nextContext().node;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.toggleTypification(node_r28, $event);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "div", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 70);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Template_button_click_16_listener($event) {
      \u0275\u0275restoreView(_r27);
      const node_r28 = \u0275\u0275nextContext().node;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.startEdit(node_r28, $event));
    });
    \u0275\u0275text(17, " EDITAR ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, TypificationMaintenanceComponent_ng_template_50_Conditional_1_Conditional_18_Template, 2, 1, "button", 71);
    \u0275\u0275elementStart(19, "button", 72);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Template_button_click_19_listener($event) {
      \u0275\u0275restoreView(_r27);
      const node_r28 = \u0275\u0275nextContext().node;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.openCreateChildDialog(node_r28.typification);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(20, "lucide-angular", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 74);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Template_button_click_21_listener($event) {
      \u0275\u0275restoreView(_r27);
      const node_r28 = \u0275\u0275nextContext().node;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.openAdditionalFieldsDialog(node_r28.typification);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(22, "lucide-angular", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "button", 76);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Template_button_click_23_listener($event) {
      \u0275\u0275restoreView(_r27);
      const node_r28 = \u0275\u0275nextContext().node;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.openEditDialog(node_r28.typification);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(24, "lucide-angular", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "button", 78);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_50_Conditional_1_Template_button_click_25_listener($event) {
      \u0275\u0275restoreView(_r27);
      const node_r28 = \u0275\u0275nextContext().node;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.deleteTypification(node_r28.typification);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(26, "lucide-angular", 79);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const node_r28 = \u0275\u0275nextContext().node;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("bg-green-50", node_r28.config == null ? null : node_r28.config.estaHabilitada)("dark:bg-green-950/40", node_r28.config == null ? null : node_r28.config.estaHabilitada)("hover:bg-green-100", node_r28.config == null ? null : node_r28.config.estaHabilitada)("dark:hover:bg-green-900/50", node_r28.config == null ? null : node_r28.config.estaHabilitada)("bg-slate-100", !(node_r28.config == null ? null : node_r28.config.estaHabilitada))("dark:bg-slate-800/50", !(node_r28.config == null ? null : node_r28.config.estaHabilitada))("hover:bg-slate-200", !(node_r28.config == null ? null : node_r28.config.estaHabilitada))("dark:hover:bg-slate-700/50", !(node_r28.config == null ? null : node_r28.config.estaHabilitada))("border-l-green-500", node_r28.config == null ? null : node_r28.config.estaHabilitada)("dark:border-l-green-600", node_r28.config == null ? null : node_r28.config.estaHabilitada)("border-l-slate-400", !(node_r28.config == null ? null : node_r28.config.estaHabilitada))("dark:border-l-slate-600", !(node_r28.config == null ? null : node_r28.config.estaHabilitada))("ring-2", ctx_r2.hasCustomizations(node_r28.config))("ring-purple-400", ctx_r2.hasCustomizations(node_r28.config))("dark:ring-purple-600", ctx_r2.hasCustomizations(node_r28.config));
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background-color", ctx_r2.getEffectiveValue(node_r28.config, node_r28.typification, "color") || "#6B7280");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.getEffectiveValue(node_r28.config, node_r28.typification, "icono") ? 3 : 4);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.getParentBreadcrumb(node_r28) ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.getEffectiveValue(node_r28.config, node_r28.typification, "nombre"), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.hasCustomizations(node_r28.config) ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" N", node_r28.level, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("title", (node_r28.config == null ? null : node_r28.config.estaHabilitada) ? "Desactivar" : "Activar");
    \u0275\u0275advance();
    \u0275\u0275property("checked", (node_r28.config == null ? null : node_r28.config.estaHabilitada) === true);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.hasCustomizations(node_r28.config) ? 18 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275classProp("opacity-30", node_r28.typification.esSistema)("cursor-not-allowed", node_r28.typification.esSistema);
    \u0275\u0275property("disabled", node_r28.typification.esSistema);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function TypificationMaintenanceComponent_ng_template_50_Conditional_2_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 95);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_50_Conditional_2_For_7_Template_button_click_0_listener() {
      const color_r32 = \u0275\u0275restoreView(_r31).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.editingForm().colorPersonalizado = color_r32.hex);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const color_r32 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap("w-6 h-6 rounded border-2 transition-all " + (ctx_r2.editingForm().colorPersonalizado === color_r32.hex ? "border-gray-900 dark:border-white ring-2 ring-purple-500" : "border-gray-300"));
    \u0275\u0275styleProp("background-color", color_r32.hex);
    \u0275\u0275property("title", color_r32.name);
  }
}
function TypificationMaintenanceComponent_ng_template_50_Conditional_2_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 93);
  }
}
function TypificationMaintenanceComponent_ng_template_50_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 52)(1, "div", 82)(2, "div", 83)(3, "label", 84);
    \u0275\u0275text(4, "Color");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 85);
    \u0275\u0275repeaterCreate(6, TypificationMaintenanceComponent_ng_template_50_Conditional_2_For_7_Template, 1, 5, "button", 86, _forTrack13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 87)(9, "div")(10, "label", 84);
    \u0275\u0275text(11, "Nombre Personalizado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 88);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationMaintenanceComponent_ng_template_50_Conditional_2_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r30);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.editingForm().nombrePersonalizado, $event) || (ctx_r2.editingForm().nombrePersonalizado = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div")(14, "label", 84);
    \u0275\u0275text(15, "Descripci\xF3n (Opcional)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "textarea", 89);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationMaintenanceComponent_ng_template_50_Conditional_2_Template_textarea_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r30);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.editingForm().descripcionPersonalizada, $event) || (ctx_r2.editingForm().descripcionPersonalizada = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275text(17, "              ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div")(19, "label", 84);
    \u0275\u0275text(20, "Orden");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 90);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationMaintenanceComponent_ng_template_50_Conditional_2_Template_input_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r30);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.editingForm().ordenVisualizacionPersonalizado, $event) || (ctx_r2.editingForm().ordenVisualizacionPersonalizado = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 91)(23, "button", 92);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_50_Conditional_2_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r30);
      const node_r28 = \u0275\u0275nextContext().node;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.saveEdit(node_r28));
    });
    \u0275\u0275conditionalCreate(24, TypificationMaintenanceComponent_ng_template_50_Conditional_2_Conditional_24_Template, 1, 0, "div", 93);
    \u0275\u0275text(25, " GUARDAR ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 94);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_ng_template_50_Conditional_2_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r30);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cancelEdit());
    });
    \u0275\u0275text(27, " CANCELAR ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r2.presetColors);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.editingForm().nombrePersonalizado);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.editingForm().descripcionPersonalizada);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.editingForm().ordenVisualizacionPersonalizado);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.savingEdit());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.savingEdit() ? 24 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.savingEdit());
  }
}
function TypificationMaintenanceComponent_ng_template_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50);
    \u0275\u0275conditionalCreate(1, TypificationMaintenanceComponent_ng_template_50_Conditional_1_Template, 27, 49, "div", 96);
    \u0275\u0275conditionalCreate(2, TypificationMaintenanceComponent_ng_template_50_Conditional_2_Template, 28, 6, "div", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const node_r28 = ctx.node;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.isEditing(node_r28.config == null ? null : node_r28.config.id) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isEditing(node_r28.config == null ? null : node_r28.config.id) && ctx_r2.editingForm() ? 2 : -1);
  }
}
var _TypificationMaintenanceComponent = class _TypificationMaintenanceComponent {
  constructor(classificationService, themeService) {
    this.classificationService = classificationService;
    this.themeService = themeService;
    this.loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : []);
    this.showSuccess = signal(false, ...ngDevMode ? [{ debugName: "showSuccess" }] : []);
    this.showClassificationDialog = signal(false, ...ngDevMode ? [{ debugName: "showClassificationDialog" }] : []);
    this.showCategoryDialog = signal(false, ...ngDevMode ? [{ debugName: "showCategoryDialog" }] : []);
    this.showAdditionalFieldsDialog = signal(false, ...ngDevMode ? [{ debugName: "showAdditionalFieldsDialog" }] : []);
    this.classificationDialogMode = signal("create", ...ngDevMode ? [{ debugName: "classificationDialogMode" }] : []);
    this.selectedClassificationForEdit = signal(void 0, ...ngDevMode ? [{ debugName: "selectedClassificationForEdit" }] : []);
    this.selectedTypificationForFields = signal(void 0, ...ngDevMode ? [{ debugName: "selectedTypificationForFields" }] : []);
    this.additionalFieldsForEdit = signal([], ...ngDevMode ? [{ debugName: "additionalFieldsForEdit" }] : []);
    this.parentClassificationForCreate = signal(void 0, ...ngDevMode ? [{ debugName: "parentClassificationForCreate" }] : []);
    this.classificationTypes = Object.values(ClassificationTypeV2);
    this.typifications = [];
    this.tenantConfigs = [];
    this.treeNodes = [];
    this.expandedNodes = /* @__PURE__ */ new Set();
    this.tenants = [];
    this.portfolios = [];
    this.editingNodeId = signal(null, ...ngDevMode ? [{ debugName: "editingNodeId" }] : []);
    this.editingForm = signal(null, ...ngDevMode ? [{ debugName: "editingForm" }] : []);
    this.savingEdit = signal(false, ...ngDevMode ? [{ debugName: "savingEdit" }] : []);
    this.presetColors = [
      { hex: "#3B82F6", name: "Azul" },
      { hex: "#10B981", name: "Verde" },
      { hex: "#EF4444", name: "Rojo" },
      { hex: "#F59E0B", name: "Naranja" },
      { hex: "#8B5CF6", name: "Violeta" },
      { hex: "#EC4899", name: "Rosa" },
      { hex: "#6366F1", name: "\xCDndigo" },
      { hex: "#14B8A6", name: "Turquesa" }
    ];
    this.commonIcons = [
      "phone",
      "phone-call",
      "check-circle",
      "x-circle",
      "alert-circle",
      "user",
      "users",
      "credit-card",
      "dollar-sign",
      "calendar",
      "clock",
      "mail",
      "message-square",
      "file-text",
      "building",
      "wallet"
    ];
  }
  ngOnInit() {
    this.loadTenants();
  }
  loadTenants() {
    this.classificationService.getAllTenants().subscribe({
      next: (data) => {
        this.tenants = data;
        if (data.length > 0) {
          this.selectedTenantId = data[0].id;
          this.onTenantChange();
        }
      },
      error: (error) => {
        console.error("Error loading tenants:", error);
      }
    });
  }
  onTenantChange() {
    this.selectedPortfolioId = void 0;
    this.portfolios = [];
    this.typifications = [];
    this.treeNodes = [];
    if (this.selectedTenantId) {
      this.loadPortfolios();
      this.loadTypifications();
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
  loadTypifications() {
    if (!this.selectedTenantId)
      return;
    this.loading.set(true);
    const request$ = this.selectedType ? this.classificationService.getTenantClassificationsByType(this.selectedTenantId, this.selectedType, this.selectedPortfolioId) : this.classificationService.getTenantClassifications(
      this.selectedTenantId,
      this.selectedPortfolioId,
      true
      // includeDisabled = true for maintenance view
    );
    request$.subscribe({
      next: (configs) => {
        this.tenantConfigs = configs;
        this.typifications = configs.map((config) => config.tipificacion);
        this.buildTree();
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        console.error("Error loading typifications:", error);
      }
    });
  }
  loadTenantConfigs() {
    if (!this.selectedTenantId)
      return;
    const request$ = this.selectedType ? this.classificationService.getTenantClassificationsByType(this.selectedTenantId, this.selectedType, this.selectedPortfolioId) : this.classificationService.getTenantClassifications(this.selectedTenantId, this.selectedPortfolioId);
    request$.subscribe({
      next: (configs) => {
        this.tenantConfigs = configs;
        this.buildTree();
        this.loading.set(false);
      },
      error: (error) => {
        console.error("Error loading tenant configs:", error);
        this.buildTree();
        this.loading.set(false);
      }
    });
  }
  buildTree() {
    const configMap = /* @__PURE__ */ new Map();
    this.tenantConfigs.forEach((config) => {
      configMap.set(config.tipificacion.id, config);
    });
    const nodeMap = /* @__PURE__ */ new Map();
    this.typifications.forEach((typification) => {
      const node = {
        typification,
        config: configMap.get(typification.id),
        children: [],
        level: typification.nivelJerarquia
      };
      nodeMap.set(typification.id, node);
    });
    const roots = [];
    this.typifications.forEach((typification) => {
      const node = nodeMap.get(typification.id);
      const parentId = typification.parentTypificationId || typification.tipificacionPadre?.id;
      if (parentId) {
        const parent = nodeMap.get(parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });
    const sortNodes = (nodes) => {
      nodes.sort((a, b) => {
        const orderA = a.typification.ordenVisualizacion || 0;
        const orderB = b.typification.ordenVisualizacion || 0;
        return orderA - orderB;
      });
      nodes.forEach((node) => {
        if (node.children.length > 0) {
          sortNodes(node.children);
        }
      });
    };
    sortNodes(roots);
    this.treeNodes = roots;
    this.expandAll();
  }
  toggleNode(nodeId) {
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
  }
  isExpanded(nodeId) {
    return this.expandedNodes.has(nodeId);
  }
  expandAll() {
    this.typifications.forEach((c) => this.expandedNodes.add(c.id));
  }
  collapseAll() {
    this.expandedNodes.clear();
  }
  onTypeChange() {
    this.loadTypifications();
  }
  onPortfolioChange() {
    this.loadTypifications();
  }
  toggleTypification(node, event) {
    if (!this.selectedTenantId)
      return;
    const target = event.target;
    const enabled = target.checked;
    const action$ = enabled ? this.classificationService.enableClassification(this.selectedTenantId, node.typification.id, this.selectedPortfolioId) : this.classificationService.disableClassification(this.selectedTenantId, node.typification.id, this.selectedPortfolioId);
    action$.subscribe({
      next: () => {
        this.showSuccessMessage();
        this.loadTypifications();
      },
      error: (error) => {
        console.error("Error toggling typification:", error);
        target.checked = !enabled;
      }
    });
  }
  toggleDarkMode() {
    this.themeService.toggleTheme();
  }
  // Classification dialog methods
  openCreateRootDialog() {
    this.classificationDialogMode.set("create");
    this.selectedClassificationForEdit.set(void 0);
    this.parentClassificationForCreate.set(void 0);
    this.showClassificationDialog.set(true);
  }
  openCreateChildDialog(parent) {
    this.classificationDialogMode.set("create");
    this.selectedClassificationForEdit.set(void 0);
    this.parentClassificationForCreate.set(parent);
    this.showClassificationDialog.set(true);
  }
  openEditDialog(typification) {
    this.classificationDialogMode.set("edit");
    this.selectedClassificationForEdit.set(typification);
    this.parentClassificationForCreate.set(void 0);
    this.showClassificationDialog.set(true);
  }
  closeClassificationDialog() {
    this.showClassificationDialog.set(false);
    this.selectedClassificationForEdit.set(void 0);
    this.parentClassificationForCreate.set(void 0);
  }
  onClassificationSaved(typification) {
    this.showClassificationDialog.set(false);
    this.selectedClassificationForEdit.set(void 0);
    this.parentClassificationForCreate.set(void 0);
    this.showSuccessMessage();
    this.loadTypifications();
  }
  // Additional Fields dialog methods
  openAdditionalFieldsDialog(typification) {
    this.selectedTypificationForFields.set(typification);
    this.loading.set(true);
    this.classificationService.getAdditionalFields(typification.id).subscribe({
      next: (fields) => {
        this.additionalFieldsForEdit.set(fields);
        this.showAdditionalFieldsDialog.set(true);
        this.loading.set(false);
      },
      error: (error) => {
        console.error("Error loading additional fields:", error);
        this.additionalFieldsForEdit.set([]);
        this.showAdditionalFieldsDialog.set(true);
        this.loading.set(false);
      }
    });
  }
  closeAdditionalFieldsDialog() {
    this.showAdditionalFieldsDialog.set(false);
    this.selectedTypificationForFields.set(void 0);
    this.additionalFieldsForEdit.set([]);
  }
  onAdditionalFieldsSaved() {
    console.log("Campos adicionales guardados exitosamente");
    this.showAdditionalFieldsDialog.set(false);
    this.selectedTypificationForFields.set(void 0);
    this.additionalFieldsForEdit.set([]);
    this.showSuccessMessage();
  }
  deleteTypification(typification) {
    if (typification.esSistema) {
      alert("No se pueden eliminar tipificaciones del sistema");
      return;
    }
    const message = `\xBFEst\xE1 seguro de eliminar la tipificaci\xF3n "${typification.nombre}"?

Esto la eliminar\xE1 del cat\xE1logo global y afectar\xE1 a TODAS las carteras.

Esta acci\xF3n no se puede deshacer.`;
    if (!confirm(message)) {
      return;
    }
    this.classificationService.deleteTypification(typification.id).subscribe({
      next: () => {
        this.showSuccessMessage();
        this.loadTypifications();
      },
      error: (error) => {
        console.error("Error al eliminar tipificaci\xF3n:", error);
        alert("Error al eliminar la tipificaci\xF3n.");
      }
    });
  }
  showSuccessMessage() {
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3e3);
  }
  // Category dialog methods
  openCreateCategoryDialog() {
    this.showCategoryDialog.set(true);
  }
  closeCategoryDialog() {
    this.showCategoryDialog.set(false);
  }
  onCategorySaved(categoryName) {
    this.showCategoryDialog.set(false);
    this.showSuccessMessage();
    this.classificationTypes = Object.values(ClassificationTypeV2);
  }
  getTypeLabel(type) {
    const labels = {
      [ClassificationTypeV2.RESULTADO_CONTACTO]: "Resultado de Contacto",
      [ClassificationTypeV2.TIPO_GESTION]: "Tipo de Gesti\xF3n",
      [ClassificationTypeV2.MODALIDAD_PAGO]: "Modalidad de Pago",
      [ClassificationTypeV2.TIPO_FRACCIONAMIENTO]: "Tipo de Fraccionamiento"
    };
    return labels[type];
  }
  /**
   * Mueve un nodo hacia arriba en el orden
   */
  moveUp(node, siblings, index, parent) {
    if (index === 0)
      return;
    [siblings[index - 1], siblings[index]] = [siblings[index], siblings[index - 1]];
    this.updateOrder(siblings);
  }
  /**
   * Mueve un nodo hacia abajo en el orden
   */
  moveDown(node, siblings, index, parent) {
    if (index === siblings.length - 1)
      return;
    [siblings[index], siblings[index + 1]] = [siblings[index + 1], siblings[index]];
    this.updateOrder(siblings);
  }
  /**
   * Actualiza el orden de los nodos en el backend
   */
  updateOrder(siblings) {
    const updates = siblings.map((node, index) => ({
      id: node.typification.id,
      ordenVisualizacion: index * 10
    }));
    console.warn("updateOrder: endpoint no implementado en V2", updates);
    this.showSuccessMessage();
  }
  // ========================================
  // Inline Editing Methods
  // ========================================
  /**
   * Inicia la edición inline de una tipificación
   */
  startEdit(node, event) {
    event.stopPropagation();
    const config = node.config;
    const typification = node.typification;
    this.editingNodeId.set(config?.id || null);
    this.editingForm.set({
      nombrePersonalizado: config?.nombrePersonalizado || typification.nombre,
      descripcionPersonalizada: config?.descripcionPersonalizada || typification.descripcion || "",
      colorPersonalizado: config?.colorPersonalizado || typification.colorSugerido || "#3B82F6",
      iconoPersonalizado: config?.iconoPersonalizado || typification.iconoSugerido || "",
      ordenVisualizacionPersonalizado: config?.ordenVisualizacionPersonalizado || typification.ordenVisualizacion || 0
    });
  }
  /**
   * Cancela la edición inline
   */
  cancelEdit() {
    this.editingNodeId.set(null);
    this.editingForm.set(null);
  }
  /**
   * Guarda los cambios de edición inline
   */
  saveEdit(node) {
    if (!this.editingForm() || !node.config)
      return;
    this.savingEdit.set(true);
    const form = this.editingForm();
    const command = {
      nombrePersonalizado: form.nombrePersonalizado !== node.typification.nombre ? form.nombrePersonalizado : void 0,
      descripcionPersonalizada: form.descripcionPersonalizada !== (node.typification.descripcion || "") ? form.descripcionPersonalizada : void 0,
      colorPersonalizado: form.colorPersonalizado !== (node.typification.colorSugerido || "#3B82F6") ? form.colorPersonalizado : void 0,
      iconoPersonalizado: form.iconoPersonalizado !== (node.typification.iconoSugerido || "") ? form.iconoPersonalizado : void 0,
      ordenVisualizacionPersonalizado: form.ordenVisualizacionPersonalizado !== (node.typification.ordenVisualizacion || 0) ? form.ordenVisualizacionPersonalizado : void 0
    };
    this.classificationService.updateTenantTypificationConfig(node.config.id, command).subscribe({
      next: () => {
        this.savingEdit.set(false);
        this.editingNodeId.set(null);
        this.editingForm.set(null);
        this.showSuccessMessage();
        this.loadTypifications();
      },
      error: (error) => {
        console.error("Error al guardar personalizaci\xF3n:", error);
        this.savingEdit.set(false);
        alert("Error al guardar los cambios");
      }
    });
  }
  /**
   * Resetea la personalización a valores del catálogo
   */
  resetCustomization(node, event) {
    event.stopPropagation();
    if (!node.config)
      return;
    if (!confirm("\xBFResetear a valores del cat\xE1logo global?")) {
      return;
    }
    const command = {
      nombrePersonalizado: void 0,
      descripcionPersonalizada: void 0,
      colorPersonalizado: void 0,
      iconoPersonalizado: void 0,
      ordenVisualizacionPersonalizado: void 0
    };
    this.classificationService.updateTenantTypificationConfig(node.config.id, command).subscribe({
      next: () => {
        this.showSuccessMessage();
        this.loadTypifications();
      },
      error: (error) => {
        console.error("Error al resetear personalizaci\xF3n:", error);
        alert("Error al resetear personalizaci\xF3n");
      }
    });
  }
  /**
   * Verifica si un nodo está siendo editado
   */
  isEditing(configId) {
    return configId !== void 0 && this.editingNodeId() === configId;
  }
  /**
   * Verifica si un nodo tiene personalizaciones
   */
  hasCustomizations(config) {
    if (!config)
      return false;
    return !!(config.nombrePersonalizado || config.descripcionPersonalizada || config.colorPersonalizado || config.iconoPersonalizado || config.ordenVisualizacionPersonalizado !== null);
  }
  /**
   * Obtiene el valor efectivo de un campo
   */
  getEffectiveValue(config, typification, field) {
    const customField = field + "Personalizado";
    const catalogField = field === "nombre" ? "nombre" : field === "color" ? "colorSugerido" : field === "icono" ? "iconoSugerido" : field;
    return config?.[customField] || typification[catalogField] || "";
  }
  /**
   * Verifica si un nodo coincide con el filtro de tipo actual
   */
  matchesTypeFilter(typification) {
    if (!this.selectedType)
      return true;
    return typification.tipoClasificacion === this.selectedType;
  }
  /**
   * Verifica si un nodo o alguno de sus descendientes coincide con el filtro
   */
  nodeOrChildrenMatch(node) {
    if (!this.selectedType)
      return true;
    if (this.matchesTypeFilter(node.typification))
      return true;
    return node.children.some((child) => this.nodeOrChildrenMatch(child));
  }
  /**
   * Obtiene la ruta breadcrumb del padre
   */
  getParentBreadcrumb(node) {
    const breadcrumbs = [];
    let current = node;
    const findParent = (nodes, targetId) => {
      for (const n of nodes) {
        if (n.children.some((c) => c.typification.id === targetId)) {
          return n;
        }
        const found = findParent(n.children, targetId);
        if (found)
          return found;
      }
      return null;
    };
    const parentId = current.typification.parentTypificationId || current.typification.tipificacionPadre?.id;
    if (parentId) {
      const parent = findParent(this.treeNodes, current.typification.id);
      if (parent) {
        const buildPath = (n) => {
          const path = [];
          const pid = n.typification.parentTypificationId || n.typification.tipificacionPadre?.id;
          if (pid) {
            const p = findParent(this.treeNodes, n.typification.id);
            if (p) {
              path.push(...buildPath(p));
            }
          }
          path.push(this.getEffectiveValue(n.config, n.typification, "nombre"));
          return path;
        };
        return buildPath(parent).join(" > ");
      }
    }
    return "";
  }
  /**
   * Obtiene nodos filtrados (solo los que coinciden con el tipo)
   */
  getFilteredNodes(nodes) {
    if (!this.selectedType)
      return nodes;
    const filtered = [];
    const collectMatching = (nodeList) => {
      for (const node of nodeList) {
        if (this.matchesTypeFilter(node.typification)) {
          filtered.push(node);
        }
        if (node.children.length > 0) {
          collectMatching(node.children);
        }
      }
    };
    collectMatching(nodes);
    return filtered;
  }
};
_TypificationMaintenanceComponent.\u0275fac = function TypificationMaintenanceComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TypificationMaintenanceComponent)(\u0275\u0275directiveInject(TypificationV2Service), \u0275\u0275directiveInject(ThemeService));
};
_TypificationMaintenanceComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TypificationMaintenanceComponent, selectors: [["app-typification-maintenance"]], decls: 52, vars: 14, consts: [["treeNodeTemplate", ""], ["flatNodeTemplate", ""], [1, "h-[100dvh]", "bg-gradient-to-br", "from-slate-50", "via-blue-50", "to-slate-100", "dark:from-slate-950", "dark:via-gray-950", "dark:to-black", "flex", "flex-col", "overflow-hidden", "transition-colors", "duration-300"], [1, "fixed", "top-4", "right-4", "z-50", "animate-[slideInRight_0.5s_ease-out]"], [1, "bg-gradient-to-r", "from-slate-900", "via-blue-900", "to-slate-900", "dark:from-slate-950", "dark:via-blue-950", "dark:to-slate-950", "text-white", "shadow-md", "relative", "overflow-hidden"], [1, "relative", "px-3", "py-1"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-3"], [1, "flex", "items-center", "gap-1.5"], [1, "bg-blue-500", "dark:bg-blue-600", "p-1", "rounded"], [1, "text-sm", "font-bold"], [1, "text-[9px]", "text-blue-200", "dark:text-blue-300", "flex", "items-center", "gap-0.5"], [1, "flex", "items-center", "gap-2"], ["title", "Cambiar tema", 3, "click"], [1, "text-[10px]", "text-yellow-300", "font-semibold"], [1, "text-[10px]", "text-white", "font-semibold"], [1, "bg-white", "dark:bg-slate-900", "border-b", "border-blue-400", "dark:border-slate-700", "shadow-sm", "relative", "overflow-hidden", "transition-colors", "duration-300"], [1, "absolute", "inset-0", "bg-gradient-to-r", "from-blue-50", "dark:from-blue-950/50", "to-transparent", "opacity-50"], [1, "flex", "items-center", "gap-3", "text-xs"], [1, "text-[9px]", "text-gray-500", "dark:text-white", "uppercase", "font-semibold"], [1, "text-xs", "font-semibold", "text-gray-800", "dark:text-white", "bg-transparent", "border-none", "focus:outline-none", "cursor-pointer", 3, "ngModelChange", "change", "ngModel"], [1, "bg-white", "dark:bg-slate-800", 3, "ngValue"], ["class", "bg-white dark:bg-slate-800", 3, "ngValue", 4, "ngFor", "ngForOf"], [1, "flex", "gap-2"], [1, "px-3", "py-1", "text-[10px]", "bg-purple-600", "hover:bg-purple-700", "text-white", "rounded", "font-semibold", "transition-colors", "flex", "items-center", "gap-1", 3, "click"], [1, "text-sm"], [1, "px-3", "py-1", "text-[10px]", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded", "font-semibold", "transition-colors", "flex", "items-center", "gap-1", 3, "click"], [1, "px-2", "py-1", "text-[10px]", "text-slate-600", "dark:text-slate-300", "hover:text-blue-600", "dark:hover:text-blue-400", "hover:bg-blue-50", "dark:hover:bg-blue-950/30", "rounded", "transition-colors", "font-semibold", 3, "click"], [3, "mode", "typification", "parentClassification", "defaultType", "tenantId", "portfolioId"], [3, "typifications"], [3, "isOpen", "typificationName", "typificationId", "tenantId", "portfolioId", "subPortfolioId"], [1, "flex-1", "flex", "items-center", "justify-center"], [1, "flex-1", "overflow-auto", "p-2"], [1, "bg-gradient-to-r", "from-green-500", "to-emerald-600", "text-white", "px-6", "py-4", "rounded-lg", "shadow-2xl", "flex", "items-center", "gap-3"], [1, "font-bold"], [1, "text-sm", "opacity-90"], [1, "h-6", "w-px", "bg-gray-200", "dark:bg-gray-700"], [1, "font-semibold", "text-gray-800", "dark:text-white", "text-[10px]", "bg-transparent", "border-none", "focus:outline-none", "cursor-pointer", 3, "ngModelChange", "change", "ngModel"], [3, "save", "cancel", "mode", "typification", "parentClassification", "defaultType", "tenantId", "portfolioId"], [3, "save", "cancel", "typifications"], [3, "save", "close", "isOpen", "typificationName", "typificationId", "tenantId", "portfolioId", "subPortfolioId"], [1, "text-center"], [1, "inline-block", "animate-spin", "rounded-full", "h-12", "w-12", "border-4", "border-blue-500", "border-t-transparent"], [1, "mt-4", "text-slate-600", "dark:text-slate-300", "font-semibold"], [1, "typification-tree-container", "bg-white", "dark:bg-slate-900", "rounded-lg", "shadow-md", "p-2", "transition-colors", "duration-300", "border", "border-slate-200", "dark:border-slate-800"], [1, "text-center", "py-20"], [1, "text-slate-500", "dark:text-slate-400", "text-lg", "font-semibold", "mb-2"], [1, "text-slate-400", "dark:text-slate-500", "text-sm", "mb-6"], [1, "space-y-1"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "typification-item-wrapper"], [1, "typification-item", "flex", "items-center", "justify-between", "px-2", "rounded", "border-l-3", "mb-1", "transition-all", "duration-300", 3, "py-1", "py-0", "opacity-40", "scale-95", "bg-green-50", "dark:bg-green-950/40", "hover:bg-green-100", "dark:hover:bg-green-900/50", "bg-slate-100", "dark:bg-slate-800/50", "hover:bg-slate-200", "dark:hover:bg-slate-700/50", "bg-gray-50", "dark:bg-gray-900/20", "border-l-green-500", "dark:border-l-green-600", "border-l-slate-400", "dark:border-l-slate-600", "border-l-gray-300", "dark:border-l-gray-700", "ring-2", "ring-purple-400", "dark:ring-purple-600"], [1, "bg-purple-50", "dark:bg-purple-950/40", "border-2", "border-purple-400", "dark:border-purple-600", "rounded-lg", "p-3", "mb-2", "shadow-lg"], [1, "mt-1", "space-y-1"], [1, "typification-item", "flex", "items-center", "justify-between", "px-2", "rounded", "border-l-3", "mb-1", "transition-all", "duration-300"], [1, "flex", "items-center", "gap-2", "flex-1", "min-w-0"], [1, "flex-shrink-0", "w-5", "h-5", "flex", "items-center", "justify-center", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded", "transition-colors"], [1, "w-5", "flex-shrink-0"], [1, "flex-shrink-0", "rounded", "flex", "items-center", "justify-center", "text-white", "font-bold", "shadow-sm", "transition-all"], [3, "name", "size"], [1, "flex-1", "min-w-0"], [1, "font-semibold", "truncate", "transition-all"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "truncate"], [1, "flex-shrink-0", "px-2", "py-0.5", "bg-blue-100", "dark:bg-blue-900/40", "text-blue-700", "dark:text-blue-300", "rounded", "font-bold", "transition-all"], [1, "flex", "items-center", "gap-1.5", "ml-2", "flex-shrink-0"], [1, "flex-shrink-0", "w-5", "h-5", "flex", "items-center", "justify-center", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded", "transition-colors", 3, "click"], [1, "ml-1", "px-1", "py-0.5", "bg-purple-100", "dark:bg-purple-900/40", "text-purple-700", "dark:text-purple-300", "rounded", "text-[9px]", "font-bold"], [1, "relative", "inline-flex", "items-center", "cursor-pointer", 3, "click", "title"], ["type", "checkbox", 1, "sr-only", "peer", 3, "change", "checked"], [1, "w-9", "h-5", "bg-gray-300", "dark:bg-gray-600", "peer-focus:outline-none", "peer-focus:ring-2", "peer-focus:ring-blue-500", "rounded-full", "peer", "peer-checked:after:translate-x-full", "peer-checked:after:border-white", "after:content-['']", "after:absolute", "after:top-[2px]", "after:left-[2px]", "after:bg-white", "after:border-gray-300", "after:border", "after:rounded-full", "after:h-4", "after:w-4", "after:transition-all", "peer-checked:bg-green-500"], ["title", "Personalizar para esta cartera", 1, "px-2", "py-1", "text-[10px]", "bg-purple-600", "hover:bg-purple-700", "text-white", "rounded", "font-semibold", "transition-colors", 3, "click"], ["title", "Resetear a valores del cat\xE1logo", 1, "w-6", "h-6", "flex", "items-center", "justify-center", "text-orange-600", "dark:text-orange-400", "hover:bg-orange-100", "dark:hover:bg-orange-900/30", "rounded", "transition-colors"], ["title", "Agregar hijo", 1, "w-6", "h-6", "flex", "items-center", "justify-center", "text-green-600", "dark:text-green-400", "hover:bg-green-100", "dark:hover:bg-green-900/30", "rounded", "transition-colors", 3, "click"], ["name", "plus-circle", 3, "size"], ["title", "Configurar Campos Adicionales", 1, "w-6", "h-6", "flex", "items-center", "justify-center", "text-purple-600", "dark:text-purple-400", "hover:bg-purple-100", "dark:hover:bg-purple-900/30", "rounded", "transition-colors", 3, "click"], ["name", "settings", 3, "size"], ["title", "Editar cat\xE1logo global", 1, "w-6", "h-6", "flex", "items-center", "justify-center", "text-blue-600", "dark:text-blue-400", "hover:bg-blue-100", "dark:hover:bg-blue-900/30", "rounded", "transition-colors", 3, "click"], ["name", "edit-2", 3, "size"], ["title", "Eliminar", 1, "w-6", "h-6", "flex", "items-center", "justify-center", "text-red-600", "dark:text-red-400", "hover:bg-red-100", "dark:hover:bg-red-900/30", "rounded", "transition-colors", "disabled:hover:bg-transparent", 3, "click", "disabled"], ["name", "trash-2", 3, "size"], ["title", "Resetear a valores del cat\xE1logo", 1, "w-6", "h-6", "flex", "items-center", "justify-center", "text-orange-600", "dark:text-orange-400", "hover:bg-orange-100", "dark:hover:bg-orange-900/30", "rounded", "transition-colors", 3, "click"], ["name", "corner-up-left", 3, "size"], [1, "flex", "items-start", "gap-3"], [1, "flex-shrink-0"], [1, "block", "text-[10px]", "font-bold", "text-gray-700", "dark:text-gray-200", "mb-1"], [1, "flex", "gap-1", "flex-wrap", "max-w-[120px]"], ["type", "button", 3, "class", "background-color", "title"], [1, "flex-1", "space-y-2"], ["type", "text", "placeholder", "Nombre", 1, "w-full", "px-2", "py-1", "text-sm", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-2", "focus:ring-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel"], ["rows", "2", "placeholder", "Descripci\xF3n", 1, "w-full", "px-2", "py-1", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-2", "focus:ring-purple-500", "resize-none", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "0", "step", "10", 1, "w-24", "px-2", "py-1", "text-sm", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-2", "focus:ring-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel"], [1, "flex-shrink-0", "flex", "flex-col", "gap-1"], [1, "px-3", "py-1.5", "bg-green-600", "hover:bg-green-700", "disabled:bg-gray-400", "text-white", "rounded", "font-semibold", "text-xs", "transition-colors", "flex", "items-center", "gap-1", 3, "click", "disabled"], [1, "w-3", "h-3", "border-2", "border-white", "border-t-transparent", "rounded-full", "animate-spin"], [1, "px-3", "py-1.5", "bg-gray-600", "hover:bg-gray-700", "disabled:bg-gray-400", "text-white", "rounded", "font-semibold", "text-xs", "transition-colors", 3, "click", "disabled"], ["type", "button", 3, "click", "title"], [1, "typification-item", "flex", "items-center", "justify-between", "px-3", "py-2", "rounded", "border-l-3", "mb-1", "transition-all", "duration-300", 3, "bg-green-50", "dark:bg-green-950/40", "hover:bg-green-100", "dark:hover:bg-green-900/50", "bg-slate-100", "dark:bg-slate-800/50", "hover:bg-slate-200", "dark:hover:bg-slate-700/50", "border-l-green-500", "dark:border-l-green-600", "border-l-slate-400", "dark:border-l-slate-600", "ring-2", "ring-purple-400", "dark:ring-purple-600"], [1, "typification-item", "flex", "items-center", "justify-between", "px-3", "py-2", "rounded", "border-l-3", "mb-1", "transition-all", "duration-300"], [1, "flex", "items-center", "gap-3", "flex-1", "min-w-0"], [1, "flex-shrink-0", "w-10", "h-10", "rounded", "flex", "items-center", "justify-center", "text-white", "text-sm", "font-bold", "shadow-sm"], [1, "text-[10px]", "text-gray-500", "dark:text-gray-400", "truncate", "mb-0.5"], [1, "font-semibold", "text-slate-800", "dark:text-slate-100", "text-base", "truncate"], [1, "inline-block", "mt-0.5", "px-1.5", "py-0.5", "bg-purple-100", "dark:bg-purple-900/40", "text-purple-700", "dark:text-purple-300", "rounded", "text-[9px]", "font-bold"], [1, "flex-shrink-0", "px-2", "py-1", "bg-blue-100", "dark:bg-blue-900/40", "text-blue-700", "dark:text-blue-300", "rounded", "text-xs", "font-bold"], [1, "flex", "items-center", "gap-1.5", "ml-3", "flex-shrink-0"]], template: function TypificationMaintenanceComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275conditionalCreate(1, TypificationMaintenanceComponent_Conditional_1_Template, 7, 0, "div", 3);
    \u0275\u0275elementStart(2, "div", 4)(3, "div", 5)(4, "div", 6)(5, "div", 7)(6, "div")(7, "div", 8);
    \u0275\u0275element(8, "div", 9);
    \u0275\u0275elementStart(9, "div")(10, "h1", 10);
    \u0275\u0275text(11, "Mantenimiento de Tipificaciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p", 11);
    \u0275\u0275text(13, " Configuraci\xF3n de clasificaciones ");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(14, "div", 12)(15, "button", 13);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.toggleDarkMode());
    });
    \u0275\u0275conditionalCreate(16, TypificationMaintenanceComponent_Conditional_16_Template, 2, 0, "span", 14)(17, TypificationMaintenanceComponent_Conditional_17_Template, 2, 0, "span", 15);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(18, "div", 16);
    \u0275\u0275element(19, "div", 17);
    \u0275\u0275elementStart(20, "div", 5)(21, "div", 6)(22, "div", 18);
    \u0275\u0275conditionalCreate(23, TypificationMaintenanceComponent_Conditional_23_Template, 6, 2);
    \u0275\u0275conditionalCreate(24, TypificationMaintenanceComponent_Conditional_24_Template, 8, 3);
    \u0275\u0275elementStart(25, "div")(26, "div", 19);
    \u0275\u0275text(27, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "select", 20);
    \u0275\u0275twoWayListener("ngModelChange", function TypificationMaintenanceComponent_Template_select_ngModelChange_28_listener($event) {
      \u0275\u0275restoreView(_r1);
      \u0275\u0275twoWayBindingSet(ctx.selectedType, $event) || (ctx.selectedType = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function TypificationMaintenanceComponent_Template_select_change_28_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.onTypeChange());
    });
    \u0275\u0275elementStart(29, "option", 21);
    \u0275\u0275text(30, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275template(31, TypificationMaintenanceComponent_option_31_Template, 2, 2, "option", 22);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "div", 23)(33, "button", 24);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_Template_button_click_33_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.openCreateCategoryDialog());
    });
    \u0275\u0275elementStart(34, "span", 25);
    \u0275\u0275text(35, "+");
    \u0275\u0275elementEnd();
    \u0275\u0275text(36, " Nueva Categor\xEDa ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "button", 26);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.openCreateRootDialog());
    });
    \u0275\u0275text(38, " Nueva Tipificaci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "button", 27);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_Template_button_click_39_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.expandAll());
    });
    \u0275\u0275text(40, " Expandir todo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "button", 27);
    \u0275\u0275listener("click", function TypificationMaintenanceComponent_Template_button_click_41_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.collapseAll());
    });
    \u0275\u0275text(42, " Contraer todo ");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275conditionalCreate(43, TypificationMaintenanceComponent_Conditional_43_Template, 1, 6, "app-typification-form-dialog", 28);
    \u0275\u0275conditionalCreate(44, TypificationMaintenanceComponent_Conditional_44_Template, 1, 1, "app-category-form-dialog", 29);
    \u0275\u0275conditionalCreate(45, TypificationMaintenanceComponent_Conditional_45_Template, 1, 6, "app-typification-additional-fields-dialog", 30);
    \u0275\u0275conditionalCreate(46, TypificationMaintenanceComponent_Conditional_46_Template, 5, 0, "div", 31);
    \u0275\u0275conditionalCreate(47, TypificationMaintenanceComponent_Conditional_47_Template, 4, 1, "div", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275template(48, TypificationMaintenanceComponent_ng_template_48_Template, 4, 5, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(50, TypificationMaintenanceComponent_ng_template_50_Template, 3, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showSuccess() ? 1 : -1);
    \u0275\u0275advance(14);
    \u0275\u0275classMap("flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-300 group border " + (ctx.themeService.isDarkMode() ? "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/40" : "bg-blue-500/90 hover:bg-blue-600 border-blue-600"));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.themeService.isDarkMode() ? 16 : 17);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx.tenants.length > 0 ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.portfolios.length > 0 ? 24 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedType);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", void 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx.classificationTypes);
    \u0275\u0275advance(12);
    \u0275\u0275conditional(ctx.showClassificationDialog() ? 43 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showCategoryDialog() ? 44 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showAdditionalFieldsDialog() ? 45 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.loading() ? 46 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx.loading() ? 47 : -1);
  }
}, dependencies: [CommonModule, NgForOf, NgTemplateOutlet, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, NgModel, LucideAngularModule, LucideAngularComponent, TypificationFormDialogComponent, CategoryFormDialogComponent, TypificationAdditionalFieldsDialogComponent], styles: ["\n\n.classification-item[_ngcontent-%COMP%] {\n  transition: transform 0.15s ease, box-shadow 0.15s ease;\n  position: relative;\n}\n.classification-item[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);\n}\n.dark[_nghost-%COMP%]   .classification-item[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .classification-item[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n/*# sourceMappingURL=typification-maintenance.component.css.map */"] });
var TypificationMaintenanceComponent = _TypificationMaintenanceComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TypificationMaintenanceComponent, [{
    type: Component,
    args: [{ selector: "app-typification-maintenance", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule, TypificationFormDialogComponent, CategoryFormDialogComponent, TypificationAdditionalFieldsDialogComponent], template: `<div class="h-[100dvh] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-black flex flex-col overflow-hidden transition-colors duration-300">\r
\r
  <!-- Notificaci\xF3n de \xE9xito -->\r
  @if (showSuccess()) {\r
    <div class="fixed top-4 right-4 z-50 animate-[slideInRight_0.5s_ease-out]">\r
      <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">\r
        \r
        <div>\r
          <div class="font-bold">\xA1Cambio Guardado!</div>\r
          <div class="text-sm opacity-90">La configuraci\xF3n se actualiz\xF3 correctamente</div>\r
        </div>\r
      </div>\r
    </div>\r
  }\r
\r
  <!-- Header Principal - ULTRA COMPACTO como gesti\xF3n -->\r
  <div class="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white shadow-md relative overflow-hidden">\r
    <div class="relative px-3 py-1">\r
      <div class="flex items-center justify-between">\r
        <div class="flex items-center gap-3">\r
          <div>\r
            <div class="flex items-center gap-1.5">\r
              <div class="bg-blue-500 dark:bg-blue-600 p-1 rounded">\r
                \r
              </div>\r
              <div>\r
                <h1 class="text-sm font-bold">Mantenimiento de Tipificaciones</h1>\r
                <p class="text-[9px] text-blue-200 dark:text-blue-300 flex items-center gap-0.5">\r
                  \r
                  Configuraci\xF3n de clasificaciones\r
                </p>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
\r
        <div class="flex items-center gap-2">\r
          <!-- Bot\xF3n de Dark Mode -->\r
          <button\r
            (click)="toggleDarkMode()"\r
            [class]="'flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-300 group border ' +\r
              (themeService.isDarkMode()\r
                ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/40'\r
                : 'bg-blue-500/90 hover:bg-blue-600 border-blue-600')"\r
            title="Cambiar tema">\r
            @if (themeService.isDarkMode()) {\r
              \r
              <span class="text-[10px] text-yellow-300 font-semibold">OSCURO</span>\r
            } @else {\r
              \r
              <span class="text-[10px] text-white font-semibold">CLARO</span>\r
            }\r
          </button>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Barra de Info / Filters -->\r
  <div class="bg-white dark:bg-slate-900 border-b border-blue-400 dark:border-slate-700 shadow-sm relative overflow-hidden transition-colors duration-300">\r
    <div class="absolute inset-0 bg-gradient-to-r from-blue-50 dark:from-blue-950/50 to-transparent opacity-50"></div>\r
    <div class="relative px-3 py-1">\r
      <div class="flex items-center justify-between">\r
        <div class="flex items-center gap-3 text-xs">\r
          <!-- Tenant/Client Filter - Solo si hay tenants -->\r
          @if (tenants.length > 0) {\r
            <div>\r
              <div class="text-[9px] text-gray-500 dark:text-white uppercase font-semibold">Cliente</div>\r
              <select\r
                [(ngModel)]="selectedTenantId"\r
                (change)="onTenantChange()"\r
                class="text-xs font-semibold text-gray-800 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer">\r
                <option *ngFor="let tenant of tenants" [ngValue]="tenant.id" class="bg-white dark:bg-slate-800">\r
                  {{ tenant.tenantName }}\r
                </option>\r
              </select>\r
            </div>\r
\r
            <div class="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>\r
          }\r
\r
          <!-- Portfolio Filter - Solo si hay portfolios -->\r
          @if (portfolios.length > 0) {\r
            <div>\r
              <div class="text-[9px] text-gray-500 dark:text-white uppercase font-semibold">Cartera</div>\r
              <select\r
                [(ngModel)]="selectedPortfolioId"\r
                (change)="onPortfolioChange()"\r
                class="font-semibold text-gray-800 dark:text-white text-[10px] bg-transparent border-none focus:outline-none cursor-pointer">\r
                <option [ngValue]="undefined" class="bg-white dark:bg-slate-800">Todas las Carteras</option>\r
                <option *ngFor="let portfolio of portfolios" [ngValue]="portfolio.id" class="bg-white dark:bg-slate-800">\r
                  {{ portfolio.portfolioName }}\r
                </option>\r
              </select>\r
            </div>\r
\r
            <div class="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>\r
          }\r
\r
          <!-- Type Filter -->\r
          <div>\r
            <div class="text-[9px] text-gray-500 dark:text-white uppercase font-semibold">Tipo</div>\r
            <select\r
              [(ngModel)]="selectedType"\r
              (change)="onTypeChange()"\r
              class="text-xs font-semibold text-gray-800 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer">\r
              <option [ngValue]="undefined" class="bg-white dark:bg-slate-800">Todos</option>\r
              <option *ngFor="let type of classificationTypes" [ngValue]="type" class="bg-white dark:bg-slate-800">\r
                {{ getTypeLabel(type) }}\r
              </option>\r
            </select>\r
          </div>\r
        </div>\r
\r
        <!-- Actions -->\r
        <div class="flex gap-2">\r
          <button\r
            (click)="openCreateCategoryDialog()"\r
            class="px-3 py-1 text-[10px] bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition-colors flex items-center gap-1">\r
            <span class="text-sm">+</span>\r
            Nueva Categor\xEDa\r
          </button>\r
          <button\r
            (click)="openCreateRootDialog()"\r
            class="px-3 py-1 text-[10px] bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors flex items-center gap-1">\r
            \r
            Nueva Tipificaci\xF3n\r
          </button>\r
          <button\r
            (click)="expandAll()"\r
            class="px-2 py-1 text-[10px] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded transition-colors font-semibold">\r
            Expandir todo\r
          </button>\r
          <button\r
            (click)="collapseAll()"\r
            class="px-2 py-1 text-[10px] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded transition-colors font-semibold">\r
            Contraer todo\r
          </button>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Classification Form Dialog -->\r
  @if (showClassificationDialog()) {\r
    <app-typification-form-dialog\r
      [mode]="classificationDialogMode()"\r
      [typification]="selectedClassificationForEdit()"\r
      [parentClassification]="parentClassificationForCreate()"\r
      [defaultType]="selectedType"\r
      [tenantId]="selectedTenantId"\r
      [portfolioId]="selectedPortfolioId"\r
      (save)="onClassificationSaved($event)"\r
      (cancel)="closeClassificationDialog()">\r
    </app-typification-form-dialog>\r
  }\r
\r
  <!-- Category Dialog -->\r
  @if (showCategoryDialog()) {\r
    <app-category-form-dialog\r
      [typifications]="typifications"\r
      (save)="onCategorySaved($event)"\r
      (cancel)="closeCategoryDialog()">\r
    </app-category-form-dialog>\r
  }\r
\r
  <!-- Additional Fields Dialog -->\r
  @if (showAdditionalFieldsDialog()) {\r
    <app-typification-additional-fields-dialog\r
      [isOpen]="showAdditionalFieldsDialog()"\r
      [typificationName]="selectedTypificationForFields()?.nombre || ''"\r
      [typificationId]="selectedTypificationForFields()?.id!"\r
      [tenantId]="selectedTenantId!"\r
      [portfolioId]="selectedPortfolioId"\r
      [subPortfolioId]="undefined"\r
      (save)="onAdditionalFieldsSaved()"\r
      (close)="closeAdditionalFieldsDialog()">\r
    </app-typification-additional-fields-dialog>\r
  }\r
\r
  <!-- Loading State -->\r
  @if (loading()) {\r
    <div class="flex-1 flex items-center justify-center">\r
      <div class="text-center">\r
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>\r
        <p class="mt-4 text-slate-600 dark:text-slate-300 font-semibold">Cargando tipificaciones...</p>\r
      </div>\r
    </div>\r
  }\r
\r
  <!-- Tree View -->\r
  @if (!loading()) {\r
    <div class="flex-1 overflow-auto p-2">\r
      <div class="typification-tree-container bg-white dark:bg-slate-900 rounded-lg shadow-md p-2 transition-colors duration-300 border border-slate-200 dark:border-slate-800">\r
        @if (treeNodes.length === 0) {\r
          <!-- Empty State -->\r
          <div class="text-center py-20">\r
            \r
            <p class="text-slate-500 dark:text-slate-400 text-lg font-semibold mb-2">No hay tipificaciones configuradas</p>\r
            <p class="text-slate-400 dark:text-slate-500 text-sm mb-6">Comienza creando tu primera tipificaci\xF3n</p>\r
          </div>\r
        } @else {\r
          <!-- Tree Nodes -->\r
          @if (!selectedType) {\r
            <!-- Vista completa con jerarqu\xEDa (sin filtro) -->\r
            <div class="space-y-1">\r
              @for (node of treeNodes; track node.typification.id; let idx = $index) {\r
                <ng-container [ngTemplateOutlet]="treeNodeTemplate" [ngTemplateOutletContext]="{node: node, depth: 0, index: idx, siblings: treeNodes, parent: null}"></ng-container>\r
              }\r
            </div>\r
          } @else {\r
            <!-- Vista filtrada plana (con breadcrumb) -->\r
            <div class="space-y-1">\r
              @for (node of getFilteredNodes(treeNodes); track node.typification.id) {\r
                <ng-container [ngTemplateOutlet]="flatNodeTemplate" [ngTemplateOutletContext]="{node: node}"></ng-container>\r
              }\r
            </div>\r
          }\r
        }\r
      </div>\r
    </div>\r
  }\r
</div>\r
\r
<!-- Tree Node Template (Recursive) -->\r
<ng-template #treeNodeTemplate let-node="node" let-depth="depth" let-index="index" let-siblings="siblings" let-parent="parent">\r
  <div class="typification-item-wrapper" [style.margin-left.px]="depth * 16">\r
\r
    <!-- MODO NORMAL (No editando) -->\r
    @if (!isEditing(node.config?.id)) {\r
      <div\r
        class="typification-item flex items-center justify-between px-2 rounded border-l-3 mb-1 transition-all duration-300"\r
        [class.py-1.5]="matchesTypeFilter(node.typification)"\r
        [class.py-0.5]="!matchesTypeFilter(node.typification)"\r
        [class.opacity-40]="!matchesTypeFilter(node.typification)"\r
        [class.scale-95]="!matchesTypeFilter(node.typification)"\r
        [class.bg-green-50]="node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.dark:bg-green-950/40]="node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.hover:bg-green-100]="node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.dark:hover:bg-green-900/50]="node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.bg-slate-100]="!node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.dark:bg-slate-800/50]="!node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.hover:bg-slate-200]="!node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.dark:hover:bg-slate-700/50]="!node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.bg-gray-50]="!matchesTypeFilter(node.typification)"\r
        [class.dark:bg-gray-900/20]="!matchesTypeFilter(node.typification)"\r
        [class.border-l-green-500]="node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.dark:border-l-green-600]="node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.border-l-slate-400]="!node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.dark:border-l-slate-600]="!node.config?.estaHabilitada && matchesTypeFilter(node.typification)"\r
        [class.border-l-gray-300]="!matchesTypeFilter(node.typification)"\r
        [class.dark:border-l-gray-700]="!matchesTypeFilter(node.typification)"\r
        [class.ring-2]="hasCustomizations(node.config) && matchesTypeFilter(node.typification)"\r
        [class.ring-purple-400]="hasCustomizations(node.config) && matchesTypeFilter(node.typification)"\r
        [class.dark:ring-purple-600]="hasCustomizations(node.config) && matchesTypeFilter(node.typification)">\r
\r
        <div class="flex items-center gap-2 flex-1 min-w-0">\r
          <!-- Expand/Collapse Button -->\r
          @if (node.children && node.children.length > 0) {\r
            <button\r
              (click)="toggleNode(node.typification.id); $event.stopPropagation()"\r
              class="flex-shrink-0 w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">\r
              @if (isExpanded(node.typification.id)) {\r
\r
              } @else {\r
\r
              }\r
            </button>\r
          } @else {\r
            <div class="w-5 flex-shrink-0"></div>\r
          }\r
\r
          <!-- Icon con color -->\r
          <div\r
            class="flex-shrink-0 rounded flex items-center justify-center text-white font-bold shadow-sm transition-all"\r
            [class.w-8]="matchesTypeFilter(node.typification)"\r
            [class.h-8]="matchesTypeFilter(node.typification)"\r
            [class.text-xs]="matchesTypeFilter(node.typification)"\r
            [class.w-6]="!matchesTypeFilter(node.typification)"\r
            [class.h-6]="!matchesTypeFilter(node.typification)"\r
            [class.text-[9px]]="!matchesTypeFilter(node.typification)"\r
            [style.background-color]="getEffectiveValue(node.config, node.typification, 'color') || '#6B7280'">\r
            @if (getEffectiveValue(node.config, node.typification, 'icono')) {\r
              <lucide-angular\r
                [name]="getEffectiveValue(node.config, node.typification, 'icono')"\r
                [size]="matchesTypeFilter(node.typification) ? 18 : 14">\r
              </lucide-angular>\r
            } @else {\r
              {{ node.typification.codigo?.substring(0, 2) || 'NA' }}\r
            }\r
          </div>\r
\r
          <!-- Name and Type -->\r
          <div class="flex-1 min-w-0">\r
            <div class="font-semibold truncate transition-all"\r
                 [class.text-sm]="matchesTypeFilter(node.typification)"\r
                 [class.text-slate-800]="matchesTypeFilter(node.typification)"\r
                 [class.dark:text-slate-100]="matchesTypeFilter(node.typification)"\r
                 [class.text-xs]="!matchesTypeFilter(node.typification)"\r
                 [class.text-gray-500]="!matchesTypeFilter(node.typification)"\r
                 [class.dark:text-gray-500]="!matchesTypeFilter(node.typification)">\r
              {{ getEffectiveValue(node.config, node.typification, 'nombre') }}\r
            </div>\r
            @if (matchesTypeFilter(node.typification)) {\r
              <div class="text-[10px] text-slate-500 dark:text-slate-400 truncate">\r
                {{ getTypeLabel(node.typification.tipoClasificacion) }}\r
                @if (hasCustomizations(node.config)) {\r
                  <span class="ml-1 px-1 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded text-[9px] font-bold">PERSONALIZADO</span>\r
                }\r
              </div>\r
            }\r
          </div>\r
\r
          <!-- Level Badge -->\r
          <div class="flex-shrink-0 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded font-bold transition-all"\r
               [class.text-[10px]]="matchesTypeFilter(node.typification)"\r
               [class.text-[8px]]="!matchesTypeFilter(node.typification)">\r
            N{{ node.level }}\r
          </div>\r
        </div>\r
\r
        <!-- Actions -->\r
        @if (matchesTypeFilter(node.typification)) {\r
          <div class="flex items-center gap-1.5 ml-2 flex-shrink-0">\r
            <!-- Enable/Disable Toggle -->\r
            <label class="relative inline-flex items-center cursor-pointer"\r
                   (click)="$event.stopPropagation()"\r
                   [title]="node.config?.estaHabilitada ? 'Desactivar' : 'Activar'">\r
              <input\r
                type="checkbox"\r
                [checked]="node.config?.estaHabilitada === true"\r
                (change)="toggleTypification(node, $event); $event.stopPropagation()"\r
                class="sr-only peer">\r
              <div class="w-9 h-5 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>\r
            </label>\r
\r
            <!-- Personalizar Button -->\r
            <button\r
              (click)="startEdit(node, $event)"\r
              title="Personalizar para esta cartera"\r
              class="px-2 py-1 text-[10px] bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition-colors">\r
              EDITAR\r
            </button>\r
\r
            @if (hasCustomizations(node.config)) {\r
              <button\r
                (click)="resetCustomization(node, $event)"\r
                title="Resetear a valores del cat\xE1logo"\r
                class="w-6 h-6 flex items-center justify-center text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded transition-colors">\r
                <lucide-angular name="corner-up-left" [size]="14"></lucide-angular>\r
              </button>\r
            }\r
\r
            <button\r
              (click)="openCreateChildDialog(node.typification); $event.stopPropagation()"\r
              title="Agregar hijo"\r
              class="w-6 h-6 flex items-center justify-center text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors">\r
              <lucide-angular name="plus-circle" [size]="14"></lucide-angular>\r
            </button>\r
\r
            <button\r
              (click)="openAdditionalFieldsDialog(node.typification); $event.stopPropagation()"\r
              title="Configurar Campos Adicionales"\r
              class="w-6 h-6 flex items-center justify-center text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded transition-colors">\r
              <lucide-angular name="settings" [size]="14"></lucide-angular>\r
            </button>\r
\r
            <button\r
              (click)="openEditDialog(node.typification); $event.stopPropagation()"\r
              title="Editar cat\xE1logo global"\r
              class="w-6 h-6 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors">\r
              <lucide-angular name="edit-2" [size]="14"></lucide-angular>\r
            </button>\r
\r
            <button\r
              (click)="deleteTypification(node.typification); $event.stopPropagation()"\r
              title="Eliminar"\r
              [disabled]="node.typification.esSistema"\r
              [class.opacity-30]="node.typification.esSistema"\r
              [class.cursor-not-allowed]="node.typification.esSistema"\r
              class="w-6 h-6 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors disabled:hover:bg-transparent">\r
              <lucide-angular name="trash-2" [size]="14"></lucide-angular>\r
            </button>\r
          </div>\r
        }\r
      </div>\r
    }\r
\r
    <!-- MODO EDICI\xD3N INLINE -->\r
    @if (isEditing(node.config?.id) && editingForm()) {\r
      <div class="bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-400 dark:border-purple-600 rounded-lg p-3 mb-2 shadow-lg">\r
        <div class="flex items-start gap-3">\r
          <!-- Color Picker -->\r
          <div class="flex-shrink-0">\r
            <label class="block text-[10px] font-bold text-gray-700 dark:text-gray-200 mb-1">Color</label>\r
            <div class="flex gap-1 flex-wrap max-w-[120px]">\r
              @for (color of presetColors; track color.hex) {\r
                <button\r
                  type="button"\r
                  (click)="editingForm()!.colorPersonalizado = color.hex"\r
                  [class]="'w-6 h-6 rounded border-2 transition-all ' +\r
                           (editingForm()!.colorPersonalizado === color.hex ? 'border-gray-900 dark:border-white ring-2 ring-purple-500' : 'border-gray-300')"\r
                  [style.background-color]="color.hex"\r
                  [title]="color.name">\r
                </button>\r
              }\r
            </div>\r
          </div>\r
\r
          <!-- Form Fields -->\r
          <div class="flex-1 space-y-2">\r
            <!-- Nombre -->\r
            <div>\r
              <label class="block text-[10px] font-bold text-gray-700 dark:text-gray-200 mb-1">Nombre Personalizado</label>\r
              <input\r
                type="text"\r
                [(ngModel)]="editingForm()!.nombrePersonalizado"\r
                placeholder="Nombre"\r
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100" />\r
            </div>\r
\r
            <!-- Descripci\xF3n -->\r
            <div>\r
              <label class="block text-[10px] font-bold text-gray-700 dark:text-gray-200 mb-1">Descripci\xF3n (Opcional)</label>\r
              <textarea\r
                [(ngModel)]="editingForm()!.descripcionPersonalizada"\r
                rows="2"\r
                placeholder="Descripci\xF3n"\r
                class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">\r
              </textarea>\r
            </div>\r
\r
            <!-- Orden -->\r
            <div>\r
              <label class="block text-[10px] font-bold text-gray-700 dark:text-gray-200 mb-1">Orden</label>\r
              <input\r
                type="number"\r
                [(ngModel)]="editingForm()!.ordenVisualizacionPersonalizado"\r
                min="0"\r
                step="10"\r
                class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100" />\r
            </div>\r
          </div>\r
\r
          <!-- Action Buttons -->\r
          <div class="flex-shrink-0 flex flex-col gap-1">\r
            <button\r
              (click)="saveEdit(node)"\r
              [disabled]="savingEdit()"\r
              class="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded font-semibold text-xs transition-colors flex items-center gap-1">\r
              @if (savingEdit()) {\r
                <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>\r
              }\r
              GUARDAR\r
            </button>\r
            <button\r
              (click)="cancelEdit()"\r
              [disabled]="savingEdit()"\r
              class="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded font-semibold text-xs transition-colors">\r
              CANCELAR\r
            </button>\r
          </div>\r
        </div>\r
      </div>\r
    }\r
\r
    <!-- Children Nodes (Recursive) -->\r
    @if (isExpanded(node.typification.id) && node.children && node.children.length > 0) {\r
      <div class="mt-1 space-y-1">\r
        @for (child of node.children; track child.typification.id; let childIdx = $index) {\r
          <ng-container [ngTemplateOutlet]="treeNodeTemplate" [ngTemplateOutletContext]="{node: child, depth: depth + 1, index: childIdx, siblings: node.children, parent: node}"></ng-container>\r
        }\r
      </div>\r
    }\r
  </div>\r
</ng-template>\r
\r
<!-- Flat Node Template (para vista filtrada con breadcrumb) -->\r
<ng-template #flatNodeTemplate let-node="node">\r
  <div class="typification-item-wrapper">\r
\r
    <!-- MODO NORMAL (No editando) -->\r
    @if (!isEditing(node.config?.id)) {\r
      <div\r
        class="typification-item flex items-center justify-between px-3 py-2 rounded border-l-3 mb-1 transition-all duration-300"\r
        [class.bg-green-50]="node.config?.estaHabilitada"\r
        [class.dark:bg-green-950/40]="node.config?.estaHabilitada"\r
        [class.hover:bg-green-100]="node.config?.estaHabilitada"\r
        [class.dark:hover:bg-green-900/50]="node.config?.estaHabilitada"\r
        [class.bg-slate-100]="!node.config?.estaHabilitada"\r
        [class.dark:bg-slate-800/50]="!node.config?.estaHabilitada"\r
        [class.hover:bg-slate-200]="!node.config?.estaHabilitada"\r
        [class.dark:hover:bg-slate-700/50]="!node.config?.estaHabilitada"\r
        [class.border-l-green-500]="node.config?.estaHabilitada"\r
        [class.dark:border-l-green-600]="node.config?.estaHabilitada"\r
        [class.border-l-slate-400]="!node.config?.estaHabilitada"\r
        [class.dark:border-l-slate-600]="!node.config?.estaHabilitada"\r
        [class.ring-2]="hasCustomizations(node.config)"\r
        [class.ring-purple-400]="hasCustomizations(node.config)"\r
        [class.dark:ring-purple-600]="hasCustomizations(node.config)">\r
\r
        <div class="flex items-center gap-3 flex-1 min-w-0">\r
          <!-- Icon con color -->\r
          <div\r
            class="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center text-white text-sm font-bold shadow-sm"\r
            [style.background-color]="getEffectiveValue(node.config, node.typification, 'color') || '#6B7280'">\r
            @if (getEffectiveValue(node.config, node.typification, 'icono')) {\r
              <lucide-angular\r
                [name]="getEffectiveValue(node.config, node.typification, 'icono')"\r
                [size]="20">\r
              </lucide-angular>\r
            } @else {\r
              {{ node.typification.codigo?.substring(0, 2) || 'NA' }}\r
            }\r
          </div>\r
\r
          <!-- Name with Breadcrumb -->\r
          <div class="flex-1 min-w-0">\r
            <!-- Breadcrumb del padre (si existe) -->\r
            @if (getParentBreadcrumb(node)) {\r
              <div class="text-[10px] text-gray-500 dark:text-gray-400 truncate mb-0.5">\r
                {{ getParentBreadcrumb(node) }}\r
              </div>\r
            }\r
\r
            <!-- Nombre principal -->\r
            <div class="font-semibold text-slate-800 dark:text-slate-100 text-base truncate">\r
              {{ getEffectiveValue(node.config, node.typification, 'nombre') }}\r
            </div>\r
\r
            <!-- Badge de personalizaci\xF3n -->\r
            @if (hasCustomizations(node.config)) {\r
              <span class="inline-block mt-0.5 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded text-[9px] font-bold">PERSONALIZADO</span>\r
            }\r
          </div>\r
\r
          <!-- Level Badge -->\r
          <div class="flex-shrink-0 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-xs font-bold">\r
            N{{ node.level }}\r
          </div>\r
        </div>\r
\r
        <!-- Actions -->\r
        <div class="flex items-center gap-1.5 ml-3 flex-shrink-0">\r
          <!-- Enable/Disable Toggle -->\r
          <label class="relative inline-flex items-center cursor-pointer"\r
                 (click)="$event.stopPropagation()"\r
                 [title]="node.config?.estaHabilitada ? 'Desactivar' : 'Activar'">\r
            <input\r
              type="checkbox"\r
              [checked]="node.config?.estaHabilitada === true"\r
              (change)="toggleTypification(node, $event); $event.stopPropagation()"\r
              class="sr-only peer">\r
            <div class="w-9 h-5 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>\r
          </label>\r
\r
          <!-- Personalizar Button -->\r
          <button\r
            (click)="startEdit(node, $event)"\r
            title="Personalizar para esta cartera"\r
            class="px-2 py-1 text-[10px] bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition-colors">\r
            EDITAR\r
          </button>\r
\r
          @if (hasCustomizations(node.config)) {\r
            <button\r
              (click)="resetCustomization(node, $event)"\r
              title="Resetear a valores del cat\xE1logo"\r
              class="w-6 h-6 flex items-center justify-center text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded transition-colors">\r
              <lucide-angular name="corner-up-left" [size]="14"></lucide-angular>\r
            </button>\r
          }\r
\r
          <button\r
            (click)="openCreateChildDialog(node.typification); $event.stopPropagation()"\r
            title="Agregar hijo"\r
            class="w-6 h-6 flex items-center justify-center text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors">\r
            <lucide-angular name="plus-circle" [size]="14"></lucide-angular>\r
          </button>\r
\r
          <button\r
            (click)="openAdditionalFieldsDialog(node.typification); $event.stopPropagation()"\r
            title="Configurar Campos Adicionales"\r
            class="w-6 h-6 flex items-center justify-center text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded transition-colors">\r
            <lucide-angular name="settings" [size]="14"></lucide-angular>\r
          </button>\r
\r
          <button\r
            (click)="openEditDialog(node.typification); $event.stopPropagation()"\r
            title="Editar cat\xE1logo global"\r
            class="w-6 h-6 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors">\r
            <lucide-angular name="edit-2" [size]="14"></lucide-angular>\r
          </button>\r
\r
          <button\r
            (click)="deleteTypification(node.typification); $event.stopPropagation()"\r
            title="Eliminar"\r
            [disabled]="node.typification.esSistema"\r
            [class.opacity-30]="node.typification.esSistema"\r
            [class.cursor-not-allowed]="node.typification.esSistema"\r
            class="w-6 h-6 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors disabled:hover:bg-transparent">\r
            <lucide-angular name="trash-2" [size]="14"></lucide-angular>\r
          </button>\r
        </div>\r
      </div>\r
    }\r
\r
    <!-- MODO EDICI\xD3N INLINE (mismo que el tree template) -->\r
    @if (isEditing(node.config?.id) && editingForm()) {\r
      <div class="bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-400 dark:border-purple-600 rounded-lg p-3 mb-2 shadow-lg">\r
        <div class="flex items-start gap-3">\r
          <!-- Color Picker -->\r
          <div class="flex-shrink-0">\r
            <label class="block text-[10px] font-bold text-gray-700 dark:text-gray-200 mb-1">Color</label>\r
            <div class="flex gap-1 flex-wrap max-w-[120px]">\r
              @for (color of presetColors; track color.hex) {\r
                <button\r
                  type="button"\r
                  (click)="editingForm()!.colorPersonalizado = color.hex"\r
                  [class]="'w-6 h-6 rounded border-2 transition-all ' +\r
                           (editingForm()!.colorPersonalizado === color.hex ? 'border-gray-900 dark:border-white ring-2 ring-purple-500' : 'border-gray-300')"\r
                  [style.background-color]="color.hex"\r
                  [title]="color.name">\r
                </button>\r
              }\r
            </div>\r
          </div>\r
\r
          <!-- Form Fields -->\r
          <div class="flex-1 space-y-2">\r
            <!-- Nombre -->\r
            <div>\r
              <label class="block text-[10px] font-bold text-gray-700 dark:text-gray-200 mb-1">Nombre Personalizado</label>\r
              <input\r
                type="text"\r
                [(ngModel)]="editingForm()!.nombrePersonalizado"\r
                placeholder="Nombre"\r
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100" />\r
            </div>\r
\r
            <!-- Descripci\xF3n -->\r
            <div>\r
              <label class="block text-[10px] font-bold text-gray-700 dark:text-gray-200 mb-1">Descripci\xF3n (Opcional)</label>\r
              <textarea\r
                [(ngModel)]="editingForm()!.descripcionPersonalizada"\r
                rows="2"\r
                placeholder="Descripci\xF3n"\r
                class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">\r
              </textarea>\r
            </div>\r
\r
            <!-- Orden -->\r
            <div>\r
              <label class="block text-[10px] font-bold text-gray-700 dark:text-gray-200 mb-1">Orden</label>\r
              <input\r
                type="number"\r
                [(ngModel)]="editingForm()!.ordenVisualizacionPersonalizado"\r
                min="0"\r
                step="10"\r
                class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100" />\r
            </div>\r
          </div>\r
\r
          <!-- Action Buttons -->\r
          <div class="flex-shrink-0 flex flex-col gap-1">\r
            <button\r
              (click)="saveEdit(node)"\r
              [disabled]="savingEdit()"\r
              class="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded font-semibold text-xs transition-colors flex items-center gap-1">\r
              @if (savingEdit()) {\r
                <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>\r
              }\r
              GUARDAR\r
            </button>\r
            <button\r
              (click)="cancelEdit()"\r
              [disabled]="savingEdit()"\r
              class="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded font-semibold text-xs transition-colors">\r
              CANCELAR\r
            </button>\r
          </div>\r
        </div>\r
      </div>\r
    }\r
\r
  </div>\r
</ng-template>\r
`, styles: ["/* src/app/maintenance/components/typification-maintenance/typification-maintenance.component.scss */\n.classification-item {\n  transition: transform 0.15s ease, box-shadow 0.15s ease;\n  position: relative;\n}\n.classification-item:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);\n}\n:host-context(.dark) .classification-item:hover {\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n/*# sourceMappingURL=typification-maintenance.component.css.map */\n"] }]
  }], () => [{ type: TypificationV2Service }, { type: ThemeService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TypificationMaintenanceComponent, { className: "TypificationMaintenanceComponent", filePath: "src/app/maintenance/components/typification-maintenance/typification-maintenance.component.ts", lineNumber: 27 });
})();
export {
  TypificationMaintenanceComponent
};
//# sourceMappingURL=chunk-BJNL7XDI.js.map
