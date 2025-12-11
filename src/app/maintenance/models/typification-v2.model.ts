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
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaEliminacion?: string;
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
  idTipificacionPadre?: number;
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
  tipoCampo: FieldTypeV2;
  labelCampo: string;
  esRequerido: boolean;
  ordenVisualizacion: number;
  valorMinimo?: number;
  valorMaximo?: number;
  longitudMaxima?: number;
  fuenteValor?: FieldDataSourceV2;
  campoTablaDinamica?: string;
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

// Modelos para el sistema de opciones con toggles
export interface CampoOpcionDTO {
  id?: number;
  codigoOpcion: string;
  labelOpcion: string;
  campoTablaDinamica?: string;
  estaHabilitada: boolean;
  ordenVisualizacion: number;
  restriccionFecha?: RestriccionFecha | string;  // Restricción de fecha para promesas de pago
}

export interface ConfigurarOpcionesCampoRequest {
  idCampo: number;
  opciones: OpcionToggleDTO[];
}

export interface OpcionToggleDTO {
  codigoOpcion: string;
  estaHabilitada: boolean;
  ordenVisualizacion?: number;
  restriccionFecha?: RestriccionFecha | string;  // Restricción de fecha para promesas de pago
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
}
