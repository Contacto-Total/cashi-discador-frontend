/**
 * Clases del molde del rediseño de asistencia: tarjeta principal a todo el alto con la lista que se
 * desplaza por dentro, columna lateral cuando hace falta y barra de guardar abajo. Las medidas salen
 * del artifact aprobado; el tema antiguo fuerza con !important campos, listas y negritas, de ahí los `!`.
 */

/** Raíz de una pantalla: ocupa el alto del menú y apila la rejilla y la barra. */
export const PANTALLA = 'cashi-pantalla font-cashi flex min-h-0 flex-1 flex-col text-[.875rem] leading-[1.5] text-foreground tabular-nums antialiased';

/** Tarjeta principal y columna lateral. La columna mide 17rem; con ficha o certificado, hasta 23rem. */
export const REJILLA = 'grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] items-start gap-3';
export const REJILLA_SOLA = 'grid-cols-[minmax(0,1fr)]';
export const REJILLA_LADO = 'grid-cols-[minmax(0,1fr)_17rem]';
export const REJILLA_FICHA = 'grid-cols-[minmax(0,1fr)_min(23rem,36%)]';

export const PRINCIPAL = '@container/tarjeta flex min-h-0 flex-col self-stretch overflow-hidden px-8 pt-[clamp(1rem,2.6vh,2rem)] pb-5';
/** Zona que se desplaza dentro de la tarjeta; llega al borde de abajo. */
export const ZONA = '-mx-8 -mb-5 flex min-h-0 flex-1 flex-col overflow-y-auto px-8 pb-3';
/** Columna lateral: la misma tarjeta, con su lista desplazable. */
export const LADO = 'flex min-h-0 min-w-0 flex-col self-stretch overflow-hidden';

/** Barra de guardar: tarjeta aparte, siempre visible; estado a la izquierda y acciones a la derecha. */
export const BARRA = 'mt-[.75rem] flex min-h-[3.875rem] flex-none flex-wrap items-center gap-2 py-3 pr-3 pl-5';
export const BARRA_ESTADO = 'mr-auto text-[.875rem] font-medium text-muted-foreground';
export const BARRA_ESTADO_HAY = 'mr-auto text-[.875rem] font-medium text-foreground';
export const BARRA_ESTADO_MAL = 'mr-auto text-[.875rem] font-medium text-(--ro)';

/** Cabecera de la tarjeta: título y subtítulo a la izquierda, filtros a la derecha; si no caben, bajan a su fila. */
export const CABECERA = 'mb-5 flex flex-none items-start justify-between gap-x-6 gap-y-3 @max-[44.001rem]/tarjeta:flex-wrap';
export const CABECERA_TEXTO = 'min-w-0 flex-none';
export const TITULO = 'm-0 text-[1.5rem] leading-[1.25] font-bold whitespace-nowrap text-foreground';
export const SUBTITULO = 'm-0 mt-[.125rem] text-[.875rem] leading-[1.5] text-muted-foreground';
export const FILTROS = 'grid min-w-0 flex-[0_1_27rem] grid-cols-[repeat(3,minmax(0,1fr))] gap-2 @max-[44.001rem]/tarjeta:basis-full';
export const CAMPO = 'flex min-w-0 flex-col gap-[.3125rem]';
export const ETIQUETA = 'm-0! text-[.75rem]! leading-[1.5]! font-medium! text-(--ink2)!';
export const LISTA = 'font-cashi m-0! h-[2.375rem]! w-full rounded-[.5rem]! border! border-(--campo-ln)! bg-(--campo)! px-[.625rem]! py-[.375rem]! '
  + 'text-[.875rem]! leading-[normal]! text-ellipsis text-foreground! shadow-[0_1px_2px_rgb(0_0_0/.05)] outline-none '
  + 'focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
export const ENTRADA = LISTA + ' leading-[1.5]!';
/** Buscador: la lupa dentro del campo, a la izquierda. */
export const BUSCAR = 'relative min-w-0';
export const BUSCAR_ICONO = 'pointer-events-none absolute top-1/2 left-[.625rem] flex -translate-y-1/2 text-muted-foreground';
export const BUSCAR_CAMPO = ENTRADA + ' pl-[2.125rem]!';

