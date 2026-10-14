/**
 * Clases y animaciones que comparten la pantalla de reportes entregables y su
 * mantenimiento. Es el mismo sistema visual de /reports/estado-agentes.
 *
 * Cada constante lleva un solo valor por propiedad: dos utilidades de Tailwind que
 * pisan lo mismo no se resuelven por el orden en que se escriben. Por eso `input`
 * no fija el ancho: quien lo necesita a todo el ancho le suma `w-full`.
 */

const FUENTE = "font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]";
const MONO = 'font-mono';

const CAMPO =
  'rounded-lg border border-[#d5dbe3] bg-white text-[#0f172a] outline-none transition-colors ' +
  'focus:border-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 ' +
  'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ';

const BOTON =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-[12.5px] font-bold transition duration-150 ' +
  'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ';

const SECUNDARIO =
  'border border-[#d5dbe3] bg-white text-[#0f172a] hover:border-[#8491a3] hover:bg-[#f8fafc] ' +
  'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800';

export const EUI = {
  raiz: `min-h-full bg-[#f6f7f9] ${FUENTE} text-[#0f172a] p-4 md:p-5 dark:bg-slate-950 dark:text-slate-100`,
  mono: MONO,

  titulo: '!m-0 text-xl font-extrabold tracking-[-0.015em]',
  subtitulo: 'mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400',
  /** Rótulo en mayúsculas de un bloque o de un filtro. */
  label: 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  /** Rótulo de un campo de formulario. */
  campo: 'text-[12px] font-bold text-[#334155] dark:text-slate-300',
  ayuda: 'text-[12px] leading-[1.45] text-[#5f6c80] dark:text-slate-400',

  input: CAMPO + 'h-[38px] px-3 text-[13px] font-semibold',
  inputMono: CAMPO + `h-[38px] px-3 text-[12px] font-semibold ${MONO}`,

  primario: BOTON + 'h-[38px] bg-[#0f172a] px-4 text-white hover:bg-[#1e293b] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
  secundario: BOTON + 'h-[38px] px-3.5 ' + SECUNDARIO,
  /** Botón chico: atajos de fecha, Copiar, Editar. */
  chico: BOTON + 'h-8 px-2.5 ' + SECUNDARIO,

  tarjeta: 'rounded-xl border border-[#e6e9ee] bg-white dark:border-slate-800 dark:bg-slate-900',
  /** Bloque gris dentro de una tarjeta. */
  bloque: 'flex min-w-0 flex-col gap-2.5 rounded-[10px] border border-[#e6e9ee] bg-[#fafbfc] p-3.5 dark:border-slate-700 dark:bg-slate-800/50',
  vacio: 'rounded-xl border border-dashed border-[#c5ccd6] bg-white px-6 py-10 text-center text-[12.5px] text-[#5f6c80] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',

  /** Marco del selector segmentado; los botones salen de euiSegmento(). */
  segmentos: 'flex w-fit max-w-full flex-wrap rounded-lg border border-[#c5ccd6] bg-white p-[3px] dark:border-slate-600 dark:bg-slate-800',

  /** Código de la consulta sobre fondo oscuro. */
  codigoOscuro: `rounded-[6px] bg-[#0f172a] px-[9px] py-1 text-[11.5px] font-bold tracking-[0.04em] text-white ${MONO} dark:bg-white dark:text-slate-900`,
  codigoGris: `rounded-[5px] bg-[#eef1f5] px-[7px] py-0.5 text-[10.5px] font-bold tracking-[0.03em] text-[#334155] ${MONO} dark:bg-slate-800 dark:text-slate-300`,
  /** Caja con el nombre del archivo o el asunto. */
  codigoCaja: `min-w-0 flex-[1_1_300px] rounded-lg border border-[#e6e9ee] bg-[#f8fafc] px-3 py-[9px] text-[12.5px] font-semibold [overflow-wrap:anywhere] ${MONO} dark:border-slate-700 dark:bg-slate-800`,

  pildora: 'inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-[3px] text-[11px] font-bold',

  th: 'whitespace-nowrap border-b border-[#e6e9ee] bg-[#f8fafc] px-3 py-2.5 text-[10.5px] font-bold uppercase ' +
      'tracking-[0.05em] text-[#5f6c80] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
  td: 'whitespace-nowrap border-b border-[#eef1f5] px-3 py-2 text-[12px] font-medium text-[#334155] ' +
      'dark:border-slate-800 dark:text-slate-300'
} as const;

/** Botón de un selector segmentado. */
export function euiSegmento(activo: boolean): string {
  return 'h-[30px] shrink-0 whitespace-nowrap rounded-[6px] px-3 text-[12.5px] font-bold transition-colors duration-150 ' +
    'disabled:cursor-not-allowed disabled:opacity-45 ' +
    (activo ? 'bg-[#0f172a] text-white dark:bg-white dark:text-slate-900'
            : 'text-[#5f6c80] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-slate-100');
}

/** Aviso de ancho completo: informativo (gris) o de cuidado (ámbar). */
export function euiAviso(cuidado: boolean): string {
  return 'eui-entra rounded-[10px] border px-3 py-[9px] text-[12.5px] font-semibold leading-[1.45] ' +
    (cuidado ? 'border-[#f3e2c0] bg-[#fdf6e7] text-[#92400e] dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200'
             : 'border-[#e2e8f0] bg-[#f1f4f8] text-[#334155] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300');
}

/**
 * Animaciones. Van en `styles` de cada componente porque Angular encapsula los
 * keyframes por componente. Solo fotograma "from" y relleno "backwards": no dejan
 * nada pegado al terminar. Solo opacity y transform.
 */
export const EUI_ANIM = `
  .eui-sube { animation: eui-subir 280ms cubic-bezier(0.2, 0.7, 0.2, 1) backwards; animation-delay: calc(var(--i, 0) * 50ms); }
  .eui-entra { animation: eui-entrar 220ms cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
  .eui-aparece { animation: eui-aparecer 180ms ease-out backwards; }
  @keyframes eui-subir { from { opacity: 0; transform: translateY(6px); } }
  @keyframes eui-entrar { from { opacity: 0; transform: translateY(-4px); } }
  @keyframes eui-aparecer { from { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .eui-sube, .eui-entra, .eui-aparece { animation: none; }
  }
`;
