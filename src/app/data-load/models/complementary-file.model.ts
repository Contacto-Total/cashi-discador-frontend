/**
 * Modelos para gestión de archivos complementarios
 */

// ==================== Tipos de Archivo Complementario ====================

export interface ComplementaryFileType {
  id: number;
  subPortfolioId: number;
  subPortfolioName: string;
  typeName: string;
  fileNamePattern: string;
  linkField: string;
  columnsToUpdate: string[];
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateComplementaryTypeRequest {
  subPortfolioId: number;
  typeName: string;
  fileNamePattern: string;
  linkField: string;
  columnsToUpdate: string[];
  description?: string;
}

export interface UpdateComplementaryTypeRequest {
  typeName?: string;
  fileNamePattern?: string;
  linkField?: string;
  columnsToUpdate?: string[];
  description?: string;
  isActive?: boolean;
}

// ==================== Importación de Datos Complementarios ====================

export interface ImportComplementaryRequest {
  subPortfolioId: number;
  complementaryTypeId?: number;  // ID del tipo, o usar typeName
  typeName?: string;             // Nombre del tipo (alternativa)
  data: Record<string, any>[];
}

export interface ImportComplementaryResult {
  totalRows: number;
  updatedRows: number;
  notFoundRows: number;
  errorRows: number;
  tableName: string;
  complementaryType: string;
  columnsUpdated: string[];
  errors?: string[];
  totalErrors?: number;
}

// ==================== Detección de Tipo de Archivo ====================

export interface DetectFileTypeRequest {
  subPortfolioId: number;
  fileName: string;
}

export interface DetectFileTypeResult {
  detected: boolean;
  message?: string;
  type?: ComplementaryFileType;
}

// ==================== Tipos de Carga Consolidada ====================

export type LoadMode = 'DAILY' | 'INITIAL_MONTH' | 'COMPLEMENTARY';

/**
 * Tipo de archivo simplificado:
 * - MAIN: Archivo principal (inserción de nuevos registros)
 * - COMPLEMENTARY: Archivo complementario (actualización de columnas existentes)
 */
export type FileType = 'MAIN' | 'COMPLEMENTARY';

/**
 * Estado de configuración del archivo
 */
export type FileConfigState = 'loading' | 'configuring' | 'ready' | 'error';

/**
 * Información de una columna no registrada
 */
export interface UnregisteredColumn {
  name: string;
  sampleValues: string[];
  detectedType: string;
  selected: boolean;
  displayLabel?: string;
  format?: string;
}

/**
 * Información de una hoja de Excel
 */
export interface SheetInfo {
  name: string;
  headers: string[];
  rowCount: number;
}

export interface FileToProcess {
  file: File;
  type: FileType;
  // Estado de configuración
  configState: FileConfigState;
  isExpanded: boolean;
  // Información de hojas de Excel
  sheetsInfo?: SheetInfo[];        // Info de todas las hojas disponibles
  selectedSheet?: string;          // Hoja seleccionada por el usuario
  // Campo de enlace para archivos complementarios
  linkField?: string;              // Columna usada para vincular con registros existentes
  // Columnas no registradas detectadas
  unregisteredColumns?: UnregisteredColumn[];
  // Datos procesados
  data?: Record<string, any>[];
  headers?: string[];
  validated: boolean;
  error?: string;
  rowCount?: number;
}

/**
 * Columnas comunes que suelen usarse como campo de enlace
 * Se usan para sugerir automáticamente al usuario
 */
export const COMMON_LINK_FIELDS = [
  'IDENTITY_CODE',
  'NRO_DOCUMENTO',
  'NUMERO_DOCUMENTO',
  'DNI',
  'RUC',
  'NUMERO_CUENTA',
  'NRO_CUENTA',
  'CUENTA',
  'CODIGO_CLIENTE',
  'ID_CLIENTE',
  'CONTRATO',
  'NUMERO_CONTRATO'
];

export interface ConsolidatedLoadResult {
  mode: LoadMode;
  mainFileResult?: any;
  complementaryResults?: ImportComplementaryResult[];
  totalProcessed: number;
  totalErrors: number;
  success: boolean;
}

/**
 * Determina el tipo de archivo basándose en el modo de carga y si ya existe un archivo principal
 * @param mode Modo de carga seleccionado
 * @param hasMainFile Si ya existe un archivo principal en la lista
 */
export function determineFileType(mode: LoadMode, hasMainFile: boolean): FileType {
  switch (mode) {
    case 'DAILY':
      // En carga diaria, el archivo siempre es principal (actualización)
      return 'MAIN';
    case 'INITIAL_MONTH':
      // En carga inicial: el primer archivo es principal, los demás son complementarios
      return hasMainFile ? 'COMPLEMENTARY' : 'MAIN';
    case 'COMPLEMENTARY':
      // En subida complementaria, todos los archivos son complementarios
      return 'COMPLEMENTARY';
  }
}

/**
 * Obtiene etiqueta legible para el tipo de archivo
 */
export function getFileTypeLabel(type: FileType): string {
  switch (type) {
    case 'MAIN': return 'Principal';
    case 'COMPLEMENTARY': return 'Complementario';
  }
}

/**
 * Valida si la extensión del archivo es válida (Excel)
 */
export function isValidExcelFile(fileName: string): boolean {
  return /\.(xlsx|xls)$/i.test(fileName);
}
