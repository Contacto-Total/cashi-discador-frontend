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

/**
 * Escala de comisión por porcentaje de cumplimiento de meta
 */
export interface ComisionMetaEscala {
  id?: number;
  porcentajeDesde: number;
  porcentajeHasta?: number;
  montoComision: number;
}

/**
 * Meta de comisión por subcartera/período
 */
export interface ComisionMeta {
  id?: number;
  idSubcartera: number;
  nombreSubcartera?: string;
  anio: number;
  mes: number;
  metaGrupal: number;
  tipoMetrica?: string; // RECAUDO, CAPITAL_LIBERADO
  escalas: ComisionMetaEscala[];
  activo?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

/**
 * Escala de un bono
 */
export interface ComisionBonoEscala {
  id?: number;
  cantidadMinima: number;
  monto: number;
}

/**
 * Bono de comisión por variable
 */
export interface ComisionBono {
  id?: number;
  nombre: string;
  descripcion?: string;
  campoEvaluar: string;
  valorBuscar: string;
  idSubcartera?: number;
  nombreSubcartera?: string;
  anio: number;
  mes: number;
  activo?: boolean;
  escalas: ComisionBonoEscala[];
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

/**
 * Bono ganado por un agente
 */
export interface BonoGanado {
  bonoId: number;
  nombreBono: string;
  campoEvaluar: string;
  valorBuscar: string;
  cantidadPagos: number;
  montoGanado: number;
}

/**
 * Comisión calculada por agente
 */
export interface ComisionAgente {
  idAgente: number;
  nombreAgente: string;
  nombreSubcartera?: string;
  recaudoTotal: number;
  cantidadPagos: number;
  metaIndividual: number;
  porcentajeCumplimiento: number;
  metaAlcanzada: boolean;
  comisionBase: number;
  bonosGanados: BonoGanado[];
  totalBonos: number;
  totalComision: number;
}

/**
 * Reporte de comisiones
 */
export interface ComisionReporte {
  anio: number;
  mes: number;
  idSubcartera?: number;
  nombreSubcartera?: string;
  totalRecaudo: number;
  totalComisiones: number;
  totalBonos: number;
  totalAgentes: number;
  agentes: ComisionAgente[];
}

/**
 * Resumen de configuración
 */
export interface ComisionConfigResumen {
  metas: ComisionMeta[];
  bonos: ComisionBono[];
  camposDisponibles: string[];
}
