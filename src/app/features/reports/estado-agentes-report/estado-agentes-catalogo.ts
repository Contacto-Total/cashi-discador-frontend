/**
 * Catalogo compartido del reporte de estados: colores, columnas, formulas y el armado
 * de la linea de tiempo.
 *
 * Lo usan la pantalla del supervisor (/reports/estado-agentes) y la del asesor
 * (/mis-tiempos). Vive aca para que las dos midan y nombren igual: si alguna vez
 * cambia un grupo o un umbral, se cambia en un solo lugar.
 */
import { ResumenPorAgente, RegistroEstadoDTO } from './estado-agentes-report.service';

export type Vista = 'resumen' | 'cola' | 'fuera' | 'pausas' | 'todo';
export type Grupo = 'jornada' | 'cola' | 'fuera' | 'otras' | 'reunion' | 'pausa' | 'ind';

export interface Col {
  k: string;
  l: string;
  g: Grupo;
  tipo: 'hora' | 'min' | 'pct' | 'ind' | 'comp';
  /** Subtotal del grupo: va en negrita. */
  fuerte?: boolean;
  /** Primera columna del grupo: lleva separador. */
  sep?: boolean;
  v: Vista[];
}

export interface TramoTL {
  left: number;
  width: number;
  /** Color plano, o el rayado de los tramos sin actividad. */
  color: string;
  label: string;
  claro: boolean;
  titulo: string;
  /** Tiempo fuera del sistema: registrado como DESCONECTADO o sin fila en el historial. */
  hueco: boolean;
  duracion: string;
}

export const TODAS: Vista[] = ['resumen', 'cola', 'fuera', 'pausas', 'todo'];

/** Un color por grupo; dentro del grupo, un escalon por estado. */
export const GRUPOS: Record<string, { l: string; color: string }> = {
  cola:    { l: 'En cola',                color: '#2563eb' },
  otras:   { l: 'Otras tareas',           color: '#1baf7a' },
  reunion: { l: 'Reunión y capacitación', color: '#4a3aa7' },
  linea:   { l: 'En línea',               color: '#e87ba4' },
  pausa:   { l: 'Pausas',                 color: '#eda100' }
};

export const ESTADOS: Record<string, { l: string; g: string; c: string; claro?: boolean }> = {
  EN_LLAMADA:       { l: 'Interactuando',       g: 'cola',    c: '#1746a2' },
  TIPIFICANDO:      { l: 'Tipificando',         g: 'cola',    c: '#2563eb' },
  DISPONIBLE:       { l: 'Ocioso',              g: 'cola',    c: '#86b6ef', claro: true },
  EN_MANUAL:        { l: 'Modo Manual',         g: 'cola',    c: '#475569' },
  GESTION_MANUAL:   { l: 'Ocupado',             g: 'otras',   c: '#0f7a55' },
  SEGUIMIENTO:      { l: 'Seguimiento',         g: 'otras',   c: '#1baf7a' },
  WHATSAPP:         { l: 'WhatsApp',            g: 'otras',   c: '#63c9a0', claro: true },
  CONSULTA_TIEMPOS: { l: 'Consulta de tiempos', g: 'otras',   c: '#a3e2c8', claro: true },
  EN_REUNION:       { l: 'Reunión',             g: 'reunion', c: '#4a3aa7' },
  CAPACITACION:     { l: 'Capacitación',        g: 'reunion', c: '#8b7fd1', claro: true },
  EN_LINEA:         { l: 'En línea',            g: 'linea',   c: '#e87ba4' },
  REFRIGERIO:       { l: 'BREAK',               g: 'pausa',   c: '#eda100', claro: true },
  COMIDA:           { l: 'Comida',              g: 'pausa',   c: '#b87a04' },
  SSHH:             { l: 'SSHH',                g: 'pausa',   c: '#f6cf74', claro: true },
  AUSENTE:          { l: 'Ausente',             g: 'pausa',   c: '#8a5c05' },
  SOPORTE:          { l: 'Soporte',             g: 'pausa',   c: '#fae4ae', claro: true },
  // No suma a Conectado y no tiene grupo en el reporte, pero en la linea de tiempo
  // tiene que verse: es el rato que el asesor estuvo fuera del sistema.
  DESCONECTADO:     { l: 'Desconectado',        g: 'desc',    c: '#d8dde3', claro: true }
};

