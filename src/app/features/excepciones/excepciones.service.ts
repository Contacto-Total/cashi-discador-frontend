import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CuotaExcepcion {
  numeroCuota: number;
  monto: number;
  fechaPago: string;
}

export interface ExcepcionPendiente {
  id: number;
  grupoPromesaUuid: string;
  documentoCliente: string;
  nombreCliente: string;
  idAgente: number;
  nombreAgente: string;
  montoPromesa: number;
  montoBase: number | null;
  campoMontoOrigen: string;
  totalCuotas: number;
  idTenant: number;
  nombreTenant: string;
  idCartera: number;
  nombreCartera: string;
  idSubcartera: number;
  nombreSubcartera: string;
  tipificacionCompleta: string;
  fechaGestion: string;
  fechaCreacion: string;
  observaciones: string;
  cuotas: CuotaExcepcion[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExcepcionesService {
  private readonly baseUrl = `${environment.gatewayUrl}/excepciones`;

  // Signals para estado reactivo
  readonly excepciones = signal<ExcepcionPendiente[]>([]);
  readonly totalExcepciones = signal<number>(0);
  readonly cargando = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('callcenter_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Obtiene excepciones pendientes paginadas
   */
  getExcepcionesPendientes(page: number = 0, size: number = 20, idTenant?: number): Observable<PageResponse<ExcepcionPendiente>> {
    this.cargando.set(true);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (idTenant) {
      params = params.set('idTenant', idTenant.toString());
    }

    return this.http.get<PageResponse<ExcepcionPendiente>>(
      `${this.baseUrl}/pendientes`,
      { headers: this.getHeaders(), params }
    ).pipe(
      tap(response => {
        this.excepciones.set(response.content);
        this.totalExcepciones.set(response.totalElements);
        this.cargando.set(false);
      })
    );
  }

  /**
   * Cuenta excepciones pendientes
   */
  countExcepcionesPendientes(idTenant?: number): Observable<{ count: number }> {
    let params = new HttpParams();
    if (idTenant) {
      params = params.set('idTenant', idTenant.toString());
    }

    return this.http.get<{ count: number }>(
      `${this.baseUrl}/pendientes/count`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Obtiene una excepción por ID
   */
  getExcepcion(id: number): Observable<ExcepcionPendiente> {
    return this.http.get<ExcepcionPendiente>(
      `${this.baseUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Aprueba una excepción
   */
  aprobarExcepcion(id: number, comentarios?: string): Observable<ExcepcionPendiente> {
    return this.http.post<ExcepcionPendiente>(
      `${this.baseUrl}/${id}/aprobar`,
      { comentarios },
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        // Remover de la lista local
        this.excepciones.update(list => list.filter(e => e.id !== id));
        this.totalExcepciones.update(count => count - 1);
      })
    );
  }

  /**
   * Rechaza una excepción
   */
  rechazarExcepcion(id: number, motivo: string): Observable<ExcepcionPendiente> {
    return this.http.post<ExcepcionPendiente>(
      `${this.baseUrl}/${id}/rechazar`,
      { motivo },
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        // Remover de la lista local
        this.excepciones.update(list => list.filter(e => e.id !== id));
        this.totalExcepciones.update(count => count - 1);
      })
    );
  }
}
