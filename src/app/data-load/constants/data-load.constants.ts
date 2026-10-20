/**
 * Constantes para el módulo de carga de datos
 */

// Modos de carga disponibles
export const LOAD_MODES = {
  DAILY: 'DAILY',
  INITIAL_MONTH: 'INITIAL_MONTH',
  COMPLEMENTARY: 'COMPLEMENTARY'
} as const;

// Tipos de carga para el backend
export const LOAD_TYPES = {
  INICIAL: 'INICIAL',
  ACTUALIZACION: 'ACTUALIZACION'
} as const;

// Tipos de datos para columnas
export const DATA_TYPES = {
  TEXT: 'TEXTO',
  NUMERIC: 'NUMERICO',
  DATE: 'FECHA',
  BOOLEAN: 'BOOLEANO'
} as const;

// Tipos de archivo
export const FILE_TYPES = {
  MAIN: 'MAIN',
  COMPLEMENTARY: 'COMPLEMENTARY'
} as const;

// Límites de archivo
export const FILE_LIMITS = {
  MAX_SIZE_BYTES: 50 * 1024 * 1024,  // 50 MB
  MAX_SIZE_DISPLAY: '50 MB',
  VALID_EXTENSIONS: ['.xlsx', '.xls'],
  MAX_ROWS_WARNING: 100000  // Advertir si más de 100K filas
} as const;

// Estados de configuración de archivo
export const FILE_CONFIG_STATES = {
  LOADING: 'loading',
  CONFIGURING: 'configuring',
  READY: 'ready',
  ERROR: 'error'
} as const;

// Formatos de fecha predefinidos
export const DATE_FORMATS = [
  { value: 'dd/MM/yyyy', label: 'dd/MM/yyyy (31/12/2024)' },
  { value: 'd/M/yyyy', label: 'd/M/yyyy (1/1/2024)' },
  { value: 'MM/dd/yyyy', label: 'MM/dd/yyyy (12/31/2024)' },
  { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd (2024-12-31)' },
  { value: 'dd-MM-yyyy', label: 'dd-MM-yyyy (31-12-2024)' }
] as const;

/**
 * Formatea el tamaño de archivo en formato legible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const DAILY_FILE_DATE_ERROR =
  'El nombre del archivo debe incluir la fecha (yyyy_MM_dd, yyyy-MM-dd o yyyyMMdd). Ej.: Cartera_Castigo_2026_10_17.xlsx';

/**
 * Fecha del nombre del archivo de carga diaria en formato yyyy_MM_dd (el de la tabla histórica).
 * Acepta yyyy_MM_dd, yyyy-MM-dd o yyyyMMdd con el mismo separador. null si no trae una fecha
 * válida o trae más de una. Misma regla que DailyFileDateUtil en el backend.
 */
export function extractDailyFileDate(fileName: string | null | undefined): string | null {
  if (!fileName) return null;
  const matches = [...fileName.matchAll(/(?<!\d)(\d{4})([-_]?)(\d{2})\2(\d{2})(?!\d)/g)];
  if (matches.length !== 1) return null;
  const [, year, , month, day] = matches[0];
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const isValid = date.getFullYear() === Number(year)
    && date.getMonth() === Number(month) - 1
    && date.getDate() === Number(day);
  return isValid ? `${year}_${month}_${day}` : null;
}