/** Rayado para lo que no es actividad: desconexion registrada o tramo sin registro. */
export const RAYADO = 'repeating-linear-gradient(45deg,#d8dde3,#d8dde3 5px,#f1f3f6 5px,#f1f3f6 10px)';

export const COLS: Col[] = [
  { k: 'entrada', l: 'Entrada',   g: 'jornada', tipo: 'hora', v: ['resumen', 'todo'] },
  { k: 'salida',  l: 'Salida',    g: 'jornada', tipo: 'hora', v: ['resumen', 'todo'] },
  { k: 'con',     l: 'Conectado', g: 'jornada', tipo: 'min', fuerte: true, v: TODAS },
  { k: 'comp',    l: 'Composición de la jornada', g: 'jornada', tipo: 'comp', v: ['resumen', 'todo'] },

  { k: 'cola',  l: 'En cola',       g: 'cola', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'cola', 'todo'] },
  { k: 'inter', l: 'Interactuando', g: 'cola', tipo: 'min', v: ['cola', 'todo'] },
  { k: 'tipi',  l: 'Tipificando',   g: 'cola', tipo: 'min', v: ['cola', 'todo'] },
  { k: 'ocio',  l: 'Ocioso',        g: 'cola', tipo: 'min', v: ['resumen', 'cola', 'todo'] },

  { k: 'fuera', l: 'Fuera de la cola', g: 'fuera', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'fuera', 'todo'] },
  { k: 'linea', l: 'En línea',         g: 'fuera', tipo: 'min', v: ['resumen', 'fuera', 'todo'] },

  { k: 'otras', l: 'Otras tareas',        g: 'otras', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'fuera', 'todo'] },
  { k: 'ocup',  l: 'Ocupado',             g: 'otras', tipo: 'min', v: ['fuera', 'todo'] },
  { k: 'seg',   l: 'Seguimiento',         g: 'otras', tipo: 'min', v: ['fuera', 'todo'] },
  { k: 'wsp',   l: 'WhatsApp',            g: 'otras', tipo: 'min', v: ['fuera', 'todo'] },
  { k: 'cons',  l: 'Consulta de tiempos', g: 'otras', tipo: 'min', v: ['fuera', 'todo'] },

  { k: 'reunion', l: 'Reunión y capacitación', g: 'reunion', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'fuera', 'todo'] },
  { k: 'reu',     l: 'Reunión',                g: 'reunion', tipo: 'min', v: ['fuera', 'todo'] },
  { k: 'capa',    l: 'Capacitación',           g: 'reunion', tipo: 'min', v: ['fuera', 'todo'] },

  { k: 'pausas', l: 'Pausas', g: 'pausa', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'pausas', 'todo'] },
  { k: 'brk',    l: 'BREAK',   g: 'pausa', tipo: 'min', v: ['pausas', 'todo'] },
  { k: 'com',    l: 'Comida',  g: 'pausa', tipo: 'min', v: ['pausas', 'todo'] },
  { k: 'ssh',    l: 'SSHH',    g: 'pausa', tipo: 'min', v: ['pausas', 'todo'] },
  { k: 'aus',    l: 'Ausente', g: 'pausa', tipo: 'min', v: ['pausas', 'todo'] },
  { k: 'sop',    l: 'Soporte', g: 'pausa', tipo: 'min', v: ['pausas', 'todo'] },

  { k: 'prod',   l: 'Productivo',         g: 'ind', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'cola', 'todo'] },
  { k: 'pOcup',  l: '% Ocupación',        g: 'ind', tipo: 'ind', v: ['resumen', 'cola', 'todo'] },
  { k: 'pCola',  l: '% En cola',          g: 'ind', tipo: 'pct', v: ['cola', 'todo'] },
  { k: 'pFuera', l: '% Fuera de la cola', g: 'ind', tipo: 'pct', v: ['fuera', 'todo'] },
  { k: 'pOcio',  l: '% Ocioso',           g: 'ind', tipo: 'ind', v: ['resumen', 'cola', 'todo'] },
  { k: 'pPaus',  l: '% Pausas',           g: 'ind', tipo: 'pct', v: ['resumen', 'pausas', 'todo'] }
];

