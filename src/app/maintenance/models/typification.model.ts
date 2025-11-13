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
  tipificacionPadre?: TypificationCatalog;
  tipificacionesHijas?: TypificationCatalog[];
  nivelJerarquia: number;
  ordenVisualizacion: number;
  esEstadoFinal: boolean;
  requiereObservaciones: boolean;
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
  heredaDePadre: boolean;
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
}

export interface CreateTypificationCommand {
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipoClasificacion: ClassificationType;
  tipificacionPadre?: TypificationCatalog;
  nivelJerarquia?: number;
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
  colorSugerido?: string;
  iconoSugerido?: string;
  ordenVisualizacion?: number;
  requiereObservaciones?: boolean;
}

export interface UpdateTypificationConfigCommand {
  estaHabilitada?: boolean;
  heredaDePadre?: boolean;
  nombrePersonalizado?: string;
  descripcionPersonalizada?: string;
  colorPersonalizado?: string;
  iconoPersonalizado?: string;
  ordenVisualizacionPersonalizado?: number;
  requiereObservacionesPersonalizado?: boolean;
  modificadoPor?: number;
}

export interface TypificationTreeNode {
  tipificacion: TypificationCatalog;
  configuracion?: TenantTypificationConfig;
  hijos: TypificationTreeNode[];
  nivel: number;
}
