/**
 * Modelos V2 para el sistema de mantenimiento de tipificaciones
 * Estos modelos corresponden a las tablas V2 del backend:
 * - catalogo_tipificaciones_v2
 * - configuracion_tenant_tipificacion_v2
 */

export enum ClassificationTypeV2 {
  RESULTADO_CONTACTO = 'RESULTADO_CONTACTO',
  TIPO_GESTION = 'TIPO_GESTION',
  MODALIDAD_PAGO = 'MODALIDAD_PAGO',
  TIPO_FRACCIONAMIENTO = 'TIPO_FRACCIONAMIENTO'
}

export interface TypificationCatalogV2 {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipoClasificacion: ClassificationTypeV2;
  tipificacionPadre?: {
    id: number;
  };
  parentTypificationId?: number; // ID directo del padre (para construir árbol)
  nivelJerarquia: number;
  ordenVisualizacion?: number;
  esEstadoFinal?: boolean;
  requiereObservaciones?: boolean;
  estaActiva: boolean;
  colorSugerido?: string;
  iconoSugerido?: string;
  esSistema: boolean;
  // Opción de la tipificación base de Cashi a la que va esta opción (vale para todas las carteras)
  idTipificacionBase?: number | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaEliminacion?: string;
}

/** Opción de la tipificación base de Cashi: dos niveles iguales para todos los clientes. */
export interface TipificacionBase {
  id: number;
  codigo: string;
  nivel1: string;
  nivel2: string;
  accion?: string | null;
  invalidaTelefono: boolean;
  origen: string;
  orden: number;
}

export interface TenantTypificationConfigV2 {
  id: number;
  idTenant: number;
  idCartera?: number;
  idSubcartera?: number;
  tipificacion: TypificationCatalogV2;
  heredaDePadre?: boolean;
  estaHabilitada: boolean;
  nombrePersonalizado?: string;
  descripcionPersonalizada?: string;
  colorPersonalizado?: string;
  iconoPersonalizado?: string;
  ordenVisualizacionPersonalizado?: number;
  requiereObservacionesPersonalizado?: boolean;
  creadoPor?: number;
  modificadoPor?: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaEliminacion?: string;
  // Computed fields
  nombreEfectivo?: string;
  colorEfectivo?: string;
  iconoEfectivo?: string;
}

export interface CreateTypificationCommandV2 {
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipoClasificacion: ClassificationTypeV2;
  parentTypificationId?: number;  // Nombre que espera el backend (@JsonProperty)
  ordenVisualizacion?: number;
  esEstadoFinal?: boolean;
  requiereObservaciones?: boolean;
  colorSugerido?: string;
  iconoSugerido?: string;
  esSistema?: boolean;
}

export interface UpdateTypificationCommandV2 {
  nombre?: string;
  descripcion?: string;
  ordenVisualizacion?: number;
  esEstadoFinal?: boolean;
  requiereObservaciones?: boolean;
  estaActiva?: boolean;
  colorSugerido?: string;
  iconoSugerido?: string;
}

export interface UpdateTypificationConfigCommandV2 {
  estaHabilitada?: boolean;
  // El backend pisa estos dos con `true` si no llegan: hay que mandar el valor actual.
  heredaDePadre?: boolean;
  nombrePersonalizado?: string;
  descripcionPersonalizada?: string;
  colorPersonalizado?: string;
  iconoPersonalizado?: string;
  ordenVisualizacionPersonalizado?: number;
  requiereObservacionesPersonalizado?: boolean;
}

export interface TypificationTreeNodeV2 {
  typification: TypificationCatalogV2;
  config?: TenantTypificationConfigV2;
  children: TypificationTreeNodeV2[];
  level: number;
}

export enum FieldTypeV2 {
  DATE = 'DATE',
  NUMBER = 'NUMBER',
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  CHIP_SELECT = 'CHIP_SELECT',
  PAYMENT_SCHEDULE = 'PAYMENT_SCHEDULE'
}

export enum FieldDataSourceV2 {
  MANUAL = 'MANUAL',
  DYNAMIC_TABLE = 'DYNAMIC_TABLE'
}

export interface AdditionalFieldV2 {
  id: number;
  nombreCampo: string;
  tipoCampo: FieldTypeV2 | string;  // Backend usa String, no enum
  labelCampo: string;
  esRequerido: boolean;
  ordenVisualizacion: number;
  valorMinimo?: number;
  valorMaximo?: number;
  longitudMaxima?: number;
  fuenteValor?: FieldDataSourceV2;
  campoTablaDinamica?: string;
  // El campo se muestra también en todas las tipificaciones que cuelgan de esta
  aplicaADescendientes?: boolean;
  // Campos para respuesta con valores dinámicos
  dataSource?: string;
  sourceField?: string;
  value?: any;
  options?: Array<{label: string, value: any}>;
}

// Enum para restricción de fecha en promesas de pago
export enum RestriccionFecha {
  SIN_RESTRICCION = 'SIN_RESTRICCION',   // Cualquier fecha futura
  DENTRO_MES = 'DENTRO_MES',             // Solo fechas dentro del mes actual
  FUERA_MES = 'FUERA_MES'                // Solo fechas del próximo mes en adelante
}

