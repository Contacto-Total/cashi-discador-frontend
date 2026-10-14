/**
 * Reglas que comparten la pantalla de reportes entregables y su mantenimiento:
 * cuándo toca un entregable, qué periodo saca y cómo se arma su nombre.
 *
 * Los días de la semana van como en la base: 1 = lunes ... 7 = domingo.
 */
import type { Entregable, FechaNombre, PeriodoProgramado, TipoPeriodo } from './entregables-report.service';

export const MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
export const MESES_ABR = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DIC'];
const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const DIAS_ABR = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

/** Lo que hace falta para saber cuándo toca. Lo cumplen el entregable y el borrador del formulario. */
export type Programacion = Pick<Entregable, 'repeticion' | 'diasSemana' | 'diaMes'>;

export const TEXTO_PERIODO: Record<PeriodoProgramado, string> = {
  SIN: 'Sin fechas',
  DIA: 'El día de hoy',
  MES_HOY: 'Del 1 del mes a hoy',
  MES_AYER: 'Del 1 del mes hasta ayer',
  MES_ANT: 'El mes anterior completo'
};

// ==================== Fechas ====================

const dos = (n: number): string => String(n).padStart(2, '0');

/** Hoy a medianoche, en la hora de la máquina (Perú). */
export function hoyLocal(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function aIso(d: Date): string {
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

export function deIso(texto: string | null | undefined): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}

export function dmy(d: Date): string {
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function sumarDias(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function inicioDeMes(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** 1 = lunes ... 7 = domingo. */
export function diaIso(d: Date): number {
  return ((d.getDay() + 6) % 7) + 1;
}

export function nombreDia(d: Date): string {
  return DIAS[diaIso(d) - 1];
}

/** "lun 19/10" */
export function diaCorto(d: Date): string {
  return `${DIAS_ABR[diaIso(d) - 1]} ${dos(d.getDate())}/${dos(d.getMonth() + 1)}`;
}

/** "09:00" -> "9:00 am" */
export function horaTexto(hora: string | null | undefined): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(hora || '');
  if (!m) return '';
  const h = +m[1];
  return `${((h + 11) % 12) + 1}:${m[2]} ${h < 12 ? 'am' : 'pm'}`;
}

// ==================== Programación ====================

export function tocaEn(p: Programacion, d: Date): boolean {
  if (p.repeticion === 'DIARIO' || p.repeticion === 'SEMANAL') {
    return (p.diasSemana || []).includes(diaIso(d));
  }
  if (p.repeticion === 'MENSUAL') {
    // En un mes más corto que el día configurado, cae el último día.
    const ultimo = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return d.getDate() === Math.min(p.diaMes || 1, ultimo);
  }
  return false;
}

/** La próxima fecha en que toca, sin contar hoy. null si es a pedido. */
export function proximaFecha(p: Programacion, hoy: Date): Date | null {
  if (p.repeticion === 'PEDIDO') return null;
  for (let i = 1; i <= 62; i++) {
    const d = sumarDias(hoy, i);
    if (tocaEn(p, d)) return d;
  }
  return null;
}

export function resumenRepeticion(p: Programacion): string {
  if (p.repeticion === 'PEDIDO') return 'A pedido';
  if (p.repeticion === 'MENSUAL') return `Mensual · día ${p.diaMes || 1}`;
  const dias = [...(p.diasSemana || [])].sort((a, b) => a - b);
  const lista = dias.map(d => DIAS_ABR[d - 1]).join(', ');
  if (p.repeticion === 'DIARIO') {
    if (dias.length === 7) return 'Diario';
    if (dias.join('') === '123456') return 'Diario · lun a sáb';
    if (dias.join('') === '12345') return 'Diario · lun a vie';
    return `Diario · ${lista}`;
  }
  return dias.length === 1 ? `Semanal · ${DIAS[dias[0] - 1]}` : `Semanal · ${lista}`;
}

// ==================== Periodo ====================

/** Los periodos programados que tienen sentido para cada tipo de consulta. */
export function periodosDe(tipo: TipoPeriodo): PeriodoProgramado[] {
  if (tipo === 'SIN') return ['SIN'];
  if (tipo === 'DIA') return ['DIA'];
  return ['MES_HOY', 'MES_AYER', 'MES_ANT'];
}

export function rangoProgramado(periodo: PeriodoProgramado, hoy: Date): { desde: Date | null; hasta: Date | null } {
  switch (periodo) {
    case 'DIA':
      return { desde: hoy, hasta: hoy };
    case 'MES_HOY':
      return { desde: inicioDeMes(hoy), hasta: hoy };
    case 'MES_AYER': {
      const ayer = sumarDias(hoy, -1);
      return { desde: inicioDeMes(ayer), hasta: ayer };
    }
    case 'MES_ANT': {
      const fin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
      return { desde: inicioDeMes(fin), hasta: fin };
    }
    default:
      return { desde: null, hasta: null };
  }
}

// ==================== Nombre del archivo y asunto ====================

/** [MES_ABR] y [MES_NOMBRE] se resuelven antes que [MES] para que no se pisen. */
export function resolverPatron(patron: string | null | undefined, fecha: Date): string {
  const cambios: [string, string][] = [
    ['[DIA]', dos(fecha.getDate())],
    ['[MES_ABR]', MESES_ABR[fecha.getMonth()]],
    ['[MES_NOMBRE]', MESES[fecha.getMonth()]],
    ['[MES]', dos(fecha.getMonth() + 1)],
    ['[ANIO]', String(fecha.getFullYear())]
  ];
  let texto = patron || '';
  for (const [comodin, valor] of cambios) {
    texto = texto.split(comodin).join(valor);
  }
  return texto;
}

/** La fecha que va en el nombre: la de hoy, o la del corte (el Hasta de lo consultado). */
export function fechaDelNombre(fechaNombre: FechaNombre, hasta: Date | null, hoy: Date): Date {
  return fechaNombre === 'HOY' || !hasta ? hoy : hasta;
}

// ==================== Texto ====================

/** Sin tildes ni mayúsculas: para cruzar un título de columna con el que viene del procedimiento. */
export function normalizar(texto: string | null | undefined): string {
  return (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
