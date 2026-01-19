import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PeriodStatusResponse {
  subPortfolioId: number;
  tableName: string;
  hasExistingData: boolean;
  recordCount: number;
  currentPeriod: string | null;
  lastLoadDate: string | null;
  lastArchivedPeriod: string | null;
  requiresConfirmation: boolean;
}

export interface SnapshotResultResponse {
  success: boolean;
  tablesArchived: number;
  archivePeriod: string | null;
  message: string;
  executionTimeMs: number;
}

export interface RequiresConfirmationResponse {
  requiresConfirmation: boolean;
  recordCount: number;
  currentPeriod: string;
  tableName: string;
}

// ==================== Interfaces para Snapshot Diario ====================

export interface DailyStatusResponse {
  subPortfolioId: number;
  tableName: string;
  hasExistingData: boolean;
  recordCount: number;
  lastLoadDate: string | null;
  lastArchivedDate: string | null;
  requiresConfirmation: boolean;
}

export interface DailyRequiresConfirmationResponse {
  requiresConfirmation: boolean;
  recordCount: number;
  lastLoadDate: string;
  tableName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodSnapshotService {
  private baseUrl = `${environment.tipificacionUrl}/system-config/period-snapshot`;

  constructor(private http: HttpClient) {}

  /**
   * Verifica el estado del periodo para una subcartera
   * @param subPortfolioId ID de la subcartera
   */
  checkPeriodStatus(subPortfolioId: number): Observable<PeriodStatusResponse> {
    return this.http.get<PeriodStatusResponse>(
      `${this.baseUrl}/subportfolio/${subPortfolioId}/status`
    );
  }

  /**
   * Verifica si se requiere confirmación de cambio de periodo
   * @param subPortfolioId ID de la subcartera
   */
  requiresConfirmation(subPortfolioId: number): Observable<RequiresConfirmationResponse> {
    return this.http.get<RequiresConfirmationResponse>(
      `${this.baseUrl}/subportfolio/${subPortfolioId}/requires-confirmation`
    );
  }

  /**
   * Ejecuta snapshot para una subcartera específica
   * @param subPortfolioId ID de la subcartera
   */
  executeSnapshotForSubPortfolio(subPortfolioId: number): Observable<SnapshotResultResponse> {
    return this.http.post<SnapshotResultResponse>(
      `${this.baseUrl}/subportfolio/${subPortfolioId}/execute`,
      {}
    );
  }

  /**
   * Ejecuta snapshot global de todas las carteras
   */
  executeGlobalSnapshot(): Observable<SnapshotResultResponse> {
    return this.http.post<SnapshotResultResponse>(
      `${this.baseUrl}/execute-global`,
      {}
    );
  }

  /**
   * Obtiene el último periodo archivado para una subcartera
   * @param subPortfolioId ID de la subcartera
   */
  getLastArchivedPeriod(subPortfolioId: number): Observable<{
    subPortfolioId: number;
    lastArchivedPeriod: string | null;
    hasArchivedData: boolean;
  }> {
    return this.http.get<any>(
      `${this.baseUrl}/subportfolio/${subPortfolioId}/last-archived`
    );
  }

  // ==================== Métodos para Snapshot Diario ====================

  /**
   * Verifica el estado diario para una subcartera (tabla de actualización)
   * @param subPortfolioId ID de la subcartera
   */
  checkDailyStatus(subPortfolioId: number): Observable<DailyStatusResponse> {
    return this.http.get<DailyStatusResponse>(
      `${this.baseUrl}/subportfolio/${subPortfolioId}/daily-status`
    );
  }

  /**
   * Verifica si se requiere confirmación para carga diaria
   * @param subPortfolioId ID de la subcartera
   */
  requiresDailyConfirmation(subPortfolioId: number): Observable<DailyRequiresConfirmationResponse> {
    return this.http.get<DailyRequiresConfirmationResponse>(
      `${this.baseUrl}/subportfolio/${subPortfolioId}/daily-requires-confirmation`
    );
  }

  /**
   * Ejecuta snapshot diario para una subcartera específica
   * @param subPortfolioId ID de la subcartera
   */
  executeDailySnapshotForSubPortfolio(subPortfolioId: number): Observable<SnapshotResultResponse> {
    return this.http.post<SnapshotResultResponse>(
      `${this.baseUrl}/subportfolio/${subPortfolioId}/daily-execute`,
      {}
    );
  }

  /**
   * Obtiene la última fecha de archivo diario para una subcartera
   * @param subPortfolioId ID de la subcartera
   */
  getLastArchivedDailyDate(subPortfolioId: number): Observable<{
    subPortfolioId: number;
    lastArchivedDate: string | null;
    hasArchivedData: boolean;
  }> {
    return this.http.get<any>(
      `${this.baseUrl}/subportfolio/${subPortfolioId}/last-daily-archived`
    );
  }
}
