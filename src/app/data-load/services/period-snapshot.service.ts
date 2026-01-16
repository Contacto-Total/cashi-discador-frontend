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
}
