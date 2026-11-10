import { AsistenciaDia } from '../asistencia.models';
import { TonoPill } from './clases';
import { enCurso } from './semana-celdas';

const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/**
 * La píldora de un día, igual para el asesor y para RR.HH.: con marcas que faltan es incompleto; el día
 * no laborable o justificado dice su tipo; hoy, mientras no sale, está en curso.
 */
export function estadoDia(d: AsistenciaDia): [string, TonoPill] {
  if (enCurso(d)) {
    return ['En curso', 'neu'];
  }
  if (d.estado === 'INCOMPLETO' || ((d.estado === 'PUNTUAL' || d.estado === 'TARDE') && (d.marcasFaltantes ?? []).length)) {
    return ['Incompleto', 'am'];
  }
  switch (d.estado) {
    case 'PUNTUAL': return ['Puntual', 'ok'];
    case 'TARDE': return ['Tarde', 'am'];
    case 'FALTA': return ['Falta', 'ro'];
    case 'JUSTIFICADO': return [d.tipoDia ?? 'Justificado', 'info'];
    default: return [d.tipoDia ?? 'No laborable', 'neu'];
  }
}

/**
 * Lo que la tabla no dice de las horas del día: la solicitud que lo cubre y lo que queda por recuperar,
 * o lo que debe si no pidió nada.
 */
export function notaDia(d: AsistenciaDia): string | null {
  const enRevision = (e?: string | null) => e === 'PENDIENTE' || e === 'REVISADA';
  if (d.solicitud && enRevision(d.estadoSolicitud)) {
    return `${d.solicitud} en revisión`;
  }
  if (d.solicitud && d.estadoSolicitud === 'APROBADA' && d.estado !== 'JUSTIFICADO') {
    return d.minutosDeuda ? `${d.solicitud} · debe ${enHoras(d.minutosDeuda)}` : d.solicitud;
  }
  if (d.minutosDebe) {
    return `Debe ${enHoras(d.minutosDebe)}`;
  }
  if (enRevision(d.estadoTeletrabajo)) {
    return 'Teletrabajo en revisión';
  }
  if (d.estadoTeletrabajo === 'APROBADA' && d.remotoDesde && d.minutosDeuda) {
    return `Teletrabajo · debe ${enHoras(d.minutosDeuda)}`;
  }
  return null;
}

/** El tono de la cinta de días de cada estado. */
export function tonoCinta(d: AsistenciaDia): 'ok' | 'am' | 'ro' | 'info' | 'neu' {
  if (enCurso(d)) return 'neu';
  const faltan = (d.marcasFaltantes ?? []).length > 0;
  if (faltan || d.estado === 'INCOMPLETO' || d.estado === 'TARDE') return d.estado === 'FALTA' ? 'ro' : 'am';
  return d.estado === 'PUNTUAL' ? 'ok' : d.estado === 'FALTA' ? 'ro' : d.estado === 'JUSTIFICADO' ? 'info' : 'neu';
}