export function etiquetaGrupo(g: Grupo): string {
  return {
    jornada: 'Jornada', cola: 'En cola', fuera: 'Fuera de la cola', otras: 'Otras tareas',
    reunion: 'Reunión y capacitación', pausa: 'Pausas', ind: 'Indicadores'
  }[g];
}

export function colorGrupo(g: Grupo): string {
  if (g === 'cola') return 'text-[#2563eb]';
  if (g === 'fuera' || g === 'otras' || g === 'reunion') return 'text-[#0e7a55]';
  if (g === 'pausa') return 'text-[#b45309]';
  return 'text-[#334155] dark:text-slate-300';
}

/** Valor numerico de una columna. Los estados sueltos salen del mapa del backend. */
export function numCol(a: ResumenPorAgente, k: string): number {
  const est = (clave: string) => a.segundosPorEstado?.[clave] || 0;
  switch (k) {
    case 'con':     return a.totalSegundosConectado;
    case 'cola':    return a.totalSegundosEnCola;
    case 'inter':   return est('EN_LLAMADA');
    case 'tipi':    return est('TIPIFICANDO');
    case 'ocio':    return a.totalSegundosOcioso;
    case 'fuera':   return a.totalSegundosFueraDeCola;
    case 'linea':   return a.totalSegundosEnLinea;
    case 'otras':   return a.totalSegundosOtrasTareas;
    case 'ocup':    return est('GESTION_MANUAL');
    case 'seg':     return est('SEGUIMIENTO');
    case 'wsp':     return est('WHATSAPP');
    case 'cons':    return est('CONSULTA_TIEMPOS');
    case 'reunion': return a.totalSegundosReunion;
    case 'reu':     return est('EN_REUNION');
    case 'capa':    return est('CAPACITACION');
    case 'pausas':  return a.totalSegundosPausa;
    case 'brk':     return est('REFRIGERIO');
    case 'com':     return est('COMIDA');
    case 'ssh':     return est('SSHH');
    case 'aus':     return est('AUSENTE');
    case 'sop':     return est('SOPORTE');
    case 'prod':    return a.totalSegundosProductivo;
    case 'pOcup':   return a.porcentajeOcupacion;
    case 'pCola':   return a.porcentajeEnCola;
    case 'pFuera':  return a.porcentajeFueraDeCola;
    case 'pOcio':   return a.porcentajeOcioso;
    case 'pPaus':   return a.porcentajePausas;
    default:        return 0;
  }
}

