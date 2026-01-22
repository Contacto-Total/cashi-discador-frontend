export interface HeaderConfiguration {
  id: number;
  subPortfolioId: number;
  fieldDefinitionId?: number;  // null para campos personalizados no vinculados al catálogo
  headerName: string;
  dataType: DataType;
  displayLabel: string;
  format?: string;
  required: boolean;
  loadType: LoadType;
  sourceField?: string;        // Campo origen para transformación
  regexPattern?: string;       // Patrón regex para extraer valor
  autoAddNewColumns?: boolean; // Auto-agregar nuevas columnas
  ignoredColumns?: string[];   // Columnas ignoradas
  aliases?: HeaderAlias[];     // Lista de alias para esta cabecera
  createdAt?: string;
  updatedAt?: string;
}

// ==================== Tipos base ====================
export type DataType = 'TEXTO' | 'NUMERICO' | 'FECHA' | 'BOOLEANO';
export type LoadType = 'INICIAL' | 'ACTUALIZACION' | 'COMPLEMENTARIO';
export type ChangeType = 'NUEVO' | 'MODIFICADO' | 'ALIAS_AGREGADO' | 'ALIAS_ELIMINADO' | 'IGNORADO' | 'REACTIVADO';

// ==================== Alias ====================
export interface HeaderAlias {
  id: number;
  headerConfigurationId: number;
  alias: string;
  isPrincipal: boolean;
  createdAt?: string;
}

export interface AddAliasRequest {
  alias: string;
  username: string;
}

// ==================== Resolución de cabeceras ====================
export interface ResolveHeadersRequest {
  subPortfolioId: number;
  loadType: LoadType;
  excelHeaders: string[];
}

export interface HeaderResolutionResult {
  matchedHeaders: MatchedHeader[];
  unrecognizedColumns: UnrecognizedColumn[];
  ignoredColumns: string[];
  totalExcelHeaders: number;
  totalMatched: number;
  totalUnrecognized: number;
  totalIgnored: number;
}

export interface MatchedHeader {
  excelColumnName: string;
  headerConfiguration: HeaderConfiguration;
  matchedByAlias: boolean;
  aliasUsed?: string;
}

export interface UnrecognizedColumn {
  columnName: string;
  sampleValues: string[];
}

// ==================== Crear nueva cabecera desde columna ====================
export interface CreateNewHeaderFromColumnRequest {
  subPortfolioId: number;
  loadType: LoadType;
  headerName: string;
  dataType: DataType;
  displayLabel: string;
  format?: string;
  required: boolean;
  username: string;
}

// ==================== Ignorar columna ====================
export interface IgnoreColumnRequest {
  subPortfolioId: number;
  loadType: LoadType;
  columnName: string;
  username: string;
}

// ==================== Historial de cambios ====================
export interface HeaderChangeHistory {
  id: number;
  subPortfolioId: number;
  loadType: LoadType;
  changeType: ChangeType;
  excelColumnName?: string;
  internalHeaderName?: string;
  headerConfigurationId?: number;
  username: string;
  changedAt: string;
}

export interface CreateHeaderConfigurationRequest {
  subPortfolioId: number;
  fieldDefinitionId: number;
  headerName: string;
  dataType: DataType;
  displayLabel: string;
  format?: string;
  required?: boolean;
  loadType: LoadType;
  sourceField?: string;
  regexPattern?: string;
}

export interface UpdateHeaderConfigurationRequest {
  dataType?: DataType;
  displayLabel?: string;
  format?: string;
  required?: boolean;
  loadType?: LoadType;
}

export interface BulkCreateHeaderConfigurationRequest {
  subPortfolioId: number;
  loadType: LoadType;
  headers: HeaderConfigurationItem[];
}

export interface HeaderConfigurationItem {
  id?: number;                // ID si ya existe en BD (undefined = nuevo)
  fieldDefinitionId?: number; // null para campos personalizados no vinculados al catálogo
  headerName: string;
  dataType: DataType;
  displayLabel: string;
  format?: string;
  required?: boolean;
  sourceField?: string;
  regexPattern?: string;
  hasData?: boolean;          // Indica si la columna tiene datos en la tabla
}

// ==================== Importar desde otra subcartera ====================

export interface ImportPreviewResult {
  sourceSubPortfolioId: number;
  sourceSubPortfolioName: string;
  targetSubPortfolioId: number;
  targetSubPortfolioName: string;
  loadType: LoadType;
  headersToImport: HeaderPreviewItem[];
  conflicts: ConflictItem[];
  totalNew: number;
  totalConflicts: number;
}

export interface HeaderPreviewItem {
  headerName: string;
  dataType: DataType;
  displayLabel: string;
  hasAliases: boolean;
  aliasCount: number;
  // Campos adicionales para agregar a memoria local
  fieldDefinitionId?: number;
  format?: string;
  required?: boolean;
  sourceField?: string;
  regexPattern?: string;
}

export interface ConflictItem {
  headerName: string;
  sourceDisplayLabel: string;
  targetDisplayLabel: string;
}

export interface ImportFromSubPortfolioRequest {
  sourceSubPortfolioId: number;
  loadType: LoadType;
  conflictResolution: ConflictResolution;
  headersToReplace?: string[];
}

export interface ImportResult {
  success: boolean;
  headersImported: number;
  headersSkipped: number;
  headersReplaced: number;
  aliasesImported: number;
  errors: string[];
}

export type ConflictResolution = 'SKIP' | 'REPLACE' | 'SELECTIVE';
