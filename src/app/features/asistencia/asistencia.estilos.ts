import { EstadoAsistencia } from './asistencia.models';

/**
 * Las clases que comparten las pantallas de asistencia.
 *
 * Están aquí y no repetidas en cada componente porque son los tokens de Cashi
 * —los mismos de Gestión de Tenores—, y si cada pantalla se los copia, a la
 * tercera edición el alto de los controles deja de coincidir entre tabs.
 *
 * Van como hex crudo con `!` porque el CSS global gana a Tailwind en este
 * proyecto.
 */
export const ESTILOS = {
  etiqueta: 'text-xs font-semibold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  campo: 'h-[38px] w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] text-[13px] !text-[#0f172a] placeholder:text-[#8491a3] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100 dark:placeholder:text-slate-500',
  area: 'w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] py-2 text-[13px] !text-[#0f172a] placeholder:text-[#8491a3] focus:!border-[#2563eb] focus:outline-none dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100',
  botonSecundario: 'inline-flex h-[38px] items-center gap-[7px] rounded-lg border border-[#8491a3] bg-white px-3.5 text-[13px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  // El primario de Cashi es el oscuro; el azul queda para foco y enlaces.
  botonPrimario: 'inline-flex h-[38px] items-center gap-[7px] rounded-lg bg-[#0f172a] px-3.5 text-[13px] font-semibold !text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:!text-[#0f172a] dark:hover:bg-slate-200',
  /** El botón pequeño de las filas de una tabla, con su texto: el icono solo no dice qué hace. */
  botonChico: 'inline-flex h-[30px] items-center gap-[5px] rounded-lg border border-[#8491a3] bg-white px-[11px] text-[12px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  botonIcono: 'inline-flex h-[30px] min-w-[30px] items-center justify-center rounded-[7px] border border-[#e6e9ee] bg-white !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-default disabled:opacity-45 dark:border-slate-700 dark:bg-slate-800 dark:!text-slate-200',
  th: 'whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  td: 'whitespace-nowrap px-3 py-2 text-[12.5px] tabular-nums',
  tarjeta: 'flex min-w-0 flex-col rounded-xl border border-[#e6e9ee] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900',
  rotulo: 'text-[11.5px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  cifra: 'text-2xl font-extrabold leading-[1.3] tracking-[-0.02em] tabular-nums',
  unidad: 'ml-1 text-xs font-semibold text-[#5f6c80] dark:text-slate-400',
  pie: 'mt-auto pt-1.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400',
  // Todos los objetos visuales viven en una banda del mismo alto: así la línea
  // horizontal es la misma en las cuatro tarjetas.
  banda: 'mt-3.5 flex h-[26px] items-center',
  icono: 'flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#f1f3f6] text-[#0f172a] dark:bg-slate-800 dark:text-slate-100',
  titulo: 'mb-2.5 text-[13.5px] font-extrabold tracking-[-0.01em]',
  panel: 'overflow-x-auto rounded-xl border border-[#e6e9ee] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900',
  vacio: 'rounded-xl border border-[#e6e9ee] bg-white py-14 text-center dark:border-slate-800 dark:bg-slate-900',

  // La cápsula de pestañas: el activo es una píldora oscura dentro de un marco
  // redondeado. Es la forma que tiene el resto del módulo, no un subrayado.
  segmentos: 'inline-flex gap-0.5 rounded-full border border-[#e6e9ee] bg-white p-[3px] dark:border-slate-700 dark:bg-slate-900',
  tab: 'inline-flex h-[30px] items-center gap-[7px] whitespace-nowrap rounded-full px-3.5 text-[12.5px] font-semibold transition-colors',
  tabApagada: '!text-[#5f6c80] hover:!text-[#0f172a] dark:!text-slate-400 dark:hover:!text-slate-100',
  tabActiva: 'bg-[#0f172a] !text-white dark:bg-white dark:!text-[#0f172a]',
  cuenta: 'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums',
  cuentaApagada: 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400',
  cuentaActiva: 'bg-white/20 text-white dark:bg-[#0f172a]/20 dark:text-[#0f172a]',

  /** El separador entre los tres niveles del ámbito, alineado con los campos. */
  flechaAmbito: 'flex h-[38px] items-center self-end text-[15px] text-[#8491a3] dark:text-slate-500',

  /** La etiqueta de rol junto al nombre. */
  rolSupervisor: 'inline-block rounded-full border border-[#c7d5fb] bg-[#eef2ff] px-2 py-[1px] text-[11px] font-bold text-[#1e40af] dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300',
  rolAsesor: 'inline-block rounded-full border border-[#d5dbe3] bg-[#eef2f7] px-2 py-[1px] text-[11px] font-bold text-[#334155] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
} as const;

/** Los mismos nombres de la leyenda que RR.HH. ya usa en su hoja. */
export const ESTADOS: Record<EstadoAsistencia, { texto: string; clase: string }> = {
  PUNTUAL: { texto: 'Puntual', clase: 'bg-[#e8f5ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300' },
  TARDE: { texto: 'Tarde', clase: 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300' },
  FALTA: { texto: 'Falta', clase: 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300' },
  INCOMPLETO: { texto: 'Incompleto', clase: 'bg-[#fdeee0] text-[#c2410c] dark:bg-orange-950/50 dark:text-orange-300' },
  JUSTIFICADO: { texto: 'Justificado', clase: 'bg-[#eef2ff] text-[#3730a3] dark:bg-indigo-950/50 dark:text-indigo-300' },
  NO_LABORABLE: { texto: 'No laborable', clase: 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400' }
};

/** El recorrido de una justificación, dicho como lo entiende quien la mira. */
export const ESTADO_SOLICITUD: Record<string, { texto: string; clase: string }> = {
  PENDIENTE: { texto: 'Por revisar', clase: 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300' },
  REVISADA: { texto: 'En RR.HH.', clase: 'bg-[#eef2ff] text-[#3730a3] dark:bg-indigo-950/50 dark:text-indigo-300' },
  APROBADA: { texto: 'Aprobada', clase: 'bg-[#e8f5ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300' },
  RECHAZADA: { texto: 'Rechazada', clase: 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300' }
};

/** La fila pintada, que sustituyó al círculo de color: se lee de un vistazo. */
export const FILA_SOLICITUD: Record<string, string> = {
  PENDIENTE: 'bg-[#fffdf5] dark:bg-amber-950/20',
  REVISADA: 'bg-[#f8f9ff] dark:bg-indigo-950/20',
  APROBADA: '',
  RECHAZADA: ''
};

/** La duración sin unidad: «43 h 57», «38». Una duración no es una hora de reloj. */
export function duracionCorta(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h && m ? `${h} h ${m}` : h ? `${h} h` : `${m}`;
}

export function unidadDe(minutos: number): string {
  return minutos >= 60 && minutos % 60 === 0 ? '' : 'min';
}

/** Lo mismo pero dicho entero: «9 h 30 min», no «09:30». */
export function enDuracion(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h && m ? `${h} h ${m} min` : h ? `${h} h` : `${m} min`;
}

/** «01:23» a minutos: el reporte da las duraciones ya formateadas. */
export function aMinutos(hhmm: string | null | undefined): number {
  if (!hhmm || !hhmm.includes(':')) {
    return 0;
  }
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Los tipos que se marcan en el calendario para todo un ámbito. No son de una
 * persona, así que no salen al registrar una justificación.
 */
export const TIPOS_DE_CALENDARIO = ['FERIADO', 'NO_LABORABLE', 'SIN_ASIGNACION'];

/**
 * El primer día que se puede pedir un tipo: hoy más su anticipación. Sin
 * anticipación —un descanso médico, que llega sin aviso— vale cualquier fecha.
 */
export function primerDiaPermitido(tipo: { diasAnticipacion: number | null } | null): string | null {
  return tipo?.diasAnticipacion != null ? sumarDias(hoy(), tipo.diasAnticipacion) : null;
}

/** El aviso cuando la fecha llega tarde para ese tipo; el mismo texto que el backend. */
export function avisoAnticipacion(tipo: { nombre: string; diasAnticipacion: number | null }): string {
  const dias = tipo.diasAnticipacion ?? 0;
  return `${tipo.nombre} se registra con ${dias === 1 ? 'un día' : dias + ' días'} de anticipación`;
}

/**
 * Qué límite de tardanza pasó la semana. El módulo es de asistencia: no habla
 * de bonos, dice qué límite se excedió y el resto lo decide RR.HH.
 */
export function textoLimite(s: { superoToleranciaDiaria: boolean; superoToleranciaSemanal: boolean }): string {
  if (s.superoToleranciaDiaria && s.superoToleranciaSemanal) {
    return 'Límite diario y semanal excedidos';
  }
  if (s.superoToleranciaDiaria) {
    return 'Límite diario excedido';
  }
  return s.superoToleranciaSemanal ? 'Límite semanal excedido' : 'Dentro del límite';
}

export function hoy(): string {
  return fechaTexto(new Date());
}

export function lunesDe(fecha: Date): string {
  const copia = new Date(fecha);
  copia.setDate(copia.getDate() - ((copia.getDay() + 6) % 7));
  return fechaTexto(copia);
}

/**
 * El sábado de la semana de una fecha: el final del rango que se mira.
 *
 * Va hasta el sábado y no hasta hoy porque la semana se revisa entera —el mapa
 * y la curva necesitan sus seis columnas—, y porque CASTIGO trabaja los
 * sábados. Los días que aún no han llegado salen sin marcas, que es la verdad.
 */
export function finDeSemanaDe(fecha: Date): string {
  return sumarDias(lunesDe(fecha), 5);
}

/**
 * La semana que se abre por defecto: la última COMPLETA.
 *
 * No la que está en curso. RR.HH. revisa y cierra sobre semanas terminadas, y
 * abrir en la actual significa que un lunes por la mañana la pantalla enseña un
 * solo día: sin curva, sin mapa y sin nada que decidir. La actual está a un
 * clic en las fechas.
 */
export function semanaPorDefecto(hoyDate = new Date()): { desde: string; hasta: string } {
  const lunesActual = lunesDe(hoyDate);
  const sabadoActual = sumarDias(lunesActual, 5);
  const terminada = fechaTexto(hoyDate) > sabadoActual;
  const lunes = terminada ? lunesActual : sumarDias(lunesActual, -7);
  return { desde: lunes, hasta: sumarDias(lunes, 5) };
}

/** La fecha local como texto. `toISOString()` pasa por UTC y en Lima se adelanta. */
export function fechaTexto(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

export function sumarDias(fecha: string, dias: number): string {
  const copia = new Date(fecha + 'T00:00:00');
  copia.setDate(copia.getDate() + dias);
  return fechaTexto(copia);
}
