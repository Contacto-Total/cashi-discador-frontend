import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ComplementaryFileType,
  CreateComplementaryTypeRequest,
  UpdateComplementaryTypeRequest,
  ImportComplementaryRequest,
  ImportComplementaryResult,
  DetectFileTypeRequest,
  DetectFileTypeResult
} from '../models/complementary-file.model';

@Injectable({
  providedIn: 'root'
})
export class ComplementaryFileService {
  private baseUrl = `${environment.tipificacionUrl}/system-config/complementary-files`;

  constructor(private http: HttpClient) {}

  // ==================== Importación de Datos Complementarios ====================

  /**
   * Importa datos desde un archivo complementario
   * Actualiza columnas específicas de registros existentes
   */
  importComplementaryData(request: ImportComplementaryRequest): Observable<ImportComplementaryResult> {
    return this.http.post<ImportComplementaryResult>(`${this.baseUrl}/import`, request);
  }

  /**
   * Detecta el tipo de archivo complementario basándose en patrones configurados
   */
  detectFileType(request: DetectFileTypeRequest): Observable<DetectFileTypeResult> {
    return this.http.post<DetectFileTypeResult>(`${this.baseUrl}/detect-type`, request);
  }

  // ==================== CRUD de Tipos de Archivo Complementario ====================

  /**
   * Obtiene todos los tipos de archivo complementario de una subcartera
   */
  getTypesBySubPortfolio(subPortfolioId: number): Observable<ComplementaryFileType[]> {
    return this.http.get<ComplementaryFileType[]>(`${this.baseUrl}/types/subportfolio/${subPortfolioId}`);
  }

  /**
   * Obtiene un tipo de archivo por ID
   */
  getTypeById(id: number): Observable<ComplementaryFileType> {
    return this.http.get<ComplementaryFileType>(`${this.baseUrl}/types/${id}`);
  }

  /**
   * Crea un nuevo tipo de archivo complementario
   */
  createType(request: CreateComplementaryTypeRequest): Observable<ComplementaryFileType> {
    return this.http.post<ComplementaryFileType>(`${this.baseUrl}/types`, request);
  }

  /**
   * Actualiza un tipo de archivo complementario
   */
  updateType(id: number, request: UpdateComplementaryTypeRequest): Observable<ComplementaryFileType> {
    return this.http.put<ComplementaryFileType>(`${this.baseUrl}/types/${id}`, request);
  }

  /**
   * Elimina un tipo de archivo complementario
   */
  deleteType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/types/${id}`);
  }

  // ==================== Validación ====================

  /**
   * Valida que las columnas existan en la configuración de cabeceras
   */
  validateColumns(subPortfolioId: number, columns: string[]): Observable<{ valid: boolean; missingColumns: string[] }> {
    return this.http.post<{ valid: boolean; missingColumns: string[] }>(
      `${this.baseUrl}/validate-columns?subPortfolioId=${subPortfolioId}`,
      columns
    );
  }
}
