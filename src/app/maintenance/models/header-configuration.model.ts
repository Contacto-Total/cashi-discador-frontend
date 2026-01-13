export interface HeaderConfiguration {
  id: number;
  subPortfolioId: number;
  fieldDefinitionId: number;
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
export type DataType = 'TEXTO' | 'NUMERICO' | 'FECHA';
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
  fieldDefinitionId: number;
  headerName: string;
  dataType: DataType;
  displayLabel: string;
  format?: string;
  required?: boolean;
  sourceField?: string;
  regexPattern?: string;
  hasData?: boolean;          // Indica si la columna tiene datos en la tabla
}