/** Fila de herramientas sobre la tabla: segmentado a la izquierda y lo demás a la derecha. */
export const HERRAMIENTAS = 'mb-4 flex flex-none flex-wrap items-center gap-3';

/** Indicadores: cuatro en fila, del mismo alto. */
export const INDICADORES = 'mb-5 grid flex-none grid-cols-4 items-stretch gap-3';

/**
 * Tabla del molde. La primera columna arranca alineada con el texto de la cabecera; la última llega al
 * borde. El tema antiguo pinta cabeceras, celdas y el hover de las filas con !important (mayúsculas,
 * fondo crema, 12 px de relleno): las utilidades llevan `!` para ganarle desde su capa.
 */
export const TABLA_CAJA = '-mx-1 -mb-1 flex-[1_0_auto] overflow-auto px-1 pb-1';
export const TABLA = 'w-full border-collapse bg-transparent! text-foreground!';
export const THEAD = 'bg-transparent!';
/** Fila sin acción: sin hover ni borde propio (el borde lo llevan las celdas). */
export const TR = 'border-0! bg-transparent! hover:bg-transparent!';
export const TH = 'border-0! border-b! border-solid! border-border! bg-transparent! px-2! py-[.625rem]! text-left text-[.75rem]! leading-[1.5]! font-medium! tracking-normal! whitespace-nowrap normal-case! text-muted-foreground! '
  + 'first:pl-[calc(.625rem+1px)]! last:pr-0!';
export const TH_NUM = TH + ' text-right!';
const TD_BASE = 'border-0! border-b! border-solid! border-(--line2)! bg-transparent! px-2! py-[.5625rem]! align-middle text-[.875rem]! leading-[1.5]! whitespace-nowrap '
  + 'first:pl-[calc(.625rem+1px)]! last:pr-0! [tr:last-child>&]:border-b-0!';
export const TD = TD_BASE + ' text-foreground!';
export const TD_NUM = TD + ' text-right!';
/** Primera columna: el texto principal un punto más suave que el negro. */
export const TD_1 = TD_BASE + ' text-[color-mix(in_srgb,var(--foreground)_80%,transparent)]!';
/** Segunda línea gris de una celda. */
export const SEC = 'block text-[.75rem] leading-[1.5] font-normal text-muted-foreground!';
/** Texto en negrita dentro de una celda (el tema antiguo fuerza el color de <b>). */
export const FUERTE = 'font-semibold';

/** Píldoras: neutra con borde; con relleno solo si informa un estado. */
const PILL_BASE = 'inline-flex flex-none items-center gap-[.375rem] rounded-full border py-[.125rem] pr-[.625rem] pl-[.5rem] text-[.75rem] leading-[1.5] font-semibold whitespace-nowrap '
  + "before:size-[.4375rem] before:flex-none before:rounded-full before:bg-current before:content-['']";
export const PILL = {
  neu: PILL_BASE + ' border-border bg-transparent text-muted-foreground',
  ok: PILL_BASE + ' border-(--ok-ln) bg-(--ok-bg) text-(--ok)',
  am: PILL_BASE + ' border-(--am-ln) bg-(--am-bg) text-(--am)',
  ro: PILL_BASE + ' border-(--ro-ln) bg-(--ro-bg) text-(--ro)',
  info: PILL_BASE + ' border-(--info-ln) bg-(--info-bg) text-(--info)'
} as const;
export type TonoPill = keyof typeof PILL;

/** Vacío de una lista: recuadro punteado con el texto al centro. */
export const VACIO = 'rounded-xl border border-dashed border-(--campo-ln) px-4 py-8 text-center text-muted-foreground';
export const VACIO_CHICO = 'rounded-xl border border-dashed border-(--campo-ln) px-3 py-5 text-center text-[.875rem] text-muted-foreground';
