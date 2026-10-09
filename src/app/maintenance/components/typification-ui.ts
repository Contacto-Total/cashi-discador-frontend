/**
 * Clases y animaciones que comparten la pantalla de tipificaciones y sus cuatro
 * modales. Es el mismo sistema visual de /reports/estado-agentes.
 *
 * Cada constante lleva un solo valor por propiedad: dos utilidades de Tailwind que
 * pisan lo mismo no se resuelven por el orden en que se escriben. Por eso, por
 * ejemplo, `input` no fija el ancho: quien lo necesita a todo el ancho le suma
 * `w-full`.
 */

const FUENTE = "font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]";

const CAMPO =
  'rounded-lg border border-[#d5dbe3] bg-white text-[#0f172a] outline-none transition-colors ' +
  'focus:border-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 ' +
  'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ';

const BOTON =
  'inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg text-[12.5px] font-bold transition duration-150 ' +
  'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ';

const CHIP = 'inline-flex h-[18px] shrink-0 items-center gap-1 whitespace-nowrap rounded-[5px] px-[7px] text-[10.5px] font-bold ';

export const TUI = {
  fuente: FUENTE,
  raiz: `min-h-full bg-[#f6f7f9] ${FUENTE} text-[#0f172a] p-4 md:p-5 dark:bg-slate-950 dark:text-slate-100`,

  label: 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  ayuda: 'text-[11px] leading-[1.45] text-[#5f6c80] dark:text-slate-400',
  error: 'text-[11px] font-semibold leading-[1.45] text-[#b91c1c] dark:text-red-400',

  input: CAMPO + 'h-[38px] px-3 text-[13px] font-semibold',
  inputSm: CAMPO + 'h-[34px] px-2.5 text-[12.5px] font-semibold',
  textarea: CAMPO + 'w-full resize-y px-3 py-2 text-[13px] leading-[1.45]',

  primario: BOTON + 'bg-[#0f172a] px-4 text-white hover:bg-[#1e293b] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
  secundario:
    BOTON + 'border border-[#d5dbe3] bg-white px-3.5 text-[#0f172a] hover:border-[#8491a3] hover:bg-[#f8fafc] ' +
    'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
  peligro: BOTON + 'bg-[#b91c1c] px-4 text-white hover:bg-[#991b1b]',
  /** Botón chico con texto, para acciones dentro de una fila. */
  textoBtn:
    'inline-flex h-7 shrink-0 items-center gap-[5px] rounded-[7px] border border-[#d5dbe3] bg-white px-2.5 text-[11.5px] ' +
    'font-bold text-[#334155] transition duration-150 hover:border-[#8491a3] hover:bg-[#f8fafc] active:scale-[0.97] ' +
    'disabled:cursor-not-allowed disabled:opacity-50 ' +
    'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
  iconBtn:
    'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[#5f6c80] transition-colors duration-150 ' +
    'hover:bg-[#eef1f5] hover:text-[#0f172a] disabled:cursor-not-allowed disabled:opacity-50 ' +
    'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
  iconBtnPeligro:
    'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[#5f6c80] transition-colors duration-150 ' +
    'hover:bg-[#fdecec] hover:text-[#b91c1c] dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-300',
  enlace:
    'inline-flex h-7 items-center rounded-[6px] px-2 text-[12px] font-bold text-[#5f6c80] transition-colors duration-150 ' +
    'hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-slate-100',

  chipGris: CHIP + 'bg-[#eef1f5] text-[#334155] dark:bg-slate-800 dark:text-slate-300',
  chipVioleta: CHIP + 'bg-[#efecfb] text-[#4a3aa7] dark:bg-violet-500/20 dark:text-violet-300',
  chipAmbar: CHIP + 'border border-[#f3e2c0] bg-[#fdf6e7] text-[#b45309] dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',

  /** Aviso ámbar de ancho completo. */
  aviso:
    'flex items-start gap-2 rounded-[10px] border border-[#f3e2c0] bg-[#fdf6e7] px-3 py-2 text-[12px] font-semibold leading-[1.5] ' +
    'text-[#8a4207] dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200',
  /** Caja gris para contexto o vista previa. */
  caja: 'rounded-[10px] border border-[#e6e9ee] bg-[#f8fafc] dark:border-slate-700 dark:bg-slate-800/60',
  tarjeta: 'rounded-xl border border-[#e6e9ee] bg-white dark:border-slate-800 dark:bg-slate-900',

  // ---- Modales ----
  fondo: 'tui-fondo fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.45)] p-4',
  panel:
    `tui-panel flex max-h-full w-full flex-col rounded-[14px] border border-[#e6e9ee] bg-white ${FUENTE} text-[#0f172a] ` +
    'shadow-[0_24px_48px_rgba(15,23,42,0.22)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
  cabecera: 'flex shrink-0 items-start justify-between gap-3 pb-3 pl-[18px] pr-3.5 pt-4',
  titulo: '!m-0 text-[15px] font-extrabold leading-[1.3] tracking-[-0.01em]',
  subtitulo: 'mt-[3px] text-[12px] leading-[1.45] text-[#5f6c80] dark:text-slate-400',
  cuerpo: 'flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-[18px] pb-4',
  pie: 'flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-[#e6e9ee] px-[18px] py-3 dark:border-slate-700'
} as const;

/** Pista de un interruptor dibujado sobre <button role="switch">. */
export function tuiSwitch(on: boolean): string {
  return 'inline-flex h-5 w-[34px] shrink-0 items-center rounded-full p-0.5 transition-colors duration-150 ' +
    'disabled:cursor-not-allowed disabled:opacity-50 ' +
    (on ? 'bg-[#16a34a]' : 'bg-[#8491a3] dark:bg-slate-600');
}

export function tuiPerilla(on: boolean): string {
  return 'block h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.25)] transition-transform duration-150 ' +
    (on ? 'translate-x-[14px]' : 'translate-x-0');
}

/** Sin tildes ni mayúsculas, para buscar: "fallecio" encuentra "FALLECIÓ". */
export function tuiNormalizar(s: string | null | undefined): string {
  return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/**
 * Animaciones de los modales. Va en `styles` de cada componente porque Angular
 * encapsula los keyframes por componente. Solo fotograma "from" y relleno
 * "backwards": no dejan nada pegado al terminar. Solo opacity y transform.
 */
export const TUI_ANIM = `
  :host { display: contents; }
  .tui-fondo { animation: tui-aparecer 150ms ease-out backwards; }
  .tui-panel { animation: tui-subir 200ms cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
  .tui-entra { animation: tui-entrar 220ms cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
  @keyframes tui-aparecer { from { opacity: 0; } }
  @keyframes tui-subir { from { opacity: 0; transform: translateY(8px) scale(0.97); } }
  @keyframes tui-entrar { from { opacity: 0; transform: translateY(-4px); } }
  @media (prefers-reduced-motion: reduce) {
    .tui-fondo, .tui-panel, .tui-entra { animation: none; }
  }
`;
