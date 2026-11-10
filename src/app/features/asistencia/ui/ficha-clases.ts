import { BOTON_APAGADO, BOTON_SEC } from './control-comun';
/**
 * Piezas de Personal que no comparten las demás pantallas: avatares, tarjetas por subcartera, la ficha del
 * panel derecho y el formulario. Las medidas salen del artifact aprobado.
 */

/** Color de cada subcartera: el mismo en todas las pantallas. Interbank va en rojo. */
export function tonoSubcartera(cliente: string | null, subcartera: string | null): string {
  const c = (cliente ?? '').toUpperCase(), n = (subcartera ?? '').toUpperCase();
  if (/INTERBANK|INTERNACIONAL DEL PER/.test(c)) return 'var(--c-5)';
  if (n.includes('PROPIO')) return 'var(--c-1)';
  if (n.includes('CASTIGO')) return 'var(--c-2)';
  if (/\b3\b/.test(n)) return 'var(--c-3)';
  if (/\b5\b/.test(n)) return 'var(--c-4)';
  return 'var(--muted-foreground)';
}

/** Avatar redondo, teñido con el color de su subcartera (gris si no tiene usuario de Cashi). */
export const AVATAR = 'inline-grid flex-none overflow-hidden rounded-full bg-[color-mix(in_oklab,currentColor_14%,var(--card))] '
  + 'shadow-[0_0_0_2px_var(--card),0_0_0_3px_color-mix(in_oklab,currentColor_30%,transparent)] transition-transform duration-200 ease-[cubic-bezier(.16,1,.3,1)]';
export const AVATAR_SIN = ' bg-muted!';
/** Botón que envuelve un avatar: sube al pasar el cursor. */
export const AVATAR_BOTON = 'cursor-pointer rounded-full border-0! bg-transparent p-0! [&:hover>span:first-child]:-translate-y-[3px]';

/**
 * Lo que se suma a `appBoton="secundario"` con `appBotonAlto="chico"` (botón de fila) o `"icono"` (solo icono):
 * el fondo del molde en oscuro y el deshabilitado gris, sin transparencia.
 */
export const MINI = BOTON_SEC + ' ' + BOTON_APAGADO;
/** El de fila con el texto en rojo, para la acción que corta algo (registrar cese). */
export const MINI_PELIGRO = MINI + ' text-(--danger)!';


/** Usuario de Cashi con su punto: verde si está vinculado, ámbar hueco si no. */
export const USUARIO = "inline-flex items-center gap-[.375rem] text-[.8125rem] font-medium text-foreground before:size-[.4375rem] before:flex-none before:rounded-full before:bg-(--ok-pt) before:content-['']";
export const USUARIO_SIN = "inline-flex items-center gap-[.375rem] text-[.8125rem] font-medium text-(--am) before:size-[.4375rem] before:flex-none before:rounded-full before:border-[1.5px] before:border-solid before:border-(--am-pt) before:content-['']";

/** Fila que se abre: hover gris redondeado; elegida, el mismo gris un punto más fuerte. */
export const TR_ABRE = 'cursor-pointer [&>td]:transition-colors [&>td]:duration-150 hover:[&>td]:bg-[color-mix(in_srgb,var(--muted)_55%,transparent)]! '
  + 'hover:[&>td:first-child]:rounded-l-[.625rem] hover:[&>td:last-child]:rounded-r-[.625rem]';
export const TR_ELEGIDA = ' [&>td]:bg-[color-mix(in_srgb,var(--muted)_70%,transparent)]! [&>td:first-child]:rounded-l-[.625rem] [&>td:last-child]:rounded-r-[.625rem]';

/** Formulario: cada sección con su título y una rejilla de campos que se reparten el ancho. */
export const SECCION_TITULO = 'm-0 border-b border-(--line2) pb-2 text-[1rem] leading-[1.25] font-bold text-foreground';
export const CAMPOS = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] items-start gap-x-4 gap-y-[.875rem]';
export const AYUDA = 'mt-[.25rem] block text-[.75rem] leading-[1.5] text-muted-foreground';
export const NOTA = 'm-0 text-[.75rem] leading-[1.5] text-muted-foreground';
export const ERROR = 'm-0 text-[.75rem] leading-[1.5] font-medium text-(--ro)';
