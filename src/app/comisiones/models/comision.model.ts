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

/** Qué se mide contra la meta: todo lo pagado, o solo lo pagado por clientes CONTENIDO */
export type TipoMetrica = 'RECAUDO' | 'CONTENCION';

/** EN_CURSO se muestra como "Abierto". Cerrar es el paso final; se puede reabrir. */
export type EstadoPeriodo = 'EN_CURSO' | 'CERRADO';

export type RolComision = 'ASESOR' | 'SUPERVISOR';

export type AccionAuditoria =
  | 'CREAR_PERIODO'
  | 'EDITAR_CONFIGURACION'
  | 'EDITAR_ROLES'
  | 'EDITAR_TRAMOS'
  | 'EDITAR_PARTICIPANTE'
  | 'CALCULAR'
  | 'CAMBIAR_ESTADO';

/** Nivel de la escala: aplica desde que el cumplimiento llega a porcentajeDesde. El "hasta" es el desde del siguiente. */
export interface EscalaComision {
  id?: number;
  rol: RolComision;
  porcentajeDesde: number;
  montoComision: number;
}

/** Meta de cantidad del asesor. META = llegar al 100 % de su meta individual (sin cantidad). */
export type TipoMetaCantidad = 'GESTIONES' | 'PDP' | 'PAGOS' | 'META';

export interface MetaCantidad {
  tipo: TipoMetaCantidad;
  cantidad: number | null;
  monto: number;
}

/** LTD: gestiones con campo_monto_origen en origenes. PKM: clientes con la columna PKM. SOBRE: sobrecumplimiento en soles. */
export type TipoBono = 'LTD' | 'PKM' | 'SOBRE';

/** Nivel de un bono: desde (cantidad o soles) → monto; montoSegundo = 2° puesto */
export interface NivelBono {
  desde: number;
  monto: number;
  montoSegundo: number | null;
}

export interface BonoPeriodo {
  id?: number | null;
  tipo: TipoBono;
  aplica: RolComision;
  activo: boolean;
  /** Solo LTD */
  origenes: string[];
  /** SOBRE de asesor: compara el total de la subcartera en vez de su logrado */
  baseTotal: boolean;
  /** SOBRE de asesor: solo cobran el 1° y el 2° */
  porPuesto: boolean;
  /** Asesores que no lo reciben */
  excluidos: number[];
  niveles: NivelBono[];
}

/** Una línea de lo que cobra */
export interface LineaDesglose {
  tipo: 'NIVEL' | 'LOGRO' | 'META' | 'BONO';
  nombre: string;
  detalle: string;
  cumple: boolean;
  monto: number;
}

/** Rol de Cashi */
export interface RolDTO {
  idRol: number;
  nombreRol: string;
}

/** Rol de Cashi para elegir el rol de asesores */
export interface RolCashi {
  idRol: number;
  nombreRol: string;
  asignadoASubcartera: boolean;
}

/** Candidato a asesor */
export interface UsuarioCashi {
  idUsuario: number;
  nombre: string | null;
}

/** Candidato a supervisor */
export interface SupervisorCashi {
  idUsuario: number;
  nombre: string | null;
  nombreRol: string;
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
  /** Meta del mes ajustada solo para comisiones; null = la INTERNA */
  metaAjustada: number | null;
  /** La que se usa en el cálculo */
  metaDelMes: number;
  estado: EstadoPeriodo;
  cerradoPorNombre?: string | null;
  fechaCierre?: string | null;
  /** Último cálculo; null si no se pudo calcular */
  fechaCalculo?: string | null;
  totalComisiones: number;
  rolAsesor: RolDTO | null;
  escalas: EscalaComision[];
  /** Los niveles alcanzados de la escala del asesor se suman */
  escalaAcumulativa: boolean;
  metasCantidad: MetaCantidad[];
  bonos: BonoPeriodo[];
  totalBonos: number;
}

