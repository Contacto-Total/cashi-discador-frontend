/**
 * Textos y estilos de las categorías de un pago bancario.
 * El color nunca es el único indicador: cada categoría lleva su etiqueta escrita.
 */
export type TonoCategoria = 'ok' | 'espera' | 'revision' | 'neutro';

export interface CategoriaPagoInfo {
  label: string;
  tono: TonoCategoria;
  /** Qué hará el sistema con el pago al guardar. */
  resultado: string;
}

export const CATEGORIAS_PAGO: Record<string, CategoriaPagoInfo> = {
  CONCILIADO: { label: 'Conciliado', tono: 'ok', resultado: 'Se concilia al guardar.' },
  CONCILIADO_POR_SUMA: { label: 'Conciliado por suma', tono: 'ok', resultado: 'El banco sumó varios pagos del asesor del mismo día. Se concilia al guardar.' },
  CONCILIADO_POR_SUMA_CON_DESFASE: { label: 'Conciliado por suma con desfase', tono: 'ok', resultado: 'El banco sumó varios pagos del asesor del mismo día y lo reportó con otra fecha dentro de la ventana. Se concilia al guardar.' },
  CONCILIADO_CON_DESFASE: { label: 'Conciliado con desfase', tono: 'ok', resultado: 'El banco reportó el pago con otra fecha dentro de la ventana. Se concilia al guardar.' },
  CONCILIADO_POR_PARTES: { label: 'Conciliado por partes', tono: 'ok', resultado: 'Los pagos del banco completan el monto registrado. Se concilia al guardar.' },
  PARCIAL_EN_ESPERA: { label: 'Parcial en espera', tono: 'espera', resultado: 'Se aplica lo recibido y la cuota queda parcial hasta que llegue el resto.' },
  PAGO_VOLUNTARIO: { label: 'Pago voluntario', tono: 'neutro', resultado: 'El cliente no tiene promesa. Se registra como pago voluntario al guardar.' },
  REQUIERE_REVISION: { label: 'Requiere revisión', tono: 'revision', resultado: 'Se guarda como pendiente hasta que se resuelva.' },
  OMITIDO_POR_FECHA: { label: 'Omitido por fecha', tono: 'neutro', resultado: 'El pago es anterior al mes en que el cliente entró a la subcartera. No se guarda.' },
  NO_CORRESPONDE: { label: 'No corresponde', tono: 'neutro', resultado: 'Un supervisor indicó que el pago no corresponde a la gestión de la empresa. Se conserva, pero ya no está pendiente.' },
  CLIENTE_NO_ENCONTRADO: { label: 'Cliente no encontrado', tono: 'neutro', resultado: 'El documento no pertenece a esta subcartera.' },
  PAGO_YA_CONCILIADO_PREVIAMENTE: { label: 'Ya conciliado', tono: 'neutro', resultado: 'Este pago ya fue conciliado antes.' }
};

export const CATEGORIA_DESCONOCIDA: CategoriaPagoInfo = {
  label: 'Sin categoría',
  tono: 'revision',
  resultado: 'Revisión manual requerida.'
};

export const TONO_PILL: Record<TonoCategoria, string> = {
  ok: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  espera: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  revision: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  neutro: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
};

export const TONO_FILA: Record<TonoCategoria, string> = {
  ok: 'bg-emerald-50/50 dark:bg-emerald-950/10',
  espera: 'bg-amber-50/60 dark:bg-amber-950/15',
  revision: 'bg-red-50/50 dark:bg-red-950/10',
  neutro: 'bg-slate-50 dark:bg-slate-800/40'
};

export const TONO_BORDE: Record<TonoCategoria, string> = {
  ok: 'border-emerald-300 dark:border-emerald-700',
  espera: 'border-amber-300 dark:border-amber-700',
  revision: 'border-red-300 dark:border-red-800',
  neutro: 'border-slate-300 dark:border-slate-600'
};

/** Por qué un pago quedó en revisión y qué se puede hacer. */
export const MOTIVOS_REVISION: Record<string, { problema: string; accion: string }> = {
  DATOS_INVALIDOS: {
    problema: 'La fila del banco no tiene documento, fecha o monto válido.',
    accion: 'Revisar el archivo del banco.'
  },
  DESFASE_CON_VARIOS_CANDIDATOS: {
    problema: 'Hay más de un pago del asesor igual de cercano en fecha.',
    accion: 'Ajustar la fecha del pago que corresponde para que coincida con el banco.'
  },
  FUERA_DE_VENTANA: {
    problema: 'El monto coincide, pero la fecha está fuera de los días permitidos o en otro mes.',
    accion: 'Verificar el pago y, si corresponde, corregir la fecha registrada por el asesor.'
  },
  MONTO_MAYOR_AL_REGISTRADO: {
    problema: 'El banco reporta un monto mayor al que registró el asesor.',
    accion: 'Corregir el monto del pago registrado o crear el pago que falta.'
  },
  MONTO_NO_CALZA: {
    problema: 'El monto no coincide con ningún pago registrado dentro de la ventana.',
    accion: 'Corregir fecha o monto del pago registrado, o crear el pago en la cuota.'
  },
  SIN_PROMESA_CON_PAGO_PENDIENTE: {
    problema: 'El cliente no tiene promesa, pero ya tiene un pago registrado sin conciliar.',
    accion: 'Corregir ese pago para que coincida con el banco.'
  },
  PROMESA_SIN_CUOTAS_PENDIENTES: {
    problema: 'El cliente tiene promesa, pero ninguna cuota pendiente.',
    accion: 'Verificar si la promesa ya fue completada o registrar un pago voluntario.'
  },
  FALTA_TIPIFICACION_CANCELACION: {
    problema: 'El asesor no registró la cancelación de este pago.',
    accion: 'Crear el pago en la cuota que corresponde.'
  },
  FECHA_FUERA_DE_RANGO_DE_PROMESA: {
    problema: 'La fecha del banco no cae dentro de ninguna cuota pendiente.',
    accion: 'Ampliar el vencimiento de la cuota o crear una promesa del sistema.'
  },
  DOCUMENTO_NO_EXISTE_EN_CLIENTES: {
    problema: 'El documento no existe en clientes.',
    accion: 'Validar el documento o revisar si pertenece a otra base.'
  },
  CLIENTE_NO_PERTENECE_A_CONTEXTO: {
    problema: 'El cliente pertenece a otra subcartera.',
    accion: 'Cargar el archivo en la subcartera correcta.'
  }
};

export function infoCategoria(categoria: string | null | undefined): CategoriaPagoInfo {
  return (categoria && CATEGORIAS_PAGO[categoria]) || CATEGORIA_DESCONOCIDA;
}

/**
 * Convierte una fecha del backend (yyyy-MM-dd, dd/MM/yyyy o [año, mes, día]) a yyyy-MM-dd.
 */
export function aFechaIso(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day] = value as number[];
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  const text = String(value);
  const latina = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(text);
  if (latina) return `${latina[3]}-${latina[2]}-${latina[1]}`;
  return text.slice(0, 10);
}

/** Muestra una fecha como dd/MM/yyyy. */
export function fechaCorta(value: unknown): string {
  const iso = aFechaIso(value);
  if (!iso) return '-';
  const [year, month, day] = iso.split('-');
  return day && month && year ? `${day}/${month}/${year}` : iso;
}

export function montoSoles(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-';
  return `S/ ${Number(value).toFixed(2)}`;
}

/** Días entre dos fechas ISO (b - a). */
export function diasEntre(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}
