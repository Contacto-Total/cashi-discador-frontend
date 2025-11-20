export enum ClassificationType {
  RESULTADO_CONTACTO = 'RESULTADO_CONTACTO',
  TIPO_GESTION = 'TIPO_GESTION',
  MODALIDAD_PAGO = 'MODALIDAD_PAGO',
  TIPO_FRACCIONAMIENTO = 'TIPO_FRACCIONAMIENTO'
}

export interface TypificationCatalog {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipoClasificacion: ClassificationType;
  tipificacionPadre?: {
    id: number;
  };
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

export interface TenantTypificationConfig {
  id: number;
  idTenant: number;
  idCartera?: number;
  idSubcartera?: number;
  tipificacion: TypificationCatalog;
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

export interface CreateTypificationCommand {
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipoClasificacion: ClassificationType;
  tipificacionPadre?: {
    id: number;
  };
  ordenVisualizacion?: number;
  esEstadoFinal?: boolean;
  requiereObservaciones?: boolean;
  colorSugerido?: string;
  iconoSugerido?: string;
  esSistema?: boolean;
}

export interface UpdateTypificationCommand {
  nombre?: string;
  descripcion?: string;
  ordenVisualizacion?: number;
  esEstadoFinal?: boolean;
  requiereObservaciones?: boolean;
  estaActiva?: boolean;
  colorSugerido?: string;
  iconoSugerido?: string;
}

export interface UpdateTypificationConfigCommand {
  estaHabilitada?: boolean;
  nombrePersonalizado?: string;
  descripcionPersonalizada?: string;
  colorPersonalizado?: string;
  iconoPersonalizado?: string;
  ordenVisualizacionPersonalizado?: number;
  requiereObservacionesPersonalizado?: boolean;
}

export interface TypificationTreeNode {
  typification: TypificationCatalog;
  config?: TenantTypificationConfig;
  children: TypificationTreeNode[];
  level: number;
}

export enum FieldType {
  DATE = 'DATE',
  NUMBER = 'NUMBER',
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA'
}

export interface AdditionalField {
  id: number;
  nombreCampo: string;
  tipoCampo: FieldType;
  labelCampo: string;
  esRequerido: boolean;
  ordenVisualizacion: number;
  valorMinimo?: number;
  valorMaximo?: number;
  longitudMaxima?: number;
}