/** Misma regla que formatSegundos del backend, para que no convivan dos formatos. */
export function formatSeg(seg: number | undefined): string {
  if (!seg) return '0s';
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  const s = seg % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/** Denominador 0 o negativo devuelve 0, no infinito. Misma regla que el backend. */
export function pctSeguro(parte: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((parte / total) * 10000) / 100;
}

export function textoCol(a: ResumenPorAgente, c: Col): string {
  if (c.tipo === 'hora') return (c.k === 'entrada' ? a.horaEntrada : a.horaSalida) || '—';
  if (c.tipo === 'pct') return numCol(a, c.k) + '%';
  const seg = numCol(a, c.k);
  return seg ? formatSeg(seg) : '—';
}

/** Reparto del tiempo conectado entre los cinco grupos, para la barra de la fila. */
export function composicion(a: ResumenPorAgente): { k: string; pct: number; color: string; titulo: string }[] {
  const con = a.totalSegundosConectado || 1;
  const partes = [
    { k: 'cola',    v: a.totalSegundosEnCola,      g: 'cola' },
    { k: 'otras',   v: a.totalSegundosOtrasTareas, g: 'otras' },
    { k: 'reunion', v: a.totalSegundosReunion,     g: 'reunion' },
    { k: 'linea',   v: a.totalSegundosEnLinea,     g: 'linea' },
    { k: 'pausa',   v: a.totalSegundosPausa,       g: 'pausa' }
  ];
  return partes.filter(p => p.v > 0).map(p => ({
    k: p.k,
    pct: p.v / con * 100,
    color: GRUPOS[p.g].color,
    titulo: `${GRUPOS[p.g].l}: ${formatSeg(p.v)} (${Math.round(p.v / con * 100)}%)`
  }));
}

export function desglose(a: ResumenPorAgente):
    { g: string; l: string; color: string; total: number; filas: { l: string; v: number }[] }[] {
  const est = (k: string) => a.segundosPorEstado?.[k] || 0;
  return [
    { g: 'cola', l: GRUPOS['cola'].l, color: GRUPOS['cola'].color, total: a.totalSegundosEnCola,
      filas: [{ l: 'Interactuando', v: est('EN_LLAMADA') }, { l: 'Tipificando', v: est('TIPIFICANDO') },
              { l: 'Ocioso', v: a.totalSegundosOcioso }] },
    { g: 'otras', l: GRUPOS['otras'].l, color: GRUPOS['otras'].color, total: a.totalSegundosOtrasTareas,
      filas: [{ l: 'Ocupado', v: est('GESTION_MANUAL') }, { l: 'Seguimiento', v: est('SEGUIMIENTO') },
              { l: 'WhatsApp', v: est('WHATSAPP') }, { l: 'Consulta de tiempos', v: est('CONSULTA_TIEMPOS') }] },
    { g: 'reunion', l: GRUPOS['reunion'].l, color: GRUPOS['reunion'].color, total: a.totalSegundosReunion,
      filas: [{ l: 'Reunión', v: est('EN_REUNION') }, { l: 'Capacitación', v: est('CAPACITACION') }] },
    { g: 'pausa', l: GRUPOS['pausa'].l, color: GRUPOS['pausa'].color, total: a.totalSegundosPausa,
      filas: [{ l: 'BREAK', v: est('REFRIGERIO') }, { l: 'Comida', v: est('COMIDA') }, { l: 'SSHH', v: est('SSHH') },
              { l: 'Ausente', v: est('AUSENTE') }, { l: 'Soporte', v: est('SOPORTE') }] }
  ];
}

// ==================== UMBRALES ====================
/**
 * Ocupacion: la banda bajo a 55/40 desde que Productivo dejo de incluir la gestion
 * manual. Ocioso va al reves y mide al discador, no al asesor.
 */
export function colorOcupacion(p: number): string {
  return p >= 55 ? 'text-[#15803d]' : p >= 40 ? 'text-[#b45309]' : 'text-[#b91c1c]';
}
export function fondoOcupacion(p: number): string {
  return 'block h-full rounded-full ' + (p >= 55 ? 'bg-[#16a34a]' : p >= 40 ? 'bg-[#d97706]' : 'bg-[#dc2626]');
}
export function colorOcioso(p: number): string {
  return p <= 25 ? 'text-[#15803d]' : p <= 40 ? 'text-[#b45309]' : 'text-[#b91c1c]';
}
export function fondoOcioso(p: number): string {
  return 'block h-full rounded-full ' + (p <= 25 ? 'bg-[#16a34a]' : p <= 40 ? 'bg-[#d97706]' : 'bg-[#dc2626]');
}

// ==================== LINEA DE TIEMPO ====================
/** Segundos desde medianoche -> HH:mm. */
export function hhmm(seg: number): string {
  const m = Math.floor(seg / 60);
  return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}

/** Con segundos: un tramo de 8s empieza y termina en el mismo minuto. */
export function hhmmss(seg: number): string {
  return hhmm(seg) + ':' + String(Math.floor(seg) % 60).padStart(2, '0');
}

/**
 * "yyyy-MM-dd HH:mm:ss" -> segundos desde medianoche. Otro dia se recorta al borde.
 *
 * En segundos y no en minutos: probar un estado o un microcorte dura menos de un
 * minuto, y al truncar esos tramos quedaban con inicio igual a fin y desaparecian
 * del dibujo aunque el historial si los tuviera.
 */
function segundosDe(ts: string | null, dia: string): number | null {
  if (!ts || ts.length < 19) return null;
  const fecha = ts.slice(0, 10);
  if (fecha < dia) return 0;
  if (fecha > dia) return 24 * 3600 - 1;
  return +ts.slice(11, 13) * 3600 + +ts.slice(14, 16) * 60 + +ts.slice(17, 19);
}

export interface TramoCrudo { ini: number; fin: number; estado: string; }

export function tramosDeAgente(registros: RegistroEstadoDTO[], idUsuario: number, dia: string): TramoCrudo[] {
  return registros
    .filter(r => r.idUsuario === idUsuario)
    .map(r => ({
      ini: segundosDe(r.timestampInicio, dia),
      fin: segundosDe(r.timestampFin, dia),
      estado: r.estadoNuevo
    }))
    .filter((r): r is TramoCrudo => r.ini !== null && r.fin !== null && r.fin > r.ini && !!ESTADOS[r.estado])
    .sort((x, y) => x.ini - y.ini);
}

/**
 * Ventana del dibujo: del primer tramo al ultimo, exacta. Antes se redondeaba a la hora
 * en punto y una jornada de 50 minutos se dibujaba dentro de dos horas, encogiendo todo.
 */
export function ventanaDe(tramos: TramoCrudo[]): { desde: number; hasta: number } {
  if (!tramos.length) return { desde: 0, hasta: 0 };
  const desde = tramos[0].ini;
  const hasta = Math.max(...tramos.map(x => x.fin));
  return { desde, hasta: Math.max(hasta, desde + 60) };
}

/**
 * Dibujo de la jornada. Ademas de los tramos, marca lo que NO tiene actividad:
 *   - DESCONECTADO: el asesor salio y volvio, y el sistema lo registro con inicio y fin.
 *   - Sin registro: no hay fila en el historial. Pasa con el tramo que sigue abierto
 *     (no se escribe hasta que cambie de estado) o si el historial quedo incompleto.
 * Si quedaran en blanco no se distinguirian de un error de dibujo.
 */
export function construirLinea(tramos: TramoCrudo[], desde: number, hasta: number): TramoTL[] {
  const largo = hasta - desde;
  if (largo <= 0) return [];

  const pieza = (ini: number, fin: number, label: string, color: string,
                 claro: boolean, hueco: boolean, nota = ''): TramoTL => ({
    left: (ini - desde) / largo * 100,
    width: (fin - ini) / largo * 100,
    color, label, claro, hueco,
    duracion: formatSeg(fin - ini),
    // Con segundos a la vista: un tramo corto empieza y termina en el mismo minuto
    titulo: `${label} · ${hhmmss(ini)} – ${hhmmss(fin)} · ${formatSeg(fin - ini)}${nota}`
  });

  const out: TramoTL[] = [];
  let cursor: number | null = null;

  for (const s of tramos) {
    if (cursor !== null && s.ini > cursor) {
      out.push(pieza(cursor, s.ini, 'Sin registro', RAYADO, true, true,
        ' · el historial no tiene ninguna fila en ese rango'));
    }
    const e = ESTADOS[s.estado];
    const esDesc = s.estado === 'DESCONECTADO';
    out.push(pieza(s.ini, s.fin, e.l, esDesc ? RAYADO : e.c, !!e.claro, esDesc));
    cursor = Math.max(cursor ?? 0, s.fin);
  }
  return out;
}

/**
 * Marcas del eje. El paso sale del largo real de la jornada y del zoom, apuntando a unas
 * seis marcas por pantalla: sirve igual para un dia de 10 horas que para uno de 50 minutos.
 */
const ESCALA_EJE = [15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200];

export function ejeHoras(desde: number, hasta: number, zoom: number): { left: number; l: string }[] {
  const largo = hasta - desde;
  if (largo <= 0) return [];

  const ideal = largo / (6 * zoom);
  const paso = ESCALA_EJE.find(p => p >= ideal) ?? ESCALA_EJE[ESCALA_EJE.length - 1];
  const primero = Math.ceil(desde / paso) * paso;

  const out: { left: number; l: string }[] = [];
  for (let s = primero; s <= hasta; s += paso) {
    out.push({ left: (s - desde) / largo * 100, l: paso < 60 ? hhmmss(s) : hhmm(s) });
  }
  return out;
}
