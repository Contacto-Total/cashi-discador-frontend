import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AnularPromesaRequest, PageResponse, PromesaGestion } from '../models/promise.model';

@Injectable({
  providedIn: 'root'
})
export class PromiseManagementService {
  private apiUrl = `${environment.gatewayUrl}/promesas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene lista paginada de promesas activas
   */
  getActivePromises(page: number = 0, size: number = 10): Observable<PageResponse<PromesaGestion>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<PromesaGestion>>(this.apiUrl, { params });
  }

  /**
   * Busca promesas por documento o nombre de cliente
   */
  searchActivePromises(query: string, page: number = 0, size: number = 10): Observable<PageResponse<PromesaGestion>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<PromesaGestion>>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Cuenta el total de promesas activas
   */
  countActivePromises(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/count`);
  }

  /**
   * Obtiene una promesa por ID
   */
  getPromesaById(id: number): Observable<PromesaGestion> {
    return this.http.get<PromesaGestion>(`${this.apiUrl}/${id}`);
  }

  /**
   * Anula una promesa de pago
   */
  anularPromesa(request: AnularPromesaRequest): Observable<PromesaGestion> {
    return this.http.post<PromesaGestion>(`${this.apiUrl}/anular`, request);
  }
}
