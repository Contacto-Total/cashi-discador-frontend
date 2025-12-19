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
}
