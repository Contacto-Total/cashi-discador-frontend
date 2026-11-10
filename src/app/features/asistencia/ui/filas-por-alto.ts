/**
 * Cuántas filas de una tabla entran en el alto que le queda a su zona sin desplazarla. La tarjeta no
 * crece: si sobran filas van a otra página. Mínimo 3, para que una pantalla baja no quede casi vacía.
 *
 * `zona` es lo que se desplaza; `caja`, el contenedor de la tabla dentro de ella. Se mide con las filas
 * que hay pintadas: el alto de la más alta, el espacio libre bajo la tabla y lo que la zona se pasa.
 */
export function filasQueEntran(zona: HTMLElement, caja: HTMLElement, minimo = 3, molde: 'lista' | 'tabla' = 'lista'): number | null {
  const tabla = caja.querySelector('table');
  const cuerpo = tabla?.querySelector('tbody');
  const filas = cuerpo ? Array.from(cuerpo.children) as HTMLElement[] : [];
  if (!tabla || !cuerpo || !filas.length) return null;
  const exceso = zona.scrollHeight - zona.clientHeight;
  if (molde === 'tabla') {
    // Las tablas paginadas del molde (Equipo, Control): la fila más alta manda y el relleno de la caja cuenta como libre.
    const alto = Math.max(...filas.map(f => f.offsetHeight));
    if (!alto) return null;
    const libre = caja.clientHeight - tabla.offsetHeight;
    return Math.max(minimo, Math.floor((cuerpo.offsetHeight + libre - exceso) / alto));
  }
  // Alto promedio: la última fila suele medir un píxel menos (sin borde) y con el máximo sobraría espacio.
  const alto = cuerpo.offsetHeight / filas.length;
  if (!alto) return null;
  // El relleno de la caja (deja ver el aro de foco) no es espacio libre para otra fila.
  const cs = getComputedStyle(caja);
  const libre = caja.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - tabla.offsetHeight;
  return Math.max(minimo, Math.floor((cuerpo.offsetHeight + libre - exceso + .5) / alto));
}
