import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface FirstInstallmentConfig {
  id?: number;
  subPortfolioId: number;
  maxDays: number | null;  // Máximo de días permitidos para la primera cuota (1-12). null = sin límite
  createdAt?: string;
  updatedAt?: string;
}

export interface FirstInstallmentValidationResult {
  valid: boolean;
  requiresApproval: boolean;
  maxDays: number | null;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirstInstallmentConfigService {
  private readonly baseUrl = `${environment.gatewayUrl}/configuracion-primera-cuota`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la configuración de días máximos para la primera cuota de una subcartera
   * @param subPortfolioId ID de la subcartera
   * @returns Configuración o null si no existe
   */
  getConfig(subPortfolioId: number): Observable<FirstInstallmentConfig | null> {
    return this.http.get<FirstInstallmentConfig>(`${this.baseUrl}/subcartera/${subPortfolioId}`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          // No existe configuración, retornar null
          return of(null);
        }
        throw error;
      })
    );
  }

  /**
   * Guarda o actualiza la configuración de días máximos para la primera cuota
   * @param config Configuración a guardar
   */
  saveConfig(config: FirstInstallmentConfig): Observable<FirstInstallmentConfig> {
    return this.http.post<FirstInstallmentConfig>(this.baseUrl, config);
  }

  /**
   * Valida si una fecha de primera cuota está dentro del rango permitido (local)
   * @param maxDays Máximo de días configurado
   * @param daysFromToday Días desde hoy hasta la fecha de la primera cuota
   * @returns true si está dentro del rango, false si es excepción
   */
  isWithinAllowedRange(maxDays: number | null, daysFromToday: number): boolean {
    // Si no hay configuración, cualquier día es válido
    if (maxDays === null || maxDays === undefined) {
      return true;
    }
    return daysFromToday <= maxDays;
  }

  /**
   * Valida una fecha de primera cuota contra la configuración del backend
   * @param subPortfolioId ID de la subcartera
   * @param daysFromToday Días desde hoy hasta la fecha de la primera cuota
   * @returns Resultado de validación con info de si requiere aprobación
   */
  validateDays(subPortfolioId: number, daysFromToday: number): Observable<FirstInstallmentValidationResult> {
    return this.http.get<FirstInstallmentValidationResult>(
      `${this.baseUrl}/subcartera/${subPortfolioId}/validar/${daysFromToday}`
    );
  }
}
