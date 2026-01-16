/**
 * Formatos de fecha soportados - SINCRONIZADO CON BACKEND
 * Estos formatos deben mantenerse consistentes con:
 * - web-service-cashi/.../DateParserUtil.java
 *
 * IMPORTANTE: Usar formatos flexibles (d/M/yyyy) en lugar de estrictos (dd/MM/yyyy)
 * para soportar días y meses de 1 o 2 dígitos
 */
export const DATE_FORMATS = {
  // Formatos día/mes/año (más comunes en Latinoamérica)
  DMY_SLASH: 'd/M/yyyy',
  DMY_DASH: 'd-M-yyyy',
  DMY_DOT: 'd.M.yyyy',

  // Formatos año/mes/día (ISO)
  YMD_DASH: 'yyyy-M-d',
  YMD_SLASH: 'yyyy/M/d',

  // Formatos con hora
  DMY_SLASH_TIME: 'd/M/yyyy H:m:s',
  DMY_DASH_TIME: 'd-M-yyyy H:m:s',
  YMD_DASH_TIME: 'yyyy-M-d H:m:s',
  YMD_ISO_TIME: "yyyy-M-d'T'H:m:s",

  // Formatos estrictos (legacy)
  DMY_SLASH_STRICT: 'dd/MM/yyyy',
  DMY_DASH_STRICT: 'dd-MM-yyyy',
  YMD_DASH_STRICT: 'yyyy-MM-dd',
  DMY_SLASH_TIME_STRICT: 'dd/MM/yyyy HH:mm:ss',
  YMD_DASH_TIME_STRICT: 'yyyy-MM-dd HH:mm:ss',
  YMD_ISO_TIME_STRICT: "yyyy-MM-dd'T'HH:mm:ss"
};

/**
 * Formato por defecto para mostrar fechas
 */
export const DEFAULT_DATE_FORMAT = DATE_FORMATS.DMY_SLASH;

/**
 * Patrones regex para detección automática de fechas
 * Mapea el patrón regex al formato correspondiente
 * IMPORTANTE: El orden importa - patrones más específicos primero
 */
export const DATE_DETECTION_PATTERNS = [
  // ISO con hora y milisegundos (desde BD)
  { regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+$/, format: 'yyyy-MM-dd HH:mm:ss' },
  { regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+/, format: "yyyy-MM-dd'T'HH:mm:ss" },

  // ISO con hora (sin milisegundos)
  { regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, format: 'yyyy-MM-dd HH:mm:ss' },
  { regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, format: "yyyy-MM-dd'T'HH:mm:ss" },
  { regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, format: "yyyy-MM-dd'T'HH:mm:ss" },

  // ISO con hora sin segundos
  { regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, format: 'yyyy-MM-dd HH:mm' },
  { regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, format: "yyyy-MM-dd'T'HH:mm" },

  // ISO sin hora (estricto)
  { regex: /^\d{4}-\d{2}-\d{2}$/, format: 'yyyy-MM-dd' },

  // Formatos flexibles año/mes/día
  { regex: /^\d{4}\/\d{1,2}\/\d{1,2}$/, format: 'yyyy/M/d' },
  { regex: /^\d{4}-\d{1,2}-\d{1,2}$/, format: 'yyyy-M-d' },

  // Formatos día/mes/año CON HORA (comunes en exports de BD)
  { regex: /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2}$/, format: 'd/M/yyyy H:mm:ss' },
  { regex: /^\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}:\d{2}$/, format: 'd-M-yyyy H:mm:ss' },
  { regex: /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}$/, format: 'd/M/yyyy H:mm' },
  { regex: /^\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}$/, format: 'd-M-yyyy H:mm' },

  // Formatos flexibles día/mes/año SIN HORA (más comunes en LATAM)
  { regex: /^\d{1,2}\/\d{1,2}\/\d{4}$/, format: 'd/M/yyyy' },
  { regex: /^\d{1,2}-\d{1,2}-\d{4}$/, format: 'd-M-yyyy' },
  { regex: /^\d{1,2}\.\d{1,2}\.\d{4}$/, format: 'd.M.yyyy' },

  // Formato yyyyMMdd (sin separadores - común en sistemas legacy)
  { regex: /^\d{8}$/, format: 'yyyyMMdd' }
];

/**
 * Detecta el formato de una fecha basándose en su estructura
 * @param dateStr String con la fecha
 * @returns Formato detectado o null si no se reconoce
 */
export function detectDateFormat(dateStr: string): string | null {
  if (!dateStr || typeof dateStr !== 'string') {
    return null;
  }

  const trimmed = dateStr.trim();

  for (const pattern of DATE_DETECTION_PATTERNS) {
    if (pattern.regex.test(trimmed)) {
      return pattern.format;
    }
  }

  return null;
}

/**
 * Verifica si un string parece ser una fecha
 * @param value Valor a verificar
 * @returns true si parece ser una fecha
 */
export function looksLikeDate(value: any): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (value instanceof Date) {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  return detectDateFormat(value) !== null;
}
