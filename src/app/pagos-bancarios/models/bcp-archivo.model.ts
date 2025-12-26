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
