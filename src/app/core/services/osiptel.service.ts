import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * DTO devuelto por web-service-cashi:
 *   GET /api/v1/osiptel/validations/{phone}
 *
 * Estado especial 'NOT_CHECKED' = aún no se validó el número en Osiptel.
 */
export interface OsiptelValidation {
  phone: string;
  status:
    | 'NOT_CHECKED'
    | 'PENDING'
    | 'IN_PROGRESS'
    | 'OK'
    | 'NOT_FOUND'
    | 'FAILED'
    | 'EXPIRED';
  dniMatch: boolean | null;
  operator: 'CLARO' | 'MOVISTAR' | 'ENTEL' | 'BITEL' | 'OTRO' | null;
  checkedAt: string | null;
  cooldownUntil: string | null;
  attempts: number;
}

@Injectable({ providedIn: 'root' })
export class OsiptelService {
  private readonly apiUrl = `${environment.webServiceUrl}/api/v1/osiptel`;
  private readonly cache = new Map<string, Observable<OsiptelValidation | null>>();

  constructor(private http: HttpClient) {}

  /**
   * Devuelve la última validación conocida para un teléfono.
   * Si el backend está bloqueado por Legal (HTTP 423) o el endpoint no existe (404),
   * retorna null silenciosamente para no romper la pantalla.
   *
   * Cachea el observable por número durante la vida del componente (shareReplay).
   */
  getValidation(phone: string): Observable<OsiptelValidation | null> {
    if (!phone || !/^9\d{8}$/.test(phone)) {
      return of(null);
    }
    const cached = this.cache.get(phone);
    if (cached) return cached;

    const obs = this.http
      .get<OsiptelValidation>(`${this.apiUrl}/validations/${encodeURIComponent(phone)}`)
      .pipe(
        catchError(() => of(null)),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    this.cache.set(phone, obs);
    return obs;
  }

  /**
   * Invalida el cache del frontend para un número (útil tras un re-encolado manual).
   */
  invalidate(phone: string): void {
    this.cache.delete(phone);
  }
}
