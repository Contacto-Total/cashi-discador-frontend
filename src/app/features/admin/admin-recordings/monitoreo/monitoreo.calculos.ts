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

/** Con el titular (FOH PDP, FOH CD, IBK titular): 5 puntos con los mismos nombres. */
export const PUNTOS_TITULAR: Punto[] = [
  { clave: 'pres', nombre: 'Presentación' }, { clave: 'emp', nombre: 'Empatía y sondeo' },
  { clave: 'neg', nombre: 'Negociación' }, { clave: 'conf', nombre: 'Confirmación' }, { clave: 'cie', nombre: 'Cierre' }
];
/** Con un tercero (IBK): 3 puntos. */
export const PUNTOS_TERCERO: Punto[] = [
  { clave: 'pres', nombre: 'Presentación' }, { clave: 'ubi', nombre: 'Ubicar al titular' }, { clave: 'cie', nombre: 'Cierre' }
];
export const puntosDe = (rubrica: Rubrica): Punto[] => (rubrica === 'TER' ? PUNTOS_TERCERO : PUNTOS_TITULAR);

/** FOH por criterio: CD tiene los de PDP menos intención de ayudar y lectura del contrato. */
const PUNTO_FOH: Record<string, string> = {
  pres_asert: 'pres', pres_nom_ape: 'pres', orig_llamada: 'pres', motiv_llamada: 'pres',
  intencion_ayuda: 'emp', motiv_no_pago: 'emp',
  opciones_pago: 'neg', beneficio_pago: 'neg', manejo_objec: 'neg', fecha_hora_pago: 'neg',
  confirm_monto: 'conf', confirm_fecha: 'conf', confirm_canal: 'conf',
  lectura_contrato: 'cie', datos_adicionales: 'cie', consec_pago: 'cie'
};
/** IBK titular por pauta. */
const PUNTO_PAUTA: Record<string, string> = { I: 'pres', II: 'emp', VI: 'emp', III: 'neg', IV: 'conf', V: 'cie', VII: 'cie' };
/** IBK tercero por criterio: T3 a T5 ubican al titular. */
const PUNTO_TERCERO: Record<string, string> = { T1: 'pres', T2: 'pres', T6: 'cie' };

/** El punto del gráfico al que pertenece un criterio; null si no entra en ninguno (un criterio propio de una subcartera). */
export function puntoDe(rubrica: Rubrica, c: { codigo: string; grupo: string }): string | null {
  if (rubrica === 'PDP' || rubrica === 'CD') return PUNTO_FOH[c.codigo] ?? null;
  if (rubrica === 'TER') return PUNTO_TERCERO[c.codigo] ?? 'ubi';
  return PUNTO_PAUTA[c.grupo] ?? null;
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
