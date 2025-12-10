/**
 * Resultado del OCR al analizar un comprobante
 */
export interface OcrResult {
  success: boolean;
  monto?: number;
  moneda?: string;
  documento?: string;
  fecha?: string;
  numeroOperacion?: string;
  banco?: string;
  nombre?: string;
  textoCompleto?: string;
  tiempoProcesamiento?: number;
  error?: string;
}

/**
 * Resultado de validación (monto o documento)
 */
export interface ValidationResult {
  coincide: boolean;
  valorEsperado?: string;
  valorExtraido?: string;
  diferencia?: number;
  mensaje?: string;
}

/**
 * Respuesta al subir un comprobante
 */
export interface ComprobanteUploadResponse {
  success: boolean;
  uuid?: string;
  rutaArchivo?: string;
  ocrResult?: OcrResult;
  validacionMonto?: ValidationResult;
  validacionDocumento?: ValidationResult;
  validacionNombre?: ValidationResult;
  mensaje?: string;
  error?: string;
}

/**
 * Request para subir comprobante
 */
export interface ComprobanteUploadRequest {
  idCuota: number;
  montoEsperado?: number;
  documentoEsperado?: string;
  nombreEsperado?: string;
  idAgente: number;
  idGestion?: number;
  descripcion?: string;
  validarConOcr?: boolean;
}

/**
 * Adjunto/Comprobante guardado
 */
export interface AdjuntoGestion {
  id: number;
  uuid: string;
  nombreArchivo: string;
  tipoArchivo: string;
  tamanoBytes: number;
  rutaArchivo: string;
  tipoAdjunto: TipoAdjunto;
  descripcion?: string;
  subidoPor: number;
  estaVerificado: boolean;
  fechaVerificacion?: string;
  // Campos OCR
  ocrMontoExtraido?: number;
  ocrDocumentoExtraido?: string;
  ocrFechaExtraida?: string;
  ocrNumeroOperacion?: string;
  ocrBanco?: string;
  ocrTextoCompleto?: string;
  ocrMontoCoincide?: boolean;
  ocrDocumentoCoincide?: boolean;
  montoEsperado?: number;
  documentoEsperado?: string;
  idCuota?: number;
  fechaCreacion: string;
}

export type TipoAdjunto =
  | 'COMPROBANTE_PAGO'
  | 'CONTRATO'
  | 'ACUERDO_PAGO'
  | 'CONVENIO'
  | 'CARTA_COMPROMISO'
  | 'IDENTIFICACION'
  | 'OTRO_DOCUMENTO'
  | 'CAPTURA_PANTALLA'
  | 'GRABACION_LLAMADA'
  | 'GRABACION_PANTALLA';
