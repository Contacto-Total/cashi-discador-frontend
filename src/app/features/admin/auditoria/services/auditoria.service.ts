import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  ConfigAuditoria,
  ConfigAuditoriaLog,
  LlamadaTiming,
  LlamadasPage
} from '../models/auditoria.model';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {

  private readonly base = `${environment.apiUrl}/admin/auditoria`;

  constructor(private http: HttpClient) {}

  // --- Config switch ---------------------------------------------------------

  getConfig(): Observable<ConfigAuditoria> {
    return this.http.get<ConfigAuditoria>(`${this.base}/config`);
  }

  toggle(activo: boolean): Observable<ConfigAuditoria> {
    const params = new HttpParams().set('activo', activo);
    return this.http.post<ConfigAuditoria>(`${this.base}/config/toggle`, null, { params });
  }

  getConfigLog(limit: number = 50): Observable<ConfigAuditoriaLog[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<ConfigAuditoriaLog[]>(`${this.base}/config/log`, { params });
  }

  // --- Llamadas --------------------------------------------------------------

  listarLlamadas(
    fecha?: string,        // YYYY-MM-DD
    estado?: string,
    page: number = 0,
    size: number = 20
  ): Observable<LlamadasPage> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (fecha) params = params.set('fecha', fecha);
    if (estado) params = params.set('estado', estado);
    return this.http.get<LlamadasPage>(`${this.base}/llamadas`, { params });
  }

  detalleLlamada(uuid: string): Observable<LlamadaTiming> {
    return this.http.get<LlamadaTiming>(`${this.base}/llamadas/${encodeURIComponent(uuid)}`);
  }
}
