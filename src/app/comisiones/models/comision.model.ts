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
  /** Comisiones: carteras que se comisionan aparte (Tramo Propio: ANTIGUA y NUEVA); null en las demás */
  grupos?: GrupoComision[] | null;
}

// ==================== PERÍODOS DE COMISIÓN ====================

/** Tramo Propio se comisiona en dos carteras (CP Antigua y CP Nueva); las demás subcarteras son GENERAL */
export type GrupoComision = 'GENERAL' | 'ANTIGUA' | 'NUEVA';

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

/** cantidadDia: por día hábil; la meta = cantidadDia × días hábiles que trabaja el asesor */
export interface MetaCantidad {
  tipo: TipoMetaCantidad;
  cantidadDia: number | null;
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

/** Candidato a asesor: el personal con la subcartera asignada en el mes */
export interface CandidatoAsesor {
  idUsuario: number;
  nombre: string | null;
  /** Tramo Propio: la otra cartera en la que ya es asesor este mes (no se puede elegir); null si está libre */
  participaEn: string | null;
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
  grupo: GrupoComision;
  tipoMetrica: TipoMetrica;
  /** Meta INTERNA del reporte de producción */
  metaGrupal: number;
  /** Meta del mes ajustada solo para comisiones; null = la INTERNA. En Tramo Propio, la meta de la cartera escrita a mano */
  metaAjustada: number | null;
  /** La que se usa en el cálculo */
  metaDelMes: number;
  estado: EstadoPeriodo;
  cerradoPorNombre?: string | null;
  fechaCierre?: string | null;
  /** Último recálculo (el cálculo es manual); null = todavía no se recalcula */
  fechaCalculo?: string | null;
  recalculadoPorNombre?: string | null;
  /** Última fecha banco con pagos en el último recálculo */
  pagosHasta?: string | null;
  /** Se guardó configuración, bonos o participantes después del último recálculo */
  cambiosPendientes: boolean;
  /** Pagos conciliados del mes aprobados después del último recálculo */
  pagosNuevos: number;
  /** Días hábiles del mes (lunes a viernes, sin feriados) */
  diasHabiles: number;
  totalComisiones: number;
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
  /** Meta propia (excepción); null = meta del mes ÷ asesores de mes completo */
  metaManual: number | null;
  /** Ingresó a mitad de mes (yyyy-mm-dd); null = mes completo */
  fechaIngreso: string | null;
  /** Días hábiles que trabaja en el mes */
  diasHabiles: number | null;
  /** false = entró después del último recálculo */
  calculado: boolean;
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
  grupo: GrupoComision;
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
  /** Meta INTERNA del reporte de producción; null si no está registrada. En Tramo Propio es la de toda la subcartera */
  metaInterna: number | null;
  /** Días hábiles del mes para la subcartera */
  diasHabiles: number;
  /** Feriados del mes que caen de lunes a viernes (yyyy-mm-dd) */
  feriados: string[];
}

/** Lo que el sustento usa de la vista: el mes y hasta qué día entran los pagos */
export interface VistaSustento {
  anio: number;
  mes: number;
  pagos: { ultimaFechaBanco: string | null };
}

/** Mis comisiones: un período recalculado en el que participa el usuario de la sesión */
export interface MiPeriodoComision {
  idPeriodo: number;
  anio: number;
  mes: number;
  idSubcartera: number;
  nombreSubcartera: string;
  grupo: GrupoComision;
  estado: EstadoPeriodo;
  rol: RolComision;
  montoComision: number;
  montoBonos: number;
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
  /** Ingresó a mitad de mes (se conserva al guardar) */
  fechaIngreso: string | null;
}

/** Configuración de un mes (guardar o simular) */
export interface ConfiguracionPeriodo {
  idSubcartera: number;
  anio: number;
  mes: number;
  grupo: GrupoComision;
  tipoMetrica: TipoMetrica;
  asesores: AsesorConfig[];
  idSupervisor: number | null;
  /** En Tramo Propio es obligatoria: la meta de la cartera, escrita a mano */
  metaAjustada: number | null;
  escalas: EscalaComision[];
  escalaAcumulativa: boolean;
  metasCantidad: MetaCantidad[];
  /** null = no se tocan los bonos del período */
  bonos: BonoPeriodo[] | null;
}

/** Asesor que ingresa a mitad de mes: su meta sale de los días hábiles que trabaja */
export interface AgregarParticipanteRequest {
  idUsuario: number;
  /** yyyy-mm-dd, dentro del mes del período */
  fechaIngreso: string;
}

/**
 * Fila de comision_detalle: un pago que suma a un asesor y cómo va el asesor hasta ese pago.
 * RECAUDO llena recaudo y recaudoAcumulado. CONTENCION: recaudo = lo pagado (no suma); recaudoContenido =
 * el capital asignado que suma este pago (el del cliente en su primer pago del mes, 0 en los siguientes).
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
