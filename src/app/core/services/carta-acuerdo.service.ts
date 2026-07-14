import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface VerificarPromesaResponse {
  tienePromesaPendiente: boolean;
  idGestion?: number;
}

export interface CartaGeneradaHistorial {
  id: number;
  idGestion: number;
  idCliente: number;
  idAgente: number;
  codigoPlantilla: string;
  fechaGeneracion: string;
}

export interface CartaPendiente {
  idGestion: number;
  documentoCliente: string;
  nombreCliente: string;
  montoPromesa: number;
  totalCuotas: number;
  fechaGestion: string;
  idAgente: number;
  nombreAgente: string;
  nombreTenant: string;
  nombreCartera: string;
  nombreSubcartera: string;
}

export interface CartasPendientesResponse {
  success: boolean;
  total: number;
  page: number;
  size: number;
  totalPages: number;
  data: CartaPendiente[];
}

@Injectable({
  providedIn: 'root'
})
export class CartaAcuerdoService {
  private apiUrl = `${environment.apiUrl}/cartas`;

  constructor(private http: HttpClient) {}

  /**
   * Verifica si un cliente tiene una promesa de pago pendiente
   */
  verificarPromesaPendiente(idCliente: number): Observable<VerificarPromesaResponse> {
    return this.http.get<VerificarPromesaResponse>(`${this.apiUrl}/verificar-promesa/${idCliente}`);
  }

  /**
   * Genera la carta de acuerdo automáticamente desde una gestión
   * Retorna el PDF como Blob
   */
  generarCarta(idGestion: number, idAgente: number): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generar/${idGestion}?idAgente=${idAgente}`, null, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  /**
   * Obtiene el historial de cartas generadas para un cliente
   */
  obtenerHistorial(idCliente: number): Observable<CartaGeneradaHistorial[]> {
    return this.http.get<CartaGeneradaHistorial[]>(`${this.apiUrl}/historial/${idCliente}`);
  }

  /**
   * Verifica si una subcartera tiene plantilla de carta asignada.
   * Usa el listado de asignaciones porque GET /asignacion/{id} responde 500
   * (bug del backend: Map.of con data null en la rama sin asignación).
   */
  tienePlantillaSubcartera(idSubcartera: number): Observable<boolean> {
    return this.http.get<{ success: boolean, data: any[] }>(`${environment.apiUrl}/plantillas-carta/asignaciones`).pipe(
      map(resp => (resp?.data || []).some(a => Number(a.idSubcartera) === Number(idSubcartera)))
    );
  }

  /**
   * Descarga el PDF generado
   */
  descargarPdf(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Obtiene la lista de cartas de acuerdo pendientes por generar
   */
  obtenerCartasPendientes(filtros?: {
    page?: number;
    size?: number;
    sort?: string;
    tenantId?: number;
    subPortfolioId?: number;
    agenteId?: number;
    fechaInicio?: string;
    fechaFin?: string;
  }): Observable<CartasPendientesResponse> {
    let params: any = {};
    if (filtros?.page !== undefined) params.page = filtros.page;
    if (filtros?.size !== undefined) params.size = filtros.size;
    if (filtros?.sort) params.sort = filtros.sort;
    if (filtros?.tenantId) params.tenantId = filtros.tenantId;
    if (filtros?.subPortfolioId) params.subPortfolioId = filtros.subPortfolioId;
    if (filtros?.agenteId) params.agenteId = filtros.agenteId;
    if (filtros?.fechaInicio) params.fechaInicio = filtros.fechaInicio;
    if (filtros?.fechaFin) params.fechaFin = filtros.fechaFin;

    return this.http.get<CartasPendientesResponse>(`${this.apiUrl}/pendientes`, { params });
  }

  /**
   * Cuenta el total de cartas de acuerdo pendientes
   */
  contarCartasPendientes(tenantId?: number, agenteId?: number): Observable<{success: boolean, total: number}> {
    let params: any = {};
    if (tenantId) params.tenantId = tenantId;
    if (agenteId) params.agenteId = agenteId;

    return this.http.get<{success: boolean, total: number}>(`${this.apiUrl}/pendientes/count`, { params });
  }
}
