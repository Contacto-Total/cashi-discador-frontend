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

/** Qué se mide contra la meta: recaudo conciliado o contención (T3) */
export type TipoMetrica = 'RECAUDO' | 'CONTENCION';

/** EN_CURSO → REVISADO → CERRADO (REVISADO puede volver a EN_CURSO) */
export type EstadoPeriodo = 'EN_CURSO' | 'REVISADO' | 'CERRADO';

export type RolComision = 'ASESOR' | 'SUPERVISOR';

/** Por qué un pago conciliado no suma al logrado de nadie */
export type MotivoExclusion =
  | 'PAGO_SISTEMA'
  | 'SUPERVISOR_NO_ASIGNA'
  | 'AGENTE_NO_PARTICIPANTE'
  | 'PARTICIPANTE_QUITADO';

export type AccionAuditoria =
  | 'CREAR_PERIODO'
  | 'EDITAR_ROLES'
  | 'EDITAR_TRAMOS'
  | 'EDITAR_PARTICIPANTE'
  | 'CALCULAR'
  | 'CAMBIAR_ESTADO';

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
  revisadoPorNombre?: string | null;
  fechaRevision?: string | null;
  cerradoPorNombre?: string | null;
  fechaCierre?: string | null;
  /** null = hay que (re)calcular porque cambió la configuración */
  fechaCalculo?: string | null;
  escalas: EscalaComision[];
  roles: RolElegido[];
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
  /** Solo llega lleno en la respuesta de calcular */
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
  contencion: string | null;
  capitalAsignado: number | null;
  /** null = el pago suma */
  motivoExclusion: MotivoExclusion | null;
}

export interface SustentoPeriodo {
  periodo: PeriodoComision;
  /** null = sustento de toda la subcartera */
  participante: ParticipanteComision | null;
  pagos: PagoSustento[];
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

// ==================== BASE DE AJUSTE ====================

export interface EstadisticasBaseAjuste {
  total_registros: number;
  total_envios: number;
  total_asesores: number;
  monto_total: number;
  primer_envio: string | null;
  ultimo_envio: string | null;
}

export interface EnvioBaseAjuste {
  registrosAgregados: number;
  fechaEnvio: string;
  mensaje: string;
}
