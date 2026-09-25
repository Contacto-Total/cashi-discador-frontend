import { Observable } from 'rxjs';
import { AsistenciaDia, EstadoAsistencia } from './asistencia.models';

/**
 * El estado que se enseña de un día. Falte la marca que falte —también el
 * break— el día sale «Incompleto»: no marcar es una alerta y RR.HH. lo
 * corrige. El cálculo guarda PUNTUAL o TARDE cuando las horas sí se pueden
 * sacar (la tardanza sigue en su columna); esto es solo lo que se ve.
 */
export function estadoVisible(d: AsistenciaDia): EstadoAsistencia {
  const sinMarcas = d.estado === 'FALTA' || d.estado === 'JUSTIFICADO' || d.estado === 'NO_LABORABLE';
  return !sinMarcas && (d.marcasFaltantes ?? []).length ? 'INCOMPLETO' : d.estado;
}

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
  etiqueta: 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  campo: 'h-[38px] w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] text-[13px] !text-[#0f172a] placeholder:!text-[#757575] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100 dark:placeholder:text-slate-500',
  area: 'w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] py-2 text-[13px] !text-[#0f172a] placeholder:!text-[#757575] focus:!border-[#2563eb] focus:outline-none dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100',
  botonSecundario: 'inline-flex h-[38px] items-center gap-1.5 rounded-lg border border-[#8491a3] bg-white px-3.5 text-[13px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-default disabled:opacity-45 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  // El primario de Cashi es el oscuro; el azul queda para foco y enlaces.
  botonPrimario: 'inline-flex h-[38px] items-center gap-1.5 rounded-lg border border-[#0f172a] bg-[#0f172a] px-3.5 text-[13.5px] font-semibold !text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-45 dark:border-white dark:bg-white dark:!text-[#0f172a] dark:hover:bg-slate-200',
  /** El botón pequeño de las filas de una tabla, con su texto: el icono solo no dice qué hace. */
  botonChico: 'inline-flex h-[30px] items-center gap-[5px] rounded-lg border border-[#8491a3] bg-white px-[11px] text-[12px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-default disabled:opacity-45 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  botonIcono: 'inline-flex h-[30px] min-w-[30px] items-center justify-center rounded-[7px] border border-[#e6e9ee] bg-white !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-default disabled:opacity-45 dark:border-slate-700 dark:bg-slate-800 dark:!text-slate-200',
  th: 'whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  td: 'whitespace-nowrap px-3 py-2 text-[12.5px] tabular-nums',
  tarjeta: 'flex min-w-0 flex-col rounded-xl border border-[#e6e9ee] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900',
  /* El color va con ! porque el tema claro fuerza con !important el de los títulos. */
  rotulo: '!m-0 text-[11.5px] font-bold uppercase tracking-[0.05em] !text-[#5f6c80] dark:!text-slate-400',
  cifra: 'text-2xl font-extrabold leading-[1.3] tracking-[-0.02em] tabular-nums',
  /* 12 px sin interlineado propio y sin el espaciado negativo de la cifra, como el <small> de la maqueta. */
  unidad: 'ml-1.5 text-[12px] font-semibold tracking-normal text-[#5f6c80] dark:text-slate-400',
  pie: 'mt-auto pt-1.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400',
  // Todos los objetos visuales viven en una banda del mismo alto: así la línea
  // horizontal es la misma en las cuatro tarjetas.
  banda: 'mt-3.5 flex h-[26px] items-center',
  icono: 'flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#f1f3f6] text-[#0f172a] dark:bg-slate-800 dark:text-slate-100',
  /* El margen lo pone cada uso con !: el tema claro fija el de los títulos (0 0 2px) y le gana a Tailwind. */
  titulo: 'text-[15px] font-extrabold',
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
  flechaAmbito: 'flex h-[38px] items-center self-end -mx-1 text-[15px] text-[#8491a3] dark:text-slate-500',
  /** El nombre del certificado, como el «adjunto» de la maqueta; al pulsarlo se abre. */
  adjunto: 'inline-flex max-w-[180px] items-center gap-1.5 rounded-[7px] border border-[#e6e9ee] bg-white px-[9px] py-[3px] text-[11.5px] !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-700 dark:bg-slate-800 dark:!text-slate-200',

  /** La etiqueta de rol junto al nombre. */
  rolSupervisor: 'inline-block rounded-full border border-[#c7d5fb] bg-[#eef2ff] px-2 py-[1px] text-[11px] font-bold leading-[1.5] tracking-[.01em] text-[#1e40af] dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300',
  rolAsesor: 'inline-block rounded-full border border-[#d5dbe3] bg-[#eef2f7] px-2 py-[1px] text-[11px] font-bold leading-[1.5] tracking-[.01em] text-[#334155] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
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
  REVISADA: { texto: 'Por aprobar', clase: 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400' },
  APROBADA: { texto: 'Aprobada', clase: 'bg-[#e8f5ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300' },
  RECHAZADA: { texto: 'Rechazada', clase: 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300' }
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

/**
 * La solicitud de recuperar horas: qué día recupera, en qué días y con cuántos
 * minutos de más a la salida. No justifica: la tardanza sigue contando.
 */
export const RECUPERACION = 'RECUPERACION';

/** Hasta una hora extra al día; más deja de ser una recuperación razonable. */
export const TOPE_RECUPERACION = 60;

/** Lo que falla en una recuperación, con el mismo texto que el backend; null si está bien. */
export function errorDeRecuperacion(n: { fechaOrigen: string; fechaDesde: string; minutosExtra: number | null }): string | null {
  const minutos = Number(n.minutosExtra);
  if (!Number.isFinite(minutos) || minutos <= 0 || minutos > TOPE_RECUPERACION) {
    return `Los minutos extra van de 1 a ${TOPE_RECUPERACION} por día`;
  }
  if (!n.fechaOrigen) {
    return 'Elige el día que recupera';
  }
  if (n.fechaOrigen > n.fechaDesde) {
    return 'Se recupera el mismo día o después, no antes';
  }
  if (n.fechaOrigen > hoy()) {
    return 'El día que se recupera no puede ser futuro';
  }
  return null;
}

/** «Sale 20 min más tarde · recupera lo del 23/09», para las listas de solicitudes. */
export function detalleRecuperacion(j: { minutosExtra: number | null; fechaOrigen: string | null }): string | null {
  if (!j.minutosExtra || !j.fechaOrigen) {
    return null;
  }
  return `Sale ${j.minutosExtra} min más tarde · recupera lo del ${j.fechaOrigen.slice(8, 10)}/${j.fechaOrigen.slice(5, 7)}`;
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

/**
 * El aviso del cierre semanal para la vista general. Cada lunes RR.HH. cierra
 * la semana anterior y desde ahí no entran solicitudes de esos días. El lunes
 * el aviso cambia: ese día todavía se registra lo de la semana que termina.
 */
/**
 * El aviso del cierre semanal. `fecha` va aparte para pintarla en negrita
 * («hasta el **lunes 28/09**»); `resto` es lo que sigue a la fecha.
 */
export function avisoDeCierre(para: 'asesor' | 'supervisora'): { titulo: string; texto: string; fecha: string | null; resto: string } {
  const hoyTexto = hoy();
  const lunes = lunesDe(new Date(hoyTexto + 'T00:00:00'));
  const corta = (f: string) => `${f.slice(8, 10)}/${f.slice(5, 7)}`;
  if (hoyTexto === lunes) {
    const anterior = sumarDias(lunes, -7);
    return {
      titulo: 'Hoy se cierra la semana',
      texto: `Hoy RR.HH. cierra la semana del ${corta(anterior)} al ${corta(sumarDias(anterior, 5))}. `
        + (para === 'asesor'
          ? 'Si te falta registrar algo de esos días, hazlo ahora.'
          : 'Si a tu equipo le falta registrar algo de esos días, hazlo ahora.'),
      fecha: null,
      resto: ''
    };
  }
  const proximo = corta(sumarDias(lunes, 7));
  return {
    titulo: 'Importante',
    texto: para === 'asesor'
      ? 'Cada lunes RR.HH. cierra la semana anterior. Registra tus solicitudes de esta semana hasta el '
      : 'Cada lunes RR.HH. cierra la semana anterior. Registra las solicitudes de tu equipo de esta semana hasta el ',
    fecha: `lunes ${proximo}`,
    resto: '; después ya no se pueden registrar ni cambiar.'
  };
}

// ==================== CERTIFICADOS ====================

/** La extensión de cada tipo que se acepta, y al revés. */
const EXTENSION_DE: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf'
};
const TIPO_DE: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf'
};

/**
 * El certificado con su tipo. El backend lo manda con el suyo; si llega como
 * binario (un backend de antes), sale de la extensión del nombre. Sin tipo, el
 * navegador no enseña la foto y la baja con un nombre al azar.
 */
export function conTipo(blob: Blob, nombre?: string | null): Blob {
  if (EXTENSION_DE[blob.type]) {
    return blob;
  }
  const tipo = TIPO_DE[(nombre ?? '').split('.').pop()?.toLowerCase() ?? ''];
  return tipo ? new Blob([blob], { type: tipo }) : blob;
}

/** «WhatsApp Image … PM.jpeg» tal cual; «foto.jpg» que es PNG → «foto.png»; «certificado» → «certificado.jpg». */
export function nombreConExtension(nombre: string | null | undefined, tipo: string): string {
  const base = nombre?.trim() || 'certificado';
  const extension = EXTENSION_DE[tipo];
  if (!extension) {
    return base;
  }
  const punto = base.lastIndexOf('.');
  const actual = punto < 0 ? '' : base.slice(punto + 1).toLowerCase();
  if (TIPO_DE[actual] === tipo) {
    return base;
  }
  return `${TIPO_DE[actual] ? base.slice(0, punto) : base}.${extension}`;
}

/** Baja el archivo con su nombre y su extensión. El enlace se suelta después: soltarlo en el acto corta la descarga en algunos navegadores. */
export function descargarArchivo(blob: Blob, nombre: string | null | undefined): void {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreConExtension(nombre, blob.type);
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Abre el certificado en otra pestaña para verlo. La pestaña se abre en el
 * mismo clic (abierta cuando llega el archivo, el navegador la puede bloquear)
 * y se llena al llegar. Una imagen o un PDF se ven; lo demás se baja con su nombre.
 */
export function abrirArchivo(archivo$: Observable<Blob>, nombre: string | null | undefined, alFallar: () => void): void {
  const pestana = window.open('', '_blank');
  archivo$.subscribe({
    next: blob => {
      if (!pestana || !EXTENSION_DE[blob.type]) {
        pestana?.close();
        descargarArchivo(blob, nombre);
        return;
      }
      // Sin soltar el enlace: la pestaña lo vuelve a pedir si se guarda la imagen o el PDF desde ella.
      pestana.location.href = URL.createObjectURL(blob);
    },
    error: () => {
      pestana?.close();
      alFallar();
    }
  });
}
