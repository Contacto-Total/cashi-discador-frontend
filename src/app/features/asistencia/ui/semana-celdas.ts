import { AsistenciaDia } from '../asistencia.models';
import { hoy } from '../asistencia.estilos';
import { DIAS_LARGOS } from './solicitud-clases';

/**
 * La semana de cada persona en una fila, como en las tablas de Equipo, Reporte y Cierre: una casilla por
 * día con sus horas. Solo lleva color lo que no fue normal; con alto de sobra, la casilla muestra también
 * las marcas y el estado.
 */
export interface Casilla {
  fecha: string;
  tono: '' | 'am' | 'ro' | 'info' | 'neu' | 'libre';
  cifra: string;
  marcas: string;
  estado: string;
  titulo: string;
  hoy: boolean;
  /** Le faltan marcas de pausa: desde Cierre se puede ir a corregirlas. */
  sinPausa: boolean;
}

const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const hhmm = (h: string): string => h.slice(0, 5);
const corta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}`;
export const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/** «Lun 02»: la cabecera de cada día. */
export function diaCorto(fecha: string): string {
  return `${DIAS_CORTOS[new Date(fecha + 'T00:00:00').getDay()]} ${fecha.slice(8, 10)}`;
}

/** Lunes a viernes, y el sábado solo si alguien marcó. */
export function diasDeLaSemana(lunes: string, dias: AsistenciaDia[], sumar: (f: string, n: number) => string): string[] {
  const sabado = sumar(lunes, 5);
  return [0, 1, 2, 3, 4, 5].map(i => sumar(lunes, i)).filter(f => f !== sabado || dias.some(d => d.fecha === sabado && !!d.entrada));
}

/** Hoy, con entrada y sin salida: todavía no se juzga. */
export function enCurso(d: AsistenciaDia): boolean {
  return d.fecha === hoy() && !!d.entrada && !d.salida;
}

export function casillaDe(fecha: string, d: AsistenciaDia | undefined): Casilla {
  const hoyTexto = hoy(), esHoy = fecha === hoyTexto, nombreDia = `${DIAS_LARGOS[new Date(fecha + 'T00:00:00').getDay()]} ${corta(fecha)}`;
  if (fecha > hoyTexto || !d) {
    return { fecha, tono: 'libre', cifra: '—', marcas: '', estado: '', titulo: nombreDia, hoy: esHoy, sinPausa: false };
  }
  const curso = enCurso(d);
  const pausas = (d.marcasFaltantes ?? []).filter(m => /^(ALMUERZO|BREAK)_/.test(m));
  const sinPausa = !!d.entrada && !curso && pausas.length > 0;
  const faltan = [...new Set(pausas.map(m => m.startsWith('BREAK') ? 'break' : 'almuerzo'))];
  const e = d.estado;
  const tono: Casilla['tono'] = sinPausa || e === 'INCOMPLETO' || e === 'TARDE' ? 'am' : e === 'FALTA' ? 'ro'
    : e === 'JUSTIFICADO' ? 'info' : e === 'NO_LABORABLE' ? 'neu' : '';
  const cifra = d.minutosTrabajados != null ? enHoras(d.minutosTrabajados) : curso ? 'En curso' : e === 'FALTA' ? 'Falta'
    : e === 'JUSTIFICADO' ? (d.tipoDia || 'Justificado') : e === 'INCOMPLETO' ? 'Incompleto' : e === 'NO_LABORABLE' ? (d.tipoDia || 'No laborable') : '—';
  const rem = d.minutosRemotos ?? 0;
  const estado = curso ? '' : sinPausa ? 'Sin ' + faltan.join(' ni ') : e === 'TARDE' ? `Tarde ${enHoras(d.minutosTardanza ?? 0)}`
    : rem ? ((d.minutosPresenciales ?? 0) ? `Remoto ${enHoras(rem)}` : 'Remoto')
    : { PUNTUAL: 'Puntual', FALTA: 'Falta', INCOMPLETO: 'Incompleto', JUSTIFICADO: 'Justificado', NO_LABORABLE: 'No laborable', TARDE: 'Tarde' }[e];
  const marcas = !d.entrada ? '' : d.salida ? `${hhmm(d.entrada)} – ${hhmm(d.salida)}` : `Entró ${hhmm(d.entrada)}`;
  return { fecha, tono, cifra, marcas, estado, hoy: esHoy, sinPausa, titulo: `${nombreDia}: ${curso ? 'En curso' : estado}${marcas ? ', ' + marcas : ''}` };
}

const TONO: Record<Casilla['tono'], string> = {
  '': 'text-foreground', am: 'bg-(--am-bg) text-(--am)', ro: 'bg-(--ro-bg) text-(--ro)', info: 'bg-(--info-bg) text-(--info)',
  neu: 'text-muted-foreground', libre: 'text-muted-foreground'
};
const BORDE: Record<string, string> = { am: 'border-(--am-ln)', ro: 'border-(--ro-ln)', info: 'border-(--info-ln)', libre: 'border-dashed border-(--line2)' };

/** La casilla: cápsula con la cifra; ampliada, ocupa la celda con borde y deja ver las marcas. */
export function claseCasilla(c: Casilla, amplia: boolean, irA = false): string {
  const borde = amplia ? ' w-full border border-solid ' + (BORDE[c.tono] ?? 'border-(--line2)') : '';
  return `${amplia ? 'flex' : 'inline-flex'} min-w-[3.75rem] flex-col items-center justify-center gap-px rounded-[.5rem] px-[.375rem] py-[.3125rem] text-[.8125rem] leading-[1.2] whitespace-nowrap tabular-nums `
    + TONO[c.tono] + (c.hoy ? ' shadow-[inset_0_0_0_1px_var(--border)]' : '') + borde
    + (irA ? ' cursor-pointer hover:shadow-[inset_0_0_0_1px_var(--am-pt)]' : '');
}

/** Segunda línea de una casilla, solo cuando las filas tienen alto de sobra. */
export const EXT = 'block text-[.6875rem] leading-[1.3] text-muted-foreground';
