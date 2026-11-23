import { Transcripcion } from './monitoreo.models';

/** Una línea de la transcripción: quién habla, qué dice y dónde empieza en el audio (segundos). */
export interface Linea {
  quien: 'ASESOR' | 'CLIENTE';
  dice: string;
  inicio: number | null;
}

const sinTildes = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const palabras = (s: string): string[] => sinTildes(s).match(/[a-zñ0-9]+/g) ?? [];
const tokens = (s: string): string[] => palabras(s).filter(w => w.length > 2);
const plano = (s: string): string => palabras(s).join(' ');

/**
 * Las líneas de una transcripción guardada. Cada línea es «ASESOR: …» o «CLIENTE: …»; los marcadores
 * «[LLAMADA i de n]» de las gestiones con varias grabaciones se descartan. `tiempos` trae el inicio de
 * cada línea en milisegundos (audios_transcripcion.TIEMPOS); solo cuenta el del primer audio.
 */
export function leerLineas(partes: Transcripcion[]): Linea[] {
  const salida: Linea[] = [];
  for (const parte of partes) {
    const crudas = (parte.transcripcion ?? '').split('\n');
    crudas.forEach((texto, i) => {
      const m = /^\s*(?:\[[^\]]*\]\s*)?(ASESOR|CLIENTE)\s*:\s*(.*)$/.exec(texto);
      if (!m) return;
      const t = parte.tiempos?.lineas?.[i];
      salida.push({ quien: m[1] as Linea['quien'], dice: m[2].trim(), inicio: t && t[0] === 0 ? t[1] / 1000 : null });
    });
  }
  return salida;
}

/**
 * El inicio de cada línea en segundos. Usa los tiempos reales (TIEMPOS) de las líneas que los traen; las que no
 * (una línea que el alineado no pudo ubicar, o de otro audio) se reparten por su largo entre la anterior y la
 * siguiente que sí tienen tiempo. Sin ningún tiempo real, todas se reparten en la duración según su largo.
 */
export function inicios(lineas: Linea[], duracion: number | null): number[] {
  const largo = (l: Linea): number => l.dice.length + 12;
  if (!lineas.some(l => l.inicio != null)) {
    const largos = lineas.map(largo);
    const suma = largos.reduce((a, b) => a + b, 0) || 1;
    const total = duracion || Math.max(10, Math.round(suma / 14));
    let acc = 0;
    return largos.map(n => { const x = (acc / suma) * total; acc += n; return x; });
  }
  const salida = lineas.map(l => l.inicio);
  for (let i = 0; i < salida.length; i++) {
    if (salida[i] != null) continue;
    let j = i;
    while (j < salida.length && salida[j] == null) j++;
    const desde = i > 0 ? salida[i - 1]! : 0;
    const hasta = j < salida.length ? salida[j]! : Math.max(desde, duracion ?? desde);
    // La línea anterior ocupa el comienzo del hueco; las que faltan van detrás, cada una según su largo.
    const previo = i > 0 ? largo(lineas[i - 1]) : 0;
    const largos = lineas.slice(i, j).map(largo);
    const suma = previo + largos.reduce((a, b) => a + b, 0) || 1;
    let acc = previo;
    for (let k = i; k < j; k++) { salida[k] = desde + (hasta - desde) * (acc / suma); acc += largos[k - i]; }
    i = j;
  }
  return salida.map(x => x!);
}
/** La línea que suena en `pos` segundos, o -1 antes de la primera. */
export function lineaEn(ini: number[], pos: number): number {
  let i = -1;
  while (i + 1 < ini.length && ini[i + 1] <= pos + 0.05) i++;
  return i;
}

/**
 * Las líneas que contienen la frase citada por el speech: la ventana de 1 a 3 líneas que más la cubre (desde
 * el 60 % de sus palabras). Una frase de una palabra («Gracias.») va a la línea que la contiene; si hay varias,
 * a la última del asesor.
 */
export function lineasDe(frase: string | null | undefined, lineas: Linea[]): number[] {
  if (!frase || !lineas.length) return [];
  const fr = tokens(frase.replace('…', ''));
  if (fr.length < 2) {
    const objetivo = plano(frase);
    if (!objetivo) return [];
    const cand = lineas.map((l, i) => (` ${plano(l.dice)} `.includes(` ${objetivo} `) ? i : -1)).filter(i => i >= 0);
    const delAsesor = cand.filter(i => lineas[i].quien === 'ASESOR');
    const elegidas = delAsesor.length ? delAsesor : cand;
    return elegidas.length ? [elegidas[elegidas.length - 1]] : [];
  }
  const conj = lineas.map(l => new Set(tokens(l.dice)));
  let mejor: number[] = [], puntaje = 0;
  for (const largo of [1, 2, 3]) {
    for (let i = 0; i + largo <= lineas.length; i++) {
      const vent = new Set<string>();
      for (let k = i; k < i + largo; k++) conj[k].forEach(w => vent.add(w));
      const p = fr.filter(w => vent.has(w)).length / fr.length - 0.04 * (largo - 1);
      if (p > puntaje + 1e-9) { mejor = Array.from({ length: largo }, (_, k) => i + k); puntaje = p; }
    }
  }
  return puntaje >= 0.6 ? mejor : [];
}

/** m:ss */
export const mmss = (s: number): string => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
