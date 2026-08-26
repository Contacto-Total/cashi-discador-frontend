/**
 * El contrato de la pestaña Monitoreo. Refleja `MonitoreoCalidadDTO` del backend.
 *
 * Dos reglas que atraviesan todo el archivo y explican por qué hay tantos `| null`:
 *
 * 1. **`cumplimiento` es un porcentaje 0-100, no una fracción.** Los deltas van en
 *    puntos porcentuales, así que `+4` se lee "cuatro puntos mejor que ayer".
 *
 * 2. **`null` no es cero.** Un cumplimiento nulo significa que no hubo un solo
 *    criterio evaluado, y la celda se dibuja VACÍA. Pintar 0% acusaría al asesor
 *    de haberlo hecho mal cuando lo que pasó es que el speech no evaluó ese día.
 *    Lo mismo con los deltas: nulos cuando no hay contra qué comparar.
 */

/**
 * Una subcartera dada de alta en `speech_plantilla_subcartera`.
 *
 * Es lo que llena el desplegable. El filtro viaja por **nombre** y no por id porque
 * la tabla histórica no guarda el id: sus filas traen el nombre escrito, y con más de
 * una forma de escribirlo (`FO_TRAMO_3`, `TRAMO 3`). El backend resuelve esas variantes.
 */
export interface MonitoringSubportfolio {
  id: number;
  /** 'TRAMO 3' — el nombre configurado, que es también el valor del filtro. */
  nombre: string;
  /** La cartera a la que pertenece. Solo informativo. */
  cartera: string | null;
}

export interface MonitoringRequest {
  /**
   * El nombre de la subcartera elegida en la cascada ('Tramo 3'). Obligatorio.
   *
   * El campo se sigue llamando `tramo` por compatibilidad con el contrato ya desplegado;
   * lo que filtra es la SUBCARTERA de la gestión, no su cartera.
   *
   * El backend sigue aceptando 'todos', pero la pantalla ya no lo manda: sin subcartera
   * no hay una sola rúbrica contra la cual puntuar, y la matriz mezclaría dos.
   */
  tramo: string;
  /** 'YYYY-MM-DD' inclusive. */
  desde: string;
  /** 'YYYY-MM-DD' inclusive. */
  hasta: string;
  /** RESULTADO exacto; fija la rúbrica de toda la matriz. Vacío = las dos. */
  resultado?: string;
  /** USUARIOREGISTRA a incluir. Vacío = todos. */
  asesores?: string[];
}

/**
 * Los audios evaluados de un asesor, en sus dos niveles:
 *
 * - **una celda** — se manda `fecha` y devuelve ese día;
 * - **el asesor completo** — se mandan `desde` y `hasta` y devuelve todo el rango.
 *
 * `fecha` gana si viajan las dos cosas. Sin ninguna, el backend responde error:
 * sin ventana la consulta recorrería la tabla entera de producción.
 */
export interface MonitoringDetailRequest {
  tramo: string;
  /** Vacío u omitido = todos los asesores, que es como arranca la card de revisión. */
  asesor?: string;
  fecha?: string;
  desde?: string;
  hasta?: string;
  resultado?: string;
}

/** Un bloque de la rúbrica dentro de una celda. */
export interface MonitoringBlock {
  puntos: number;
  posibles: number;
  cumplimiento: number | null;
}

/** Una celda de la matriz: un asesor, un día. */
export interface MonitoringDay {
  fecha: string;
  audios: number;
  puntos: number;
  posibles: number;
  cumplimiento: number | null;
  /** Claves: 'PRESENTACION' | 'NEGOCIACION' | 'CIERRE'. */
  bloques: Record<string, MonitoringBlock>;
  /** Puntos porcentuales contra el día anterior CON audios. */
  deltaDiaAnterior: number | null;
}

