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
