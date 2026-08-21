/**
 * Una parte de la transcripción de un audio (audios_transcripcion).
 *
 * Es una lista y no un texto suelto porque la relación con el audio es 1:N: en
 * FOH una gestión larga se partía en varias partes y cada una dejó su fila. El
 * pipeline de Cashi escribe una sola, pero las dos formas conviven en la tabla.
 */
export interface Transcription {
  /** Nombre del WAV que originó este texto. Identifica la parte. */
  titulo: string;
  transcripcion: string;
}
