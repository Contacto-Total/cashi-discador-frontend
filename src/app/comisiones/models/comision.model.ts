// ==================== CATÁLOGOS ====================
// Los usan también los reportes, bot de voz y meta-alcance: no cambiar su forma.

/**
 * Inquilino (tenant) para dropdown
 */
export interface Inquilino {
  id: number;
  codigoInquilino?: string;
  nombreInquilino: string;
  razonSocial?: string;
  estaActivo?: boolean;
}

/**
 * Cartera (portfolio) para dropdown
 */
export interface Cartera {
  id: number;
  codigoCartera?: string;
  nombreCartera: string;
  descripcion?: string;
  idInquilino?: number;
  estaActivo?: boolean;
}

/**
 * Subcartera para dropdown
 */
export interface Subcartera {
  id: number;
  codigoSubcartera?: string;
  nombreSubcartera: string;
  descripcion?: string;
  idCartera?: number;
  estaActivo?: boolean;
}

// ==================== PERÍODOS DE COMISIÓN ====================

/** Qué se mide contra la meta: recaudo conciliado o recaudo de clientes contenidos (T3) */
export type TipoMetrica = 'RECAUDO' | 'CONTENCION';

/**
 * EN_CURSO → EN_REVISION → REVISADO → APROBADO.
 * EN_REVISION puede volver a EN_CURSO y REVISADO a EN_REVISION. APROBADO es final.
 */
export type EstadoPeriodo = 'EN_CURSO' | 'EN_REVISION' | 'REVISADO' | 'APROBADO';

export type RolComision = 'ASESOR' | 'SUPERVISOR';

/** Por qué un pago conciliado no suma al logrado de nadie */
export type MotivoExclusion =
  | 'PAGO_SISTEMA'
  | 'SUPERVISOR_NO_ASIGNA'
  | 'USUARIO_EXCLUIDO'
  | 'AGENTE_NO_PARTICIPANTE'
  | 'PARTICIPANTE_QUITADO'
  | 'NO_CONTENIDO';

export type AccionAuditoria =
  | 'CREAR_PERIODO'
  | 'EDITAR_ROLES'
  | 'EDITAR_TRAMOS'
  | 'EDITAR_PARTICIPANTE'
  | 'CALCULAR'
  | 'CAMBIAR_ESTADO'
  | 'EDITAR_PLANTILLA';

/** AUTO: la meta se divide entre los asesores no quitados. FIJO: entre asesoresFijos */
export type DivisionMeta = 'AUTO' | 'FIJO';

/** Usuario cuyas promesas y pagos no comisionan */
export interface ExcluidoComision {
  idUsuario: number;
  nombre: string | null;
}

/** Usuario de Cashi para el selector de excluidos */
export interface UsuarioCashi {
  idUsuario: number;
  nombre: string | null;
}

/** Tramo: aplica desde que el cumplimiento llega a porcentajeDesde. El "hasta" es el desde del siguiente. */
export interface EscalaComision {
  id?: number;
  rol: RolComision;
  porcentajeDesde: number;
  montoComision: number;
}

/** Rol de Cashi elegido para armar la lista de participantes */
export interface RolElegido {
  idRol: number;
  nombreRol?: string;
  rolComision: RolComision;
}

/** Rol de Cashi disponible para el selector */
export interface RolCashi {
  idRol: number;
  nombreRol: string;
  asignadoASubcartera: boolean;
}

export interface PeriodoComision {
  id: number;
  idSubcartera: number;
  nombreSubcartera: string;
  anio: number;
  mes: number;
  tipoMetrica: TipoMetrica;
  /** Meta INTERNA del reporte de producción */
  metaGrupal: number;
  estado: EstadoPeriodo;
  enviadoRevisionPorNombre?: string | null;
  fechaEnvioRevision?: string | null;
  revisadoPorNombre?: string | null;
  fechaRevision?: string | null;
  aprobadoPorNombre?: string | null;
  fechaAprobacion?: string | null;
  /** Último cálculo; null si no se pudo calcular (sin meta, sin participantes, dos supervisores) */
  fechaCalculo?: string | null;
  /** Suma de comisiones de los participantes no quitados */
  totalComisiones: number;
  escalas: EscalaComision[];
  roles: RolElegido[];
  divisionMeta: DivisionMeta;
  asesoresFijos: number | null;
  excluidos: ExcluidoComision[];
}

