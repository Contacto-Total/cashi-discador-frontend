/**
 * Cómo se mueven el arco del anillo y la marca de la escala:
 *  - `suave`: de un segundo al siguiente, se deslizan.
 *  - `quieta`: el tiempo saltó (se volvió a la pantalla, llegó una corrección): se colocan de golpe.
 *  - `fuera`: cambió el estado: se apagan en su sitio.
 *  - `oculta`: ya están en el sitio nuevo, todavía apagados; el paso a `suave` los enciende.
 */
export type ModoReloj = 'suave' | 'quieta' | 'fuera' | 'oculta';

/** `mm:ss`, o `h:mm:ss` desde la hora. */
export function reloj(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  const dd = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${dd(m)}:${dd(x)}` : `${dd(m)}:${dd(x)}`;
}
