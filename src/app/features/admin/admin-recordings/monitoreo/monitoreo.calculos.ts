import { Criterio, CriterioRendimiento, EstadoFalta, Resultado, Rubrica } from './monitoreo.models';

/**
 * Cálculos de la pestaña Monitoreo que la pantalla rehace al momento: las notas de una llamada mientras la
 * supervisora corrige criterios, y los puntos del gráfico de rendimiento.
 */

/** Pautas de Interbank que entran en su nota (tope 85); VI y VII son internas. */
const PAUTAS_INTERBANK = new Set(['I', 'II', 'III', 'IV', 'V']);
const TOPE_INTERBANK = 85;

export interface NotasCalculadas {
  /** Sobre 100 con todos los criterios; 0 si la falta crítica anula. */
  interna: number | null;
  /** Interbank: pautas I a V sobre 85 en titular; en tercero y FOH es la interna. */
  interbank: number | null;
  /** La nota que tendría sin la falta crítica. */
  sinFalta: number | null;
  cumplidos: number;
  posibles: number;
  anula: boolean;
}

/** La falta crítica anula la nota mientras está pendiente o confirmada. */
export const anulaFalta = (falta: EstadoFalta | null | undefined): boolean =>
  falta === 'PENDIENTE' || falta === 'CONFIRMADA';

/**
 * Notas de una llamada con los resultados que tiene la pantalla (los del speech con las correcciones sin
 * guardar). Misma cuenta que el backend y clientes/ibk/notas.calificar: puntos cumplidos entre los puntos de
 * los criterios que aplican.
 */
export function notas(rubrica: Rubrica, criterios: Criterio[], resultados: Record<string, Resultado | null>,
                      falta: EstadoFalta | null): NotasCalculadas {
  let c = 0, a = 0, ci = 0, ai = 0;
  for (const x of criterios) {
    const r = resultados[x.codigo];
    if (r === 'NA' || r == null) continue;
    a += x.puntos;
    if (r === 'CUMPLE') c += x.puntos;
    if (PAUTAS_INTERBANK.has(x.grupo)) {
      ai += x.puntos;
      if (r === 'CUMPLE') ci += x.puntos;
    }
  }
  const interna = a ? (c / a) * 100 : null;
  const unaNota = rubrica !== 'TIT';
  const interbank = unaNota ? interna : ai ? (ci / ai) * TOPE_INTERBANK : null;
  const anula = anulaFalta(falta);
  return { interna: anula ? 0 : interna, interbank: anula ? 0 : interbank, sinFalta: unaNota ? interna : interbank,
           cumplidos: c, posibles: a, anula };
}

// ------------------------------------------------------------------ puntos del gráfico

export interface Punto { clave: string; nombre: string; }

/**
 * Los puntos del gráfico de cada rúbrica, con los nombres que les da su cliente. Interbank titular: las 5 pautas que
 * califica Interbank (I a V); las internas (VI y VII) no van en el gráfico, sí en los criterios. Interbank tercero:
 * 3 puntos por criterio. FOH (PDP y CD): las 3 secciones de su plantilla, las mismas del monitoreo de PROD.
 */
export const PUNTOS_TITULAR: Punto[] = [
  { clave: 'I', nombre: 'Contacto con el cliente' }, { clave: 'II', nombre: 'Empatizar' },
  { clave: 'III', nombre: 'Negociación y solución' }, { clave: 'IV', nombre: 'Cierre' }, { clave: 'V', nombre: 'Despedida' }
];
/** Con un tercero (IBK): 3 puntos. */
export const PUNTOS_TERCERO: Punto[] = [
  { clave: 'pres', nombre: 'Presentación' }, { clave: 'ubi', nombre: 'Ubicar al titular' }, { clave: 'cie', nombre: 'Cierre' }
];
export const PUNTOS_FOH: Punto[] = [
  { clave: 'pres', nombre: 'Presentación' }, { clave: 'neg', nombre: 'Negociación' }, { clave: 'cie', nombre: 'Cierre' }
];
const esFoh = (rubrica: Rubrica): boolean => rubrica === 'PDP' || rubrica === 'CD';
export const puntosDe = (rubrica: Rubrica): Punto[] => (rubrica === 'TER' ? PUNTOS_TERCERO : esFoh(rubrica) ? PUNTOS_FOH : PUNTOS_TITULAR);
/** Los grupos de «Criterios que más falla»: los puntos del gráfico y, en titular, las pautas internas. */
export const gruposDe = (rubrica: Rubrica): Punto[] => rubrica === 'TIT'
  ? PUNTOS_TITULAR.concat([{ clave: 'VI', nombre: 'Trato al cliente (interna)' }, { clave: 'VII', nombre: 'Registro de la gestión (interna)' }])
  : puntosDe(rubrica);
