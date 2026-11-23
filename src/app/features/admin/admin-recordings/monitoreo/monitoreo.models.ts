/**
 * Contrato de la pestaña Monitoreo de Grabaciones Discador (backend: MonitoreoLlamadasDTO).
 *
 * Junta FOH (audios_evaluaciones: un 0/1 por criterio) e Interbank (speech_evaluacion*: resultado,
 * frase y motivo por criterio, NA y falta crítica). Rúbricas: PDP y CD en FOH; TIT y TER en Interbank.
 */

export type Cliente = 'FOH' | 'IBK';
export type Rubrica = 'PDP' | 'CD' | 'TIT' | 'TER';
export type Resultado = 'CUMPLE' | 'NO_CUMPLE' | 'NA';
export type EstadoFalta = 'PENDIENTE' | 'CONFIRMADA' | 'DESCARTADA';
export type EstadoRevision = 'POR_REVISAR' | 'REVISADA' | 'REVISADA_AJUSTES';

export interface Llamada {
  idx: number;
  cliente: Cliente;
  rubrica: Rubrica;
  fecha: string;
  hora: string;
  asesor: string;
  titular: string;
  nivel1: string;
  nivel2: string;
  puntos: number;
  posibles: number;
  nota: number | null;
  falta: EstadoFalta | null;
  estado: EstadoRevision;
  revisadoPor: string | null;
  revisadoEn: string | null;
}

export interface Historial {
  antes: Resultado | null;
  despues: Resultado | null;
  motivo: string;
  usuario: string;
  fecha: string;
}

export interface Criterio {
  codigo: string;
  texto: string;
  grupo: string;
  puntos: number;
  admiteNa: boolean;
  resultadoIa: Resultado | null;
  resultado: Resultado | null;
  frase: string | null;
  motivo: string | null;
  historial: Historial | null;
}

export interface Falta {
  numero: number | null;
  texto: string | null;
  frase: string | null;
  motivo: string | null;
  estado: EstadoFalta;
  usuario: string | null;
  fecha: string | null;
}

export interface Cuenta {
  cj: string;
  moneda: string | null;
  optimo: number | null;
  acordado: number | null;
  pagos: number | null;
  llegaAlOptimo: boolean | null;
}

export interface Notas {
  interna: number | null;
  interbank: number | null;
  internaSinFalta: number | null;
  interbankSinFalta: number | null;
}

export interface AudioParte {
  orden: number;
  nombre: string | null;
  anio: string | null;
  mes: string | null;
  dia: string | null;
  duracion: string | null;
  s3Key: string | null;
}

export interface RevisionResumen {
  id: number;
  usuario: string;
  fecha: string;
  ajustes: number;
  criteriosEvaluados: number;
}

export interface Ficha {
  idx: number;
  cliente: Cliente;
  rubrica: Rubrica;
  fecha: string;
  hora: string;
  asesor: string;
  titular: string;
  nivel1: string;
  nivel2: string;
  duracion: number | null;
  cj: string | null;
  resumen: string | null;
  notas: Notas | null;
  falta: Falta | null;
  criterios: Criterio[];
  cuentas: Cuenta[];
  motivoAntes: string | null;
  motivoEnLlamada: string | null;
  tieneTranscripcion: boolean;
  audios: AudioParte[];
  revisiones: RevisionResumen[];
  editable: boolean;
}

export interface Cambio {
  resultado: Resultado;
  motivo: string;
}

/** Lo que manda la pantalla al cerrar: sin criterios es «Revisado». */
export interface Cierre {
  criterios: Record<string, Cambio>;
  falta: 'CONFIRMADA' | 'DESCARTADA' | null;
}

export interface CriterioRendimiento {
  codigo: string;
  texto: string;
  grupo: string;
  puntos: number;
  cumple: number;
  noCumple: number;
  na: number;
}

export interface RubricaRendimiento {
  rubrica: Rubrica;
  llamadas: number;
  criterios: CriterioRendimiento[];
}

export interface Rendimiento {
  asesor: string | null;
  desde: string | null;
  hasta: string | null;
  llamadas: number;
  revisadas: number;
  /** Llamadas con falta crítica pendiente o confirmada; FOH no tiene. */
  faltas: number;
  puntos: number;
  posibles: number;
  asesores: string[];
  rubricas: RubricaRendimiento[];
}

/**
 * Una parte transcrita de la llamada (GET /gestion/historica/audios/{idx}/transcripcion). `tiempos` trae el inicio
 * y fin en el audio de cada línea de `transcripcion` ([audio, inicio_ms, fin_ms]), o null si no se calcularon.
 */
export interface Transcripcion {
  titulo: string;
  transcripcion: string | null;
  tiempos: { audios: string[]; lineas: ([number, number, number] | null)[] } | null;
}
