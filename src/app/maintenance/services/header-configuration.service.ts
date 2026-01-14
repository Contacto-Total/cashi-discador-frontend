import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  HeaderConfiguration,
  CreateHeaderConfigurationRequest,
  UpdateHeaderConfigurationRequest,
  BulkCreateHeaderConfigurationRequest,
  LoadType,
  HeaderAlias,
  AddAliasRequest,
  ResolveHeadersRequest,
  HeaderResolutionResult,
  CreateNewHeaderFromColumnRequest,
  IgnoreColumnRequest,
  HeaderChangeHistory
} from '../models/header-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class HeaderConfigurationService {
  private baseUrl = `${environment.tipificacionUrl}/system-config/header-configurations`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las configuraciones de cabeceras de una subcartera
   */
  getBySubPortfolio(subPortfolioId: number): Observable<HeaderConfiguration[]> {
    return this.http.get<HeaderConfiguration[]>(`${this.baseUrl}/subportfolio/${subPortfolioId}`);
  }

  /**
   * Obtiene todas las configuraciones de cabeceras de una subcartera filtradas por tipo de carga
   */
  getBySubPortfolioAndLoadType(subPortfolioId: number, loadType: LoadType): Observable<HeaderConfiguration[]> {
    return this.http.get<HeaderConfiguration[]>(`${this.baseUrl}/subportfolio/${subPortfolioId}/load-type/${loadType}`);
  }

  /**
   * Obtiene una configuración específica por ID
   */
  getById(id: number): Observable<HeaderConfiguration> {
    return this.http.get<HeaderConfiguration>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crea una nueva configuración de cabecera
   */
  create(request: CreateHeaderConfigurationRequest): Observable<HeaderConfiguration> {
    return this.http.post<HeaderConfiguration>(this.baseUrl, request);
  }

  /**
   * Crea múltiples configuraciones en lote (para importar CSV)
   */
  createBulk(request: BulkCreateHeaderConfigurationRequest): Observable<HeaderConfiguration[]> {
    return this.http.post<HeaderConfiguration[]>(`${this.baseUrl}/bulk`, request);
  }

  /**
   * Actualiza una configuración existente
   */
  update(id: number, request: UpdateHeaderConfigurationRequest): Observable<HeaderConfiguration> {
    return this.http.put<HeaderConfiguration>(`${this.baseUrl}/${id}`, request);
  }

  /**
   * Elimina una configuración
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Elimina todas las configuraciones de una subcartera y tipo de carga específicos
   */
  deleteAllBySubPortfolioAndLoadType(subPortfolioId: number, loadType: LoadType): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subportfolio/${subPortfolioId}/load-type/${loadType}`);
  }

  /**
   * Cuenta cuántas configuraciones tiene una subcartera
   */
  countBySubPortfolio(subPortfolioId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/subportfolio/${subPortfolioId}/count`);
  }

  /**
   * Importa datos masivos a la tabla dinámica de una subcartera
   */
  importData(subPortfolioId: number, loadType: LoadType, data: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/subportfolio/${subPortfolioId}/import-data`, {
      subPortfolioId,
      loadType,
      data
    });
  }

  /**
   * Actualiza datos complementarios en la tabla dinámica existente
   * Usado para archivos como PKM y Facilidades que actualizan columnas específicas
   * de registros existentes basándose en un campo de enlace (linkField)
   */
  updateComplementaryData(subPortfolioId: number, loadType: LoadType, data: any[], linkField: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/subportfolio/${subPortfolioId}/update-complementary`, {
      subPortfolioId,
      loadType,
      data,
      linkField
    });
  }

  // ==================== Resolución de cabeceras ====================

  /**
   * Resuelve las cabeceras del Excel contra las configuradas
   * Identifica cabeceras coincidentes, no reconocidas e ignoradas
   */
  resolveHeaders(request: ResolveHeadersRequest): Observable<HeaderResolutionResult> {
    return this.http.post<HeaderResolutionResult>(`${this.baseUrl}/resolve-headers`, request);
  }

  // ==================== Gestión de Alias ====================

  /**
   * Obtiene todos los alias de una cabecera específica
   */
  getAliases(headerConfigId: number): Observable<HeaderAlias[]> {
    return this.http.get<HeaderAlias[]>(`${this.baseUrl}/${headerConfigId}/aliases`);
  }

  /**
   * Agrega un nuevo alias a una cabecera
   */
  addAlias(headerConfigId: number, request: AddAliasRequest): Observable<HeaderAlias> {
    return this.http.post<HeaderAlias>(`${this.baseUrl}/${headerConfigId}/aliases`, request);
  }

  /**
   * Elimina un alias
   */
  removeAlias(aliasId: number, username: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/aliases/${aliasId}`, {
      params: { username }
    });
  }

  // ==================== Crear cabecera desde columna ====================

  /**
   * Crea una nueva cabecera desde una columna no reconocida del Excel
   */
  createFromColumn(request: CreateNewHeaderFromColumnRequest): Observable<HeaderConfiguration> {
    return this.http.post<HeaderConfiguration>(`${this.baseUrl}/create-from-column`, request);
  }

  // ==================== Columnas ignoradas ====================

  /**
   * Marca una columna como ignorada
   */
  ignoreColumn(request: IgnoreColumnRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/ignore-column`, request);
  }

  /**
   * Obtiene la lista de columnas ignoradas para una subcartera y tipo de carga
   */
  getIgnoredColumns(subPortfolioId: number, loadType: LoadType): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/subportfolio/${subPortfolioId}/load-type/${loadType}/ignored-columns`);
  }

  /**
   * Reactiva una columna previamente ignorada
   */
  reactivateColumn(subPortfolioId: number, loadType: LoadType, columnName: string, username: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subportfolio/${subPortfolioId}/load-type/${loadType}/ignored-columns/${encodeURIComponent(columnName)}`, {
      params: { username }
    });
  }

  // ==================== Historial de cambios ====================

  /**
   * Obtiene el historial de cambios de cabeceras de una subcartera
   */
  getChangeHistory(subPortfolioId: number): Observable<HeaderChangeHistory[]> {
    return this.http.get<HeaderChangeHistory[]>(`${this.baseUrl}/subportfolio/${subPortfolioId}/change-history`);
  }
}
