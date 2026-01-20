import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Representa un cliente de la tabla dinámica ini_
 */
export interface DynamicClient {
  id?: number;
  documento: string;
  nombre?: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  telefono_1?: string;
  telefono_2?: string;
  telefono_3?: string;
  email?: string;
  deuda_capital?: number;
  deuda_mora?: number;
  dias_mora?: number;
  [key: string]: any; // Permitir campos dinámicos adicionales
}

/**
 * Resultado de búsqueda global con contexto
 */
export interface GlobalSearchResult {
  tenantId: number;
  portfolioId: number;
  subPortfolioId: number;
  nombreInquilino: string;
  nombreCartera: string;
  nombreSubcartera: string;
  clientData: DynamicClient;
}

@Injectable({
  providedIn: 'root'
})
export class ClientSearchService {
  private apiUrl = `${environment.apiUrl}/client-search`;

  constructor(private http: HttpClient) {}

  /**
   * Busca un cliente globalmente solo por documento.
   * Encuentra automáticamente en qué inquilino/cartera/subcartera está.
   */
  findClientGlobal(documento: string): Observable<GlobalSearchResult> {
    const params = new HttpParams().set('documento', documento);
    return this.http.get<GlobalSearchResult>(`${this.apiUrl}/global`, { params });
  }

  /**
   * Busca un cliente por documento exacto
   */
  findClientByDocumento(
    tenantId: number,
    portfolioId: number,
    subPortfolioId: number,
    documento: string
  ): Observable<DynamicClient> {
    const params = new HttpParams()
      .set('tenantId', tenantId.toString())
      .set('portfolioId', portfolioId.toString())
      .set('subPortfolioId', subPortfolioId.toString())
      .set('documento', documento);

    return this.http.get<DynamicClient>(`${this.apiUrl}/find`, { params });
  }

  /**
   * Busca clientes por documento parcial (autocompletado)
   */
  searchClientsByDocumento(
    tenantId: number,
    portfolioId: number,
    subPortfolioId: number,
    documento: string,
    limit: number = 10
  ): Observable<DynamicClient[]> {
    const params = new HttpParams()
      .set('tenantId', tenantId.toString())
      .set('portfolioId', portfolioId.toString())
      .set('subPortfolioId', subPortfolioId.toString())
      .set('documento', documento)
      .set('limit', limit.toString());

    return this.http.get<DynamicClient[]>(`${this.apiUrl}/search`, { params });
  }
}