const NOMBRE_RUB: Record<Rubrica, string> = { TIT: 'Titular', TER: 'Tercero', PDP: 'PDP', CD: 'CD' };
/** El nombre de la rúbrica dentro de una frase: en minúscula, salvo las siglas (PDP, CD). */
export const rubricaEnFrase = (r: Rubrica): string => NOMBRE_RUB[r].length > 3 ? NOMBRE_RUB[r].toLowerCase() : NOMBRE_RUB[r];
/** Las rúbricas de cada cliente, en el orden del selector. */
export const rubricasDe = (rubricas: Rubrica[]): Rubrica[] => rubricas.some(r => esFoh(r)) ? ['PDP', 'CD'] : ['TIT', 'TER'];

/** FOH: la sección de la plantilla (grupo); por campo si no viene, con las mismas secciones de la plantilla de PROD. */
const SECCION_FOH: Record<string, string> = { PRESENTACION: 'pres', NEGOCIACION: 'neg', CIERRE: 'cie' };
const PUNTO_FOH: Record<string, string> = {
  pres_asert: 'pres', pres_nom_ape: 'pres', orig_llamada: 'pres', motiv_llamada: 'pres', intencion_ayuda: 'pres',
  motiv_no_pago: 'neg', manejo_objec: 'neg', opciones_pago: 'neg', beneficio_pago: 'neg', fecha_hora_pago: 'neg',
  lectura_contrato: 'cie', datos_adicionales: 'cie', confirm_monto: 'cie', confirm_fecha: 'cie', confirm_canal: 'cie', consec_pago: 'cie'
};
/** IBK tercero por criterio: T3 a T5 ubican al titular. */
const PUNTO_TERCERO: Record<string, string> = { T1: 'pres', T2: 'pres', T6: 'cie' };

/** El punto (o grupo) al que pertenece un criterio; null si no entra en ninguno (un criterio propio de una subcartera). */
export function puntoDe(rubrica: Rubrica, c: { codigo: string; grupo: string }): string | null {
  if (esFoh(rubrica)) return SECCION_FOH[(c.grupo || '').toUpperCase()] ?? PUNTO_FOH[c.codigo] ?? null;
  if (rubrica === 'TER') return PUNTO_TERCERO[c.codigo] ?? 'ubi';
  return c.grupo || null;
}

export interface PuntoPerfil extends Punto { cumplidos: number; posibles: number; porcentaje: number | null; }

/** El porcentaje de cada punto: puntos cumplidos entre los posibles de sus criterios, sin los NA. */
export function perfil(rubrica: Rubrica, criterios: CriterioRendimiento[]): PuntoPerfil[] {
  return puntosDe(rubrica).map(p => {
    let c = 0, a = 0;
    for (const x of criterios) {
      if (puntoDe(rubrica, x) !== p.clave) continue;
      a += (x.cumple + x.noCumple) * x.puntos;
      c += x.cumple * x.puntos;
    }
    return { ...p, cumplidos: c, posibles: a, porcentaje: a ? (c / a) * 100 : null };
  });
}

/** Un decimal con punto, como el resto del CRM. */
export const pct = (v: number | null | undefined): string => (v == null ? '—' : (Math.round(v * 10) / 10).toFixed(1));
export const pts = (v: number): string => String(Math.round(v * 10) / 10);
