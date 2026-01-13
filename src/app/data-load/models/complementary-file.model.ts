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

export type LoadMode = 'DAILY' | 'INITIAL_MONTH' | 'PKM';

export interface FileToProcess {
  file: File;
  type: FileType;
  data?: Record<string, any>[];
  headers?: string[];
  validated: boolean;
  error?: string;
  rowCount?: number;
}

export type FileType =
  | 'DAILY'                    // Cartera_CONTACTO_TOTAL_YYYY-MM-DD.xlsx
  | 'INITIAL_MAIN'             // CONTACTO_TOTAL_ASIGNACION_YYYYMM.xlsx
  | 'COMPLEMENTARY_FACILITIES' // Facilidades_Pago_CONTACTO_TOTAL_YYYYMM.xlsx
  | 'COMPLEMENTARY_PKM'        // CONTACTO_TOTAL_PKM_MESYY.xlsx
  | 'UNKNOWN';

export interface ConsolidatedLoadResult {
  mode: LoadMode;
  mainFileResult?: any;
  complementaryResults?: ImportComplementaryResult[];
  totalProcessed: number;
  totalErrors: number;
  success: boolean;
}

// ==================== Patrones de Detección de Archivos ====================

export const FILE_PATTERNS = {
  DAILY: /Cartera_CONTACTO_TOTAL_\d{4}-\d{2}-\d{2}/i,
  INITIAL_MAIN: /CONTACTO_TOTAL_ASIGNACION_\d{6}/i,
  COMPLEMENTARY_FACILITIES: /Facilidades_Pago_CONTACTO_TOTAL_\d{6}/i,
  COMPLEMENTARY_PKM: /CONTACTO_TOTAL_PKM_/i
};

/**
 * Detecta el tipo de archivo basándose en su nombre
 */
export function detectFileTypeByName(fileName: string): FileType {
  if (FILE_PATTERNS.DAILY.test(fileName)) return 'DAILY';
  if (FILE_PATTERNS.INITIAL_MAIN.test(fileName)) return 'INITIAL_MAIN';
  if (FILE_PATTERNS.COMPLEMENTARY_FACILITIES.test(fileName)) return 'COMPLEMENTARY_FACILITIES';
  if (FILE_PATTERNS.COMPLEMENTARY_PKM.test(fileName)) return 'COMPLEMENTARY_PKM';
  return 'UNKNOWN';
}

/**
 * Obtiene etiqueta legible para el tipo de archivo
 */
export function getFileTypeLabel(type: FileType): string {
  switch (type) {
    case 'DAILY': return 'Carga Diaria';
    case 'INITIAL_MAIN': return 'Asignación Inicial';
    case 'COMPLEMENTARY_FACILITIES': return 'Facilidades de Pago';
    case 'COMPLEMENTARY_PKM': return 'PKM';
    case 'UNKNOWN': return 'Desconocido';
  }
}