/** Una fila de la matriz. */
export interface MonitoringAgent {
  asesor: string;
  audios: number;
  puntos: number;
  posibles: number;
  cumplimiento: number | null;
  bloques: Record<string, MonitoringBlock>;
  dias: MonitoringDay[];
  /** Puntos porcentuales contra la ventana anterior del mismo largo. */
  deltaSemanaAnterior: number | null;
  /**
   * El mismo cálculo que `MonitoringWeek.criteriosMasFallados`, acotado a este asesor.
   *
   * Viaja por fila para que la card de criterios pueda filtrar por persona sin pedirle
   * nada al servidor. Es lo que permite comparar «lo que más falla X» contra el total
   * del rango teniendo las dos cosas en pantalla a la vez.
   */
  criteriosMasFallados: MonitoringCriterion[];
}

export interface MonitoringCriterion {
  campo: string;
  etiqueta: string;
  seccion: string;
  /** Cuántas evaluaciones midieron este criterio; no es el total de audios. */
  evaluados: number;
  fallados: number;
  pctFalla: number | null;
}

export interface MonitoringTotals {
  asesores: number;
  audios: number;
  puntos: number;
  posibles: number;
  cumplimiento: number | null;
}

export interface MonitoringWeek {
  tramo: string;
  desde: string;
  hasta: string;
  resultado: string | null;
  /** 'PDP' | 'CD', o null si vienen las dos rúbricas mezcladas. */
  rubrica: string | null;
  /** Todos los días del rango, hayan tenido audios o no: son las columnas. */
  dias: string[];
  asesores: MonitoringAgent[];
  totales: MonitoringTotals;
  criteriosMasFallados: MonitoringCriterion[];
  /** true si se alcanzó el tope de filas y la matriz está incompleta. */
  truncado: boolean;
}

/**
 * Un criterio de la evaluación, tal como se ve y se corrige en la ficha del audio.
 *
 * `valor` es 0, 1 o `null` cuando el speech no lo calificó. `ajustado` marca que un
 * supervisor lo corrigió a mano y la pantalla lo muestra como **Modificado**. No dice
 * quién ni cuándo: lo que la etiqueta declara es que una persona revisó ese criterio.
 */
export interface EvaluationCriterion {
  campo: string;
  etiqueta: string;
  seccion: string;
  valor: number | null;
  ajustado: boolean;
}

/**
 * La ficha completa de un audio evaluado.
 *
 * `summary` es el resumen que escribió el modelo y va de solo lectura: es la
 * justificación de las notas, y corregir un criterio sin leerla es corregir a ciegas.
 *
 * `editable` viene en false cuando la escritura hacia producción está deshabilitada
 * en el entorno. La ficha se abre igual; lo único que no aparece es el guardar.
 */
export interface EvaluationDetail {
  idx: number;
  fecha: string;
  hora: string;
  asesor: string;
  documento: string;
  cliente: string;
  telefono: string;
  resultado: string;
  rubrica: string;
  subcartera: string;
  puntos: number;
  posibles: number;
  cumplimiento: number | null;
  summary: string | null;
  tieneTranscripcion: boolean;
  editable: boolean;
  criterios: EvaluationCriterion[];
}

/** La corrección de un supervisor: solo los criterios que cambian. */
export interface AdjustRequest {
  criterios: Record<string, number>;
}

/** Un audio evaluado dentro de una celda. */
export interface MonitoringAudio {
  /** gestion_historica_audios.idx: la llave para transcripción, XLSX y WAV. */
  idx: number;
  /** USUARIOREGISTRA. Se muestra solo cuando la card de revisión está en «Todos». */
  asesor: string;
  fecha: string;
  hora: string;
  documento: string;
  cliente: string;
  telefono: string;
  resultado: string;
  rubrica: string;
  puntos: number;
  posibles: number;
  cumplimiento: number | null;
  /** Uno o varios WAV separados por coma. */
  nombre: string;
  tieneTranscripcion: boolean;
}
