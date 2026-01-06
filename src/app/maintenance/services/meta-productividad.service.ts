import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MetaProductividad } from '../models/meta-productividad.model';

@Injectable({
  providedIn: 'root'
})
export class MetaProductividadService {
  private readonly apiUrl = `${environment.apiUrl}/metas-productividad`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MetaProductividad[]> {
    return this.http.get<MetaProductividad[]>(this.apiUrl);
  }

  getById(id: number): Observable<MetaProductividad> {
    return this.http.get<MetaProductividad>(`${this.apiUrl}/${id}`);
  }

  getByTenant(tenantId: number): Observable<MetaProductividad[]> {
    return this.http.get<MetaProductividad[]>(`${this.apiUrl}/tenant/${tenantId}`);
  }

  getMetaAplicable(tenantId?: number, carteraId?: number, subcarteraId?: number): Observable<MetaProductividad> {
    let params = new HttpParams();
    if (tenantId) params = params.set('tenantId', tenantId.toString());
    if (carteraId) params = params.set('carteraId', carteraId.toString());
    if (subcarteraId) params = params.set('subcarteraId', subcarteraId.toString());

    return this.http.get<MetaProductividad>(`${this.apiUrl}/aplicable`, { params });
  }

  create(meta: MetaProductividad): Observable<MetaProductividad> {
    return this.http.post<MetaProductividad>(this.apiUrl, meta);
  }

  update(id: number, meta: MetaProductividad): Observable<MetaProductividad> {
    return this.http.put<MetaProductividad>(`${this.apiUrl}/${id}`, meta);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
