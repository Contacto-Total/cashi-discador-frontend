/**
 * Piezas de las solicitudes que comparten Mi asistencia y Asistencia del equipo: la columna lateral con
 * sus tarjetas, la lista que se despliega y el formulario. Las medidas salen del artifact aprobado; el
 * tema antiguo fuerza márgenes, bordes y rellenos de listas y botones, de ahí los `!`.
 */

/** Columna lateral: sus tarjetas apiladas; la última ocupa lo que queda y desliza por dentro. */
export const COLUMNA = 'flex min-h-0 min-w-0 flex-col gap-3 self-stretch';
export const COLUMNA_TARJETA = 'flex min-h-0 flex-none flex-col px-5! py-[1.125rem]! last:flex-1';
export const COLUMNA_TITULO = 'm-0 mb-[.75rem] text-[1rem] leading-[1.25] font-bold text-foreground';
export const DESLIZA = '-mx-5 -mb-[1.125rem] min-h-0 flex-1 overflow-y-auto px-5 pb-[1.125rem]';

/** Lista con separadores; cada fila es título, línea gris y una píldora a la derecha. */
export const LISTA_FILAS = 'm-0! flex list-none! flex-col p-0!';
export const FILA = 'm-0! border-t border-(--line2) p-0! first:border-t-0';
const ITEM_BASE = 'grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-[.125rem] rounded-[.625rem] border-0! bg-transparent px-1! py-[.5625rem]! '
  + 'text-left [font-family:inherit] text-[.875rem] leading-[1.5] text-foreground';
export const ITEM = ITEM_BASE;
export const ITEM_BOTON = ITEM_BASE + ' cursor-pointer transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--muted)_55%,transparent)]';
export const ITEM_TITULO = 'truncate text-[.875rem] font-semibold';
export const ITEM_LINEA = 'col-start-1 text-[.75rem] text-muted-foreground';
/** Se suma a la clase de la píldora: ocupa las dos líneas, a la derecha. */
export const ITEM_PILL = ' col-start-2 row-span-2 row-start-1';
export const DETALLE = 'flex flex-col gap-[.625rem] px-[.375rem] pt-1 pb-4';
export const DETALLE_TEXTO = 'm-0 text-[.875rem] leading-[1.5] whitespace-normal text-(--ink2)';
export const DETALLE_SUB = 'm-0 text-[.75rem] leading-[1.5] font-medium text-muted-foreground';

/** Recuadro de aviso: ámbar por defecto; informativo en azul y rechazo en rojo. */
const AVISO_BASE = 'm-0 rounded-[.625rem] border px-[.875rem] py-[.625rem] text-[.875rem] leading-[1.5]';
export const AVISO = {
  am: AVISO_BASE + ' border-(--am-ln) bg-(--am-bg) text-(--am)',
  info: AVISO_BASE + ' border-(--info-ln) bg-(--info-bg) text-(--info)',
  ro: AVISO_BASE + ' border-(--ro-ln) bg-(--ro-bg) text-(--ro)'
} as const;

/** La cifra que resulta: rótulo gris a la izquierda y el valor en negrita. */
export const CALCULO = 'flex justify-between gap-3 rounded-[.625rem] border border-border px-3 py-[.625rem] text-[.875rem] leading-[1.5]';

/** Formulario: campos apilados. */
export const PILA = 'flex flex-col gap-[.875rem]';
export const FILA_CAMPOS = 'grid grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] gap-[.625rem]';
export const BOTONES = 'flex flex-wrap items-center gap-2';

/** Opción con su punto, una debajo de otra. */
export const OPCIONES = 'grid gap-2';
export const OPCION = 'group inline-flex w-full cursor-pointer items-center gap-2 rounded-[.625rem] border! border-solid! border-border! bg-card px-3! py-[.4375rem]! text-left [font-family:inherit] '
  + 'text-[.875rem] leading-[1.5] text-foreground hover:bg-muted dark:hover:bg-border aria-checked:border-(--ring)! aria-checked:shadow-[0_0_0_1px_var(--ring)]';
export const OPCION_PUNTO = 'size-4 flex-none rounded-full border-[1.5px] border-solid border-(--campo-ln) group-aria-checked:border-[5px] group-aria-checked:border-(--verde-txt)';
export const OPCION_TITULO = 'block text-[.875rem] font-semibold';
export const OPCION_LINEA = 'block text-[.75rem] font-normal text-muted-foreground';

/** Tres (o dos) botones en una caja gris; el elegido en blanco. */
export const TRIO = 'grid grid-cols-3 gap-[.1875rem] rounded-[.5rem] bg-muted p-[.1875rem]';
export const TRIO_DOS = 'grid grid-cols-2 gap-[.1875rem] rounded-[.5rem] bg-muted p-[.1875rem]';
export const TRIO_BOTON = 'cursor-pointer rounded-[.375rem] border-0! bg-transparent px-2! py-[.375rem]! [font-family:inherit] text-[.8125rem] leading-[1.5] font-medium '
  + 'text-[color-mix(in_srgb,var(--foreground)_62%,transparent)] aria-pressed:bg-(--seg-activo) aria-pressed:text-foreground aria-pressed:shadow-[0_1px_2px_rgb(0_0_0/.08)]';

/** Día con casilla: la fecha y, a la derecha, lo que pasó ese día. */
export const DIA_CASILLA = 'm-0! grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[.625rem] border-t border-(--line2) px-1 py-2 text-[.875rem] leading-[1.5] font-normal! text-foreground first:border-t-0';
export const CASILLA = 'm-0! size-4! accent-(--verde-txt)';
export const DIA_CASILLA_NOTA = 'text-[.75rem] text-muted-foreground';

/** Adjuntar: recuadro punteado con el clip y el nombre del archivo. */
export const ADJUNTO = 'm-0! flex cursor-pointer items-center gap-[.625rem] rounded-[.625rem] border border-dashed border-(--campo-ln) px-3 py-2 text-[.75rem]! leading-[1.5] font-medium! text-(--ink2)';

/** Insignia neutra con borde (Teletrabajo en la cabecera). */
export const INSIGNIA = 'inline-flex flex-none items-center gap-[.375rem] rounded-full border border-border bg-transparent px-3 py-[.1875rem] text-[.75rem] leading-[1.5] font-semibold whitespace-nowrap text-muted-foreground';

/** «Lunes 03/11»: Lima, sin la hora; el navegador en es-PE da otros nombres. */
export const DIAS_LARGOS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/** «1 hora 30 minutos»: las duraciones de los mensajes van en palabras. */
export function enPalabras(minutos: number): string {
  const h = Math.floor(minutos / 60), m = minutos % 60;
  const horas = h === 1 ? '1 hora' : `${h} horas`, mins = m === 1 ? '1 minuto' : `${m} minutos`;
  return h && m ? `${horas} ${mins}` : h ? horas : mins;
}