export interface PeriodoResumen {
  id: number;
  anio: number;
  mes: number;
  estado: EstadoPeriodo;
}

/** Configuración de comisiones de una subcartera: se copia a cada período nuevo */
export interface PlantillaSubcartera {
  idSubcartera: number;
  nombreSubcartera: string | null;
  /** false = aún no tiene: los datos vienen de su último período (o vacíos) */
  existe: boolean;
  tipoMetrica: TipoMetrica;
  divisionMeta: DivisionMeta;
  asesoresFijos: number | null;
  escalas: EscalaComision[];
  roles: RolElegido[];
  excluidos: ExcluidoComision[];
  /** Usuarios de sistema, siempre excluidos */
  excluidosSistema: ExcluidoComision[];
  actualizadoPorNombre: string | null;
  fechaActualizacion: string | null;
  periodos: PeriodoResumen[];
  /** Al guardar: aplicar también al período en curso */
  aplicarEnCurso: boolean;
}

export interface ParticipanteComision {
  idResultado: number;
  idUsuario: number;
  nombre: string;
  rol: RolComision;
  quitado: boolean;
  metaIndividual: number | null;
  logrado: number;
  /** Redondeado, solo para mostrar */
  porcentajeCumplimiento: number | null;
  /** porcentajeDesde del tramo alcanzado; null si no alcanzó ninguno */
  porcentajeTramo: number | null;
  montoComision: number;
}

export interface ReportePeriodo {
  periodo: PeriodoComision;
  participantes: ParticipanteComision[];
  totalComisiones: number;
  /** Avisos del cálculo que acaba de hacerse (vacío en las consultas) */
  advertencias: string[];
}

export interface PagoSustento {
  conciliacionId: number;
  fechaBanco: string;
  banco: string | null;
  numeroOperacion: string | null;
  documentoCliente: string | null;
  nombreCliente: string | null;
  idGestion: number;
  idAgenteGestion: number;
  nombreAgenteGestion: string | null;
  montoAplicado: number;
  /** Solo CONTENCION: marca de la tabla dinámica */
  contencion: string | null;
  /** null = el pago suma */
  motivoExclusion: MotivoExclusion | null;
}

export interface SustentoPeriodo {
  periodo: PeriodoComision;
  /** null = sustento de toda la subcartera */
  participante: ParticipanteComision | null;
  pagos: PagoSustento[];
}

/**
 * Fila de comision_detalle: un pago que suma a un asesor y cómo va el asesor hasta ese pago.
 * RECAUDO llena recaudo y recaudoAcumulado; CONTENCION (T3) llena las de contenido.
 */
export interface DetalleComision {
  idResultado: number;
  conciliacionId: number;
  idTenant: number;
  idCartera: number;
  idSubcartera: number;
  nombreSubcartera: string | null;
  idUsuario: number;
  nombreAsesor: string | null;
  idGestion: number;
  fechaGestion: string;
  numeroCuota: number;
  fechaVencimientoCuota: string;
  /** Último pago que informa el banco o Financiera OH: decide el mes y el orden */
  fechaBanco: string;
  fechaAprobacionConciliacion: string;
  recaudo: number | null;
  recaudoContenido: number | null;
  recaudoAcumulado: number | null;
  recaudoContenidoAcumulado: number | null;
  metaAsesor: number | null;
  porcentajeAcumulado: number | null;
  comisionAlcanzada: number;
}

export interface AuditoriaComision {
  id: number;
  metaId: number;
  accion: AccionAuditoria;
  estadoAnterior: EstadoPeriodo | null;
  estadoNuevo: EstadoPeriodo | null;
  detalle: string | null;
  idUsuario: number;
  nombreCompleto: string | null;
  fecha: string;
}

export interface CrearPeriodoRequest {
  idSubcartera: number;
  anio: number;
  mes: number;
  tipoMetrica: TipoMetrica;
}