export interface ParticipanteComision {
  /** null en la simulación */
  idResultado: number | null;
  idUsuario: number;
  nombre: string;
  rol: RolComision;
  metaIndividual: number | null;
  /** Meta propia (excepción); null = meta del mes ÷ asesores sin meta propia */
  metaManual: number | null;
  logrado: number;
  /** Redondeado, solo para mostrar */
  porcentajeCumplimiento: number | null;
  /** porcentajeDesde del nivel alcanzado; null si no alcanzó ninguno */
  porcentajeTramo: number | null;
  /** Escala (o logros) + metas de cantidad */
  montoComision: number;
  /** Aparte de la comisión */
  montoBonos: number;
  /** Cómo se arma lo que cobra */
  desglose: LineaDesglose[];
}

export interface ReportePeriodo {
  periodo: PeriodoComision;
  participantes: ParticipanteComision[];
  totalComisiones: number;
  totalBonos: number;
  /** Avisos del cálculo que acaba de hacerse (vacío en las consultas) */
  advertencias: string[];
}

/** Lo que se ve al elegir subcartera y mes */
export interface VistaPeriodo {
  idTenant: number;
  idCartera: number;
  idSubcartera: number;
  nombreSubcartera: string | null;
  anio: number;
  mes: number;
  futuro: boolean;
  /** null = el mes no está configurado */
  reporte: ReportePeriodo | null;
  pagos: {
    cantidad: number;
    total: number;
    primeraFechaBanco: string | null;
    /** Hasta qué día llegaron pagos del banco */
    ultimaFechaBanco: string | null;
  };
  /** Meta INTERNA del reporte de producción; null si no está registrada */
  metaInterna: number | null;
  rolSugerido: RolDTO | null;
}

/** Un mes del selector de período */
export interface MesPeriodo {
  anio: number;
  mes: number;
  idPeriodo: number | null;
  estado: EstadoPeriodo | null;
  totalComisiones: number | null;
  pagos: number;
  futuro: boolean;
}

export interface AsesorConfig {
  idUsuario: number;
  metaManual: number | null;
}

/** Configuración de un mes (guardar o simular) */
export interface ConfiguracionPeriodo {
  idSubcartera: number;
  anio: number;
  mes: number;
  tipoMetrica: TipoMetrica;
  idRolAsesor: number;
  asesores: AsesorConfig[];
  idSupervisor: number | null;
  metaAjustada: number | null;
  escalas: EscalaComision[];
  escalaAcumulativa: boolean;
  metasCantidad: MetaCantidad[];
  /** null = no se tocan los bonos del período */
  bonos: BonoPeriodo[] | null;
}

/** Cómo quedaría el mes con una configuración (no guarda nada) */
export interface SimulacionPeriodo {
  metaDelMes: number;
  metaPorAsesor: number;
  participantes: ParticipanteComision[];
  totalComisiones: number;
  totalBonos: number;
  /** Lo que suma cada usuario en el mes con la métrica elegida, participe o no */
  logradoPorUsuario: Record<string, number>;
  advertencias: string[];
}

/** Va una de las dos: meta propia del asesor o nueva meta del mes */
export interface AgregarParticipanteRequest {
  idUsuario: number;
  metaManual: number | null;
  metaAjustada: number | null;
}

/**
 * Fila de comision_detalle: un pago que suma a un asesor y cómo va el asesor hasta ese pago.
 * RECAUDO llena recaudo y recaudoAcumulado; CONTENCION llena las de contenido.
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
  documentoCliente: string | null;
  nombreCliente: string | null;
  idGestion: number;
  fechaGestion: string;
  numeroCuota: number;
  fechaVencimientoCuota: string;
  /** Último pago que informa el banco o Financiera OH: decide el mes y el orden */
  fechaBanco: string;
  banco: string | null;
  numeroOperacion: string | null;
  /** Solo BCP; el archivo de Financiera OH no trae hora */
  horaBanco: string | null;
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
