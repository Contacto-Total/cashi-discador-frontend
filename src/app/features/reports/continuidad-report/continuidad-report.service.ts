import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ReporteContinuidadDTO {
  idGestionContinuidad: number;
  idGestionOriginal: number;
  documentoCliente: string;
  nombreCliente: string;
  nombreCartera: string;
  nombreSubcartera: string;
  promesaOrigenUuid: string;
  montoOriginalPromesa: number;
  montoPagadoPrevio: number;
  saldoAlCrearContinuidad: number;
  fechaPromesaOriginal: string;
  agentePromesaOriginal: string;
  estadoPromesaOriginal: string;
  uuidContinuidad: string;
  fechaContinuidad: string;
  asesorContinuidad: string;
  montoContinuidad: number;
  cuotasContinuidad: number;
  estadoContinuidad: string;
  pagadoEnContinuidad: number;
  pendienteContinuidad: number;
  totalPagadoAcumulado: number;
  porcentajeAvance: number;
}

export interface ResumenMetricas {
  totalContinuidades: number;
  continuidadesPendientes: number;
  continuidadesPagadas: number;
  continuidadesVencidas: number;
  montoTotalOriginal: number;
  montoTotalPagadoPrevio: number;
  montoTotalContinuidad: number;
  montoTotalPagadoContinuidad: number;
  montoTotalPendiente: number;
  porcentajeRecuperacionPromedio: number;
}

export interface ReporteResponse {
  data: ReporteContinuidadDTO[];
  metricas: ResumenMetricas;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContinuidadReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/continuidad`;

  constructor(private http: HttpClient) {}

  getReporte(
    fechaDesde?: string,
    fechaHasta?: string,
    idCartera?: number,
    idSubcartera?: number
  ): Observable<ReporteResponse> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());

    return this.http.get<ReporteResponse>(this.baseUrl, { params });
  }

  exportarExcel(
    fechaDesde?: string,
    fechaHasta?: string,
    idCartera?: number,
    idSubcartera?: number
  ): Observable<Blob> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());

    return this.http.get(`${this.baseUrl}/excel`, {
      params,
      responseType: 'blob'
    });
  }
}
