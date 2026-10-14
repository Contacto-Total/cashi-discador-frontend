/** Filas por página en las tablas de pagos bancarios. */
export const TAMANO_PAGINA = 30;

export function totalPaginas(total: number, tamano = TAMANO_PAGINA): number {
  return Math.max(1, Math.ceil(total / tamano));
}

/** Acota la página al rango vigente: si la lista se achica, no queda en una página vacía. */
export function acotarPagina(pagina: number, total: number, tamano = TAMANO_PAGINA): number {
  return Math.min(Math.max(1, pagina), totalPaginas(total, tamano));
}

export function cortarPagina<T>(filas: T[], pagina: number, tamano = TAMANO_PAGINA): T[] {
  const inicio = (acotarPagina(pagina, filas.length, tamano) - 1) * tamano;
  return filas.slice(inicio, inicio + tamano);
}

/** El documento contiene lo buscado; se ignoran espacios. Sin texto, todo coincide. */
export function coincideDocumento(documento: unknown, texto: string): boolean {
  const buscado = texto.replace(/\s+/g, '');
  if (!buscado) return true;
  return String(documento ?? '').replace(/\s+/g, '').includes(buscado);
}
