import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface SessionConfig {
  TIMEOUT_INACTIVIDAD: number; // En segundos
  TIMEOUT_WARNING: number; // En segundos
  ACCESS_TOKEN_EXPIRATION: number;
  REFRESH_TOKEN_EXPIRATION: number;
  AUTO_REFRESH_ENABLED: number; // 1=sí, 0=no
}

@Injectable({
  providedIn: 'root'
})
export class SessionConfigService {
  private readonly API_URL = `${environment.apiUrl}/configuracion/sesion`;
  private configSubject = new BehaviorSubject<SessionConfig | null>(null);
  public config$ = this.configSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarConfiguracion();
  }

  cargarConfiguracion(): Observable<SessionConfig> {
    return this.http.get<SessionConfig>(this.API_URL).pipe(
      tap(config => this.configSubject.next(config))
    );
  }

  obtenerConfig(): SessionConfig | null {
    return this.configSubject.value;
  }

  getTimeoutInactividad(): number {
    return this.configSubject.value?.TIMEOUT_INACTIVIDAD || 900; // 15 min por defecto
  }

  getTimeoutWarning(): number {
    return this.configSubject.value?.TIMEOUT_WARNING || 60; // 1 min por defecto
  }

  isAutoRefreshEnabled(): boolean {
    return this.configSubject.value?.AUTO_REFRESH_ENABLED === 1;
  }
}
