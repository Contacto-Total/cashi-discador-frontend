/**
 * Cabecera del archivo CREP del BCP
 */
export interface BcpArchivoCabecera {
  codigoAfiliado: string;
  fechaProceso: string;
  totalRegistros: number;
  montoTotal: number;
  codigoInternoBcp: string;
  codigoTeletransfer: string;
  horaCorte: string;
  codigoServicio: string;
}

/**
 * Detalle (pago individual) del archivo CREP del BCP
 */
export interface BcpArchivoDetalle {
  numeroFila: number;
  codigoDepositante: string;
  documento: string;
  datoAdicionalDepositante: string;
  fechaPago: string;
  montoPagado: number;
  sucursal: string;
  agencia: string;
  numeroOperacion: string;
  terminal: string;
  medioAtencion: string;
  horaAtencion: string;
  numeroCheque: string;
  codigoBanco: string;
  flagExtorno: string;
  numeroOperacionBd: string;
  referencia: string;
  numeroOperacionCanal: string;
}

/**
 * Resultado completo del parsing del archivo CREP
 */
export interface BcpArchivoResultado {
  exitoso: boolean;
  mensaje: string;
  nombreArchivo: string;
  cabecera: BcpArchivoCabecera | null;
  detalles: BcpArchivoDetalle[];
  registrosProcesados: number;
  erroresEncontrados: number;
  errores: string[];
  archivoId: number | null;
  duplicadosOmitidos: number;
  prevalidacion?: PrevalidacionArchivoBcp[];
  todosAprobables?: boolean;
}

export type EstadoPrevalidacionBcp =
  | 'LISTO_PARA_APROBAR'
  | 'REQUIERE_REVISION_MONTO'
  | 'PAGO_REGISTRADO_FECHA_FUERA_TOLERANCIA'
  | 'PAGO_REGISTRADO_FECHA_DISTINTA_BANCO'
  | 'DOCUMENTO_NO_EXISTE_EN_CLIENTES'
  | 'NO_TIENE_PROMESA'
  | 'PROMESA_SIN_CUOTAS_PENDIENTES'
  | 'FALTA_TIPIFICACION_CANCELACION'
  | 'CLIENTE_MULTIPLES_CARTERAS_NO_COINCIDE_MONTO_FECHA'
  | 'CUOTAS_ANTERIORES_VENCIDAS_SIN_PAGO'
  | 'FECHA_FUERA_DE_RANGO_DE_PROMESA'
  | 'SIN_CANDIDATO';

export interface PrevalidacionArchivoBcp {
  tipoMatch: string;
  prioridad: number;
  pcIds: string | null;
  cuotaIds: string | null;
  idGestion: number | null;
  tenantId?: number | null;
  carteraId?: number | null;
  subcarteraId?: number | null;
  diffDias: number | null;
  diffMonto: number | null;
  documentoBanco: string;
  fechaBanco: string;
  montoBanco: number;
  numeroOperacion: string | null;
  banco: string;
  documentoAgente: string | null;
  fechaPago: string | null;
  montoPago: number | null;
  operacionAgente: string | null;
  estadoPrevalidacion: EstadoPrevalidacionBcp | string;
}

/**
 * DTO para registro manual de pago
 */
export interface BcpPagoManualRequest {
  documento: string;
  nombreDepositante?: string;
  fechaPago: string;
  monto: number;
  numeroOperacion: string;
  sucursal?: string;
  agencia?: string;
  medioAtencion?: string;
  observaciones?: string;
  /** Banco donde se realizó el pago: BCP, INTERBANK, BBVA, SCOTIABANK, BANBIF, OTRO */
  banco?: string;
}

/**
 * Respuesta del registro manual
 */
export interface BcpPagoManualResponse {
  exitoso: boolean;
  mensaje: string;
  pagoId?: number;
  documento?: string;
  monto?: number;
  numeroOperacion?: string;
}

/**
 * Pago manual almacenado en BD
 */
export interface BcpPagoManual {
  id: number;
  documento: string;
  codigoDepositante: string;
  datoAdicionalDepositante?: string;
  fechaBanco: string;
  montoBanco: number;
  numeroOperacion: string;
  sucursal?: string;
  agencia?: string;
  terminal?: string;
  medioAtencion?: string;
  horaAtencion?: string;
  banco: string;
  procesado: boolean;
  cuotaAplicadaId?: number;
  referencia?: string;
}

/**
 * Filtros para buscar pagos manuales
 */
export interface BcpPagoManualFiltros {
  documento?: string;
  banco?: string;
  medioAtencion?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  size?: number;
}

/**
 * Respuesta paginada de pagos manuales
 */
export interface BcpPagoManualListResponse {
  data: BcpPagoManual[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/**
 * Detalle de un match de conciliación
 */
export interface MatchDetalle {
  bcpPagoDetalleId: number;
  transaccionId: number;
  documento: string;
  monto: number;
  resultado: string;
}

/**
 * Resultado de la conciliación bancaria
 */
export interface ResultadoConciliacion {
  totalProcesados: number;
  matchesEncontrados: number;
  sinMatch: number;
  detallesMatch: MatchDetalle[];
  pagosSinMatch: BcpPagoManual[];
}