// Descuento máximo sin aprobación de una tarjeta de monto (tipificacion_campo_opciones.regla_descuento)
export type TipoLimiteDescuento = 'PORCENTAJE' | 'MONTO';
/** ANTIGUA_NUEVA: por periodo de compra. ANIO: por año del periodo de castigo. */
export type SegmentoDescuento = 'ANTIGUA_NUEVA' | 'ANIO';

export interface FilaReglaDescuento {
  valor: string | null;                // null | 'ANTIGUA' | 'NUEVA' | '2026' (null en ANIO = resto de años)
  descuentoMaximo: number | null;      // % o soles según el tipo; null = por definir
  maxCuotas: number | null;            // con descuento; null = las de la tarjeta
  montoMinimoCuota: number | null;     // con descuento; null = sin mínimo
}

export interface ReglaDescuento {
  tipo: TipoLimiteDescuento;
  campoReferencia: string | null;      // columna sobre la que se calcula; null = el monto de la tarjeta
  segmento: SegmentoDescuento | null;
  filas: FilaReglaDescuento[];
}

/** Resultado de POST /api/v2/descuento-maximo/evaluar */
export interface EvaluacionDescuento {
  estado: 'DIRECTO' | 'EVALUACION' | 'BLOQUEADO';
  mensaje: string | null;
  montoMinimoDirecto: number | null;
  maxCuotas: number | null;
  montoMinimoCuota: number | null;
}

// Modelos para el sistema de opciones con toggles
export interface CampoOpcionDTO {
  id?: number;
  codigoOpcion: string;
  labelOpcion: string;
  campoTablaDinamica?: string;
  estaHabilitada: boolean;
  ordenVisualizacion: number;
  restriccionFecha?: RestriccionFecha | string;  // Restricción de fecha para promesas de pago
  generaCartaAcuerdo?: boolean;  // Indica si genera Carta de Acuerdo al seleccionar este monto
  minCuotas?: number;  // Número mínimo de cuotas permitidas (default 1)
  maxCuotas?: number;  // Número máximo de cuotas permitidas (default 6)
  reglaDescuento?: ReglaDescuento | null;    // Descuento máximo sin aprobación; null = por definir
  porcentajeMaximoPromesa?: number;          // % máx que la promesa puede superar la deuda (bloqueo)
  topeSobrepagoSoles?: number | null;        // Sobrepago máximo en soles sobre el monto; más es monto libre (null = sin tope)

}

export interface ConfigurarOpcionesCampoRequest {
  idCampo: number;
  idSubcartera?: number;
  opciones: OpcionToggleDTO[];
}

export interface OpcionToggleDTO {
  codigoOpcion: string;
  estaHabilitada: boolean;
  ordenVisualizacion?: number;
  restriccionFecha?: RestriccionFecha | string;  // Restricción de fecha para promesas de pago
  generaCartaAcuerdo?: boolean;  // Indica si genera Carta de Acuerdo al seleccionar este monto
  minCuotas?: number;  // Número mínimo de cuotas permitidas
  maxCuotas?: number;  // Número máximo de cuotas permitidas
  reglaDescuento?: ReglaDescuento | null;    // Descuento máximo sin aprobación; null = por definir
  porcentajeMaximoPromesa?: number;          // % máx que la promesa puede superar la deuda (bloqueo)
  topeSobrepagoSoles?: number | null;        // Sobrepago máximo en soles sobre el monto; más es monto libre (null = sin tope)

}

export interface CampoConOpcionesResponse {
  idCampo: number;
  nombreCampo: string;
  labelCampo: string;
  tipoCampo: string;
  esRequerido: boolean;
  ordenVisualizacion: number;
  opciones: OpcionConValorDTO[];
}

export interface OpcionConValorDTO {
  id: number;
  codigoOpcion: string;
  labelOpcion: string;
  valor: any;
  esPersonalizado: boolean;
}

// Modelos para Cronograma de Pagos (Payment Schedule)
export interface PaymentInstallment {
  numeroCuota: number;
  monto: number;
  fechaPago: string; // ISO date string
}

export interface PaymentScheduleConfig {
  montoTotal: number;
  numeroCuotas: number;
  cuotas: PaymentInstallment[];
  grupoPromesaUuid?: string;
  campoMontoOrigen?: string;  // Nombre del campo de donde viene el monto (ej: sld_mora)
  montoBase?: number;  // Monto original del campo (antes de descuento/excepción). null = monto libre
  generaCartaAcuerdo?: boolean;  // Si el monto seleccionado genera carta de acuerdo
  idOpcion?: number;                         // Opción de la tarjeta elegida (su descuento máximo se lee en el backend)
  porcentajeMaximoPromesa?: number;          // % máx que la promesa puede superar la deuda (bloqueo)
  topeSobrepagoSoles?: number | null;        // Sobrepago máximo en soles sobre el monto; más es monto libre (null = sin tope)

}

export interface PaymentScheduleRequest {
  idCliente: number;
  idAgente: number;
  idTenant: number;
  idCartera?: number;
  idSubcartera?: number;
  idCampana?: number;
  idTipificacion: number;
  observaciones?: string;
  metodoContacto?: string;
  schedule: PaymentScheduleConfig;
  idOpcion?: number;                         // Opción de la tarjeta elegida (su descuento máximo se lee en el backend)
  porcentajeMaximoPromesa?: number;          // % máx que la promesa puede superar la deuda (bloqueo)
  topeSobrepagoSoles?: number | null;        // Sobrepago máximo en soles sobre el monto; más es monto libre (null = sin tope)

}
