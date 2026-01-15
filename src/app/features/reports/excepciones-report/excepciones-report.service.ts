import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ReporteExcepcionDTO {
  id: number;
  grupoPromesaUuid: string;
  documentoCliente: string;
  nombreCliente: string;
  idTenant: number;
  nombreTenant: string;
  idCartera: number;
  nombreCartera: string;
  idSubcartera: number;
  nombreSubcartera: string;
  idAgente: number;
  nombreAgente: string;
  montoBase: number | null;
  montoPromesa: number;
  diferencia: number;
  campoMontoOrigen: string;
  totalCuotas: number;
  fechaGestion: string;
  fechaCreacion: string;
  estadoPago: string;
  tipificacionCompleta: string;
  observaciones: string;
  fechaAprobacion: string | null;
  idUsuarioAprobador: number | null;
  nombreAprobador: string | null;
  motivoRechazo: string | null;
}

export interface ResumenMetricas {
  totalExcepciones: number;
  excepcionesPendientes: number;
  excepcionesAprobadas: number;
  excepcionesRechazadas: number;
  montoTotalSolicitado: number;
  montoTotalBase: number;
  diferenciaTotalPositiva: number;
  diferenciaTotalNegativa: number;
  promedioMontoSolicitado: number;
}

export interface ReporteResponse {
  data: ReporteExcepcionDTO[];
  metricas: ResumenMetricas;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExcepcionesReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/excepciones`;

  constructor(private http: HttpClient) {}

  getReporte(
    fechaDesde?: string,
    fechaHasta?: string,
    idCartera?: number,
    idSubcartera?: number,
    estado?: string
  ): Observable<ReporteResponse> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    if (estado) params = params.set('estado', estado);

    return this.http.get<ReporteResponse>(this.baseUrl, { params });
  }

  exportarExcel(
    fechaDesde?: string,
    fechaHasta?: string,
    idCartera?: number,
    idSubcartera?: number,
    estado?: string
  ): Observable<Blob> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    if (estado) params = params.set('estado', estado);

    return this.http.get(`${this.baseUrl}/excel`, {
      params,
      responseType: 'blob'
    });
  }
}
