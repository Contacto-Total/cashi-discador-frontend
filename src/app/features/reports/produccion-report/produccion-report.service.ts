import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ReporteProduccionDTO {
  idTenant: number;
  idCartera: number;
  nombreCartera: string;
  idSubcartera: number;
  nombreSubcartera: string;
  meta: number;
  generacionHoy: number;
  proyectadoHoy: number;
  pagosHoy: number;
  puntosHoyPct: number;
}

export interface ResumenProduccion {
  totalMeta: number;
  totalGeneracion: number;
  totalProyectado: number;
  totalPagos: number;
  puntosGlobalPct: number;
  totalCarteras: number;
}

export interface ReporteProduccionResponse {
  data: ReporteProduccionDTO[];
  resumen: ResumenProduccion;
  tipoMeta: TipoMetaReporteProduccion;
  valorMetaAplicada: number;
  simulada: boolean;
  total: number;
}

export type TipoMetaReporteProduccion = 'INTERNA' | 'SIP';

export interface FiltrosReporteProduccion {
  fecha?: string;
  idTenant?: number;
  idCartera?: number;
  idSubcartera?: number;
  tipoMeta: TipoMetaReporteProduccion;
  valorMetaSimulada?: number;
}

export interface MetaReporteProduccion {
  id?: number;
  idTenant: number;
  idCartera: number;
  idSubcartera: number;
  tipoMeta: TipoMetaReporteProduccion;
  valorMeta: number;
  fechaVigencia: string;
  activo: boolean;
  actualizadoPor?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface HistorialMetaReporteProduccion extends MetaReporteProduccion {
  idMetaReporteProduccion: number;
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProduccionReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/produccion`;

  constructor(private http: HttpClient) {}

  getReporte(filtros: FiltrosReporteProduccion): Observable<ReporteProduccionResponse> {
    let params = new HttpParams();

    if (filtros.fecha) params = params.set('fecha', filtros.fecha);
    if (filtros.idTenant != null) params = params.set('idTenant', filtros.idTenant.toString());
    if (filtros.idCartera != null) params = params.set('idCartera', filtros.idCartera.toString());
    if (filtros.idSubcartera != null) params = params.set('idSubcartera', filtros.idSubcartera.toString());
    params = params.set('tipoMeta', filtros.tipoMeta);
    if (filtros.valorMetaSimulada !== undefined) params = params.set('valorMetaSimulada', filtros.valorMetaSimulada.toString());

    return this.http.get<ReporteProduccionResponse>(this.baseUrl, { params });
  }

  exportarExcel(filtros: FiltrosReporteProduccion): Observable<Blob> {
    let params = new HttpParams();

    if (filtros.fecha) params = params.set('fecha', filtros.fecha);
    if (filtros.idTenant != null) params = params.set('idTenant', filtros.idTenant.toString());
    if (filtros.idCartera != null) params = params.set('idCartera', filtros.idCartera.toString());
    if (filtros.idSubcartera != null) params = params.set('idSubcartera', filtros.idSubcartera.toString());
    params = params.set('tipoMeta', filtros.tipoMeta);
    if (filtros.valorMetaSimulada !== undefined) params = params.set('valorMetaSimulada', filtros.valorMetaSimulada.toString());

    return this.http.get(`${this.baseUrl}/excel`, {
      params,
      responseType: 'blob'
    });
  }

  getMetas(idTenant: number, idCartera: number, idSubcartera: number): Observable<MetaReporteProduccion[]> {
    const params = new HttpParams()
      .set('idTenant', idTenant.toString())
      .set('idCartera', idCartera.toString())
      .set('idSubcartera', idSubcartera.toString());
    return this.http.get<MetaReporteProduccion[]>(`${this.baseUrl}/metas`, { params });
  }

  crearMeta(meta: MetaReporteProduccion): Observable<MetaReporteProduccion> {
    return this.http.post<MetaReporteProduccion>(`${this.baseUrl}/metas`, meta);
  }

  activarMeta(id: number): Observable<MetaReporteProduccion> {
    return this.http.patch<MetaReporteProduccion>(`${this.baseUrl}/metas/${id}/activar`, {});
  }

  desactivarMeta(id: number): Observable<MetaReporteProduccion> {
    return this.http.patch<MetaReporteProduccion>(`${this.baseUrl}/metas/${id}/desactivar`, {});
  }

  getHistorial(
    idTenant: number,
    idCartera: number,
    idSubcartera: number,
    tipoMeta: TipoMetaReporteProduccion,
    page: number,
    size = 10
  ): Observable<PageResponse<HistorialMetaReporteProduccion>> {
    const params = new HttpParams()
      .set('idTenant', idTenant.toString())
      .set('idCartera', idCartera.toString())
      .set('idSubcartera', idSubcartera.toString())
      .set('tipoMeta', tipoMeta)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<HistorialMetaReporteProduccion>>(`${this.baseUrl}/metas/historial`, { params });
  }
}
