/** Separa las columnas de origen de una cabecera derivada que concatena varias. */
export const SEPARADOR_ORIGEN = '+';

/** Columnas de origen de una cabecera derivada: una sola, o varias unidas con «+» en el orden en que se concatenan. */
export function columnasOrigen(sourceField?: string | null): string[] {
  return (sourceField ?? '')
    .split(SEPARADOR_ORIGEN)
    .map(c => c.trim())
    .filter(c => c.length > 0);
}

/** Una cabecera con columna de origen es derivada: su valor no viene del archivo, lo arma la carga. */
export function esDerivada(header: { sourceField?: string | null }): boolean {
  return columnasOrigen(header.sourceField).length > 0;
}

/** Columnas de origen para mostrar: «PRIMER_NOMBRE + APELLIDO_PATERNO». */
export function origenLegible(sourceField?: string | null): string {
  return columnasOrigen(sourceField).join(' + ');
}

/**
 * Valor de una cabecera derivada, con la misma regla que aplica el servicio de cargas al guardar: una columna
 * se toma tal cual; varias se unen con un espacio, en orden y sin las vacías. Si hay regex se queda con lo que
 * extrae (el primer grupo o lo que coincide) y, si no coincide, el valor queda vacío.
 */
export function valorDerivado(
  fila: Record<string, unknown>,
  sourceField: string,
  regexPattern?: string | null
): string | null {
  const columnas = columnasOrigen(sourceField);
  let valor: string | null;
  if (columnas.length > 1) {
    const partes = columnas
      .map(c => fila[c])
      .filter(v => v !== null && v !== undefined)
      .map(v => String(v).trim())
      .filter(v => v.length > 0);
    valor = partes.length ? partes.join(' ') : null;
  } else {
    const origen = fila[columnas[0]];
    valor = origen ? String(origen) : null;
  }

  const patron = regexPattern?.trim();
  if (valor === null || !patron) {
    return valor;
  }
  const match = valor.match(new RegExp(patron));
  return match ? (match[1] || match[0]) : null;
}
