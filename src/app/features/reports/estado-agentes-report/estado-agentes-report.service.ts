import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface RegistroEstadoDTO {
  idHistory: number;
  idUsuario: number;
  nombreAgente: string;
  username: string;
  estadoAnterior: string | null;
  estadoNuevo: string;
  timestampInicio: string;
  timestampFin: string;
  duracionMinutos: number | null;
  duracionFormateada: string;
  notas: string | null;
  sessionId: string | null;
}

export interface ResumenPorAgente {
  idUsuario: number;
  nombreAgente: string;
  username: string;
  minutoPorEstado: { [estado: string]: number };
  totalMinutosConectado: number;
  totalMinutosProductivo: number;
  totalMinutosBreak: number;
  porcentajeOcupacion: number;
  tiempoConectadoFormateado: string;
  tiempoProductivoFormateado: string;
  tiempoBreakFormateado: string;
}

export interface ResumenEstadoAgentes {
  totalRegistros: number;
  totalAgentes: number;
  totalCambiosEstado: number;
  agentes: ResumenPorAgente[];
}

export interface ReporteEstadoAgentesResponse {
  registros: RegistroEstadoDTO[];
  resumen: ResumenEstadoAgentes;
  total: number;
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstadoAgentesReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/estado-agentes`;

  constructor(private http: HttpClient) {}

  getReporte(
    fechaDesde: string,
    fechaHasta: string,
    tenantId?: number,
    carteraId?: number,
    subcarteraId?: number,
    page: number = 0,
    size: number = 50
  ): Observable<ReporteEstadoAgentesResponse> {
    let params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta)
      .set('page', page.toString())
      .set('size', size.toString());

    if (tenantId) params = params.set('tenantId', tenantId.toString());
    if (carteraId) params = params.set('carteraId', carteraId.toString());
    if (subcarteraId) params = params.set('subcarteraId', subcarteraId.toString());

    return this.http.get<ReporteEstadoAgentesResponse>(this.baseUrl, { params });
  }

  exportarExcel(
    fechaDesde: string,
    fechaHasta: string,
    tenantId?: number,
    carteraId?: number,
    subcarteraId?: number
  ): Observable<Blob> {
    let params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);

    if (tenantId) params = params.set('tenantId', tenantId.toString());
    if (carteraId) params = params.set('carteraId', carteraId.toString());
    if (subcarteraId) params = params.set('subcarteraId', subcarteraId.toString());

    return this.http.get(`${this.baseUrl}/excel`, {
      params,
      responseType: 'blob'
    });
  }
}
