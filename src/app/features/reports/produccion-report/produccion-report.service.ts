import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ReporteProduccionDTO {
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
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProduccionReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/produccion`;

  constructor(private http: HttpClient) {}

  getReporte(
    fecha?: string,
    idCartera?: number,
    idSubcartera?: number,
    horaDesde?: number,
    horaHasta?: number
  ): Observable<ReporteProduccionResponse> {
    let params = new HttpParams();

    if (fecha) params = params.set('fecha', fecha);
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    if (horaDesde !== undefined && horaDesde !== null) params = params.set('horaDesde', horaDesde.toString());
    if (horaHasta !== undefined && horaHasta !== null) params = params.set('horaHasta', horaHasta.toString());

    return this.http.get<ReporteProduccionResponse>(this.baseUrl, { params });
  }

  exportarExcel(
    fecha?: string,
    idCartera?: number,
    idSubcartera?: number,
    horaDesde?: number,
    horaHasta?: number
  ): Observable<Blob> {
    let params = new HttpParams();

    if (fecha) params = params.set('fecha', fecha);
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    if (horaDesde !== undefined && horaDesde !== null) params = params.set('horaDesde', horaDesde.toString());
    if (horaHasta !== undefined && horaHasta !== null) params = params.set('horaHasta', horaHasta.toString());

    return this.http.get(`${this.baseUrl}/excel`, {
      params,
      responseType: 'blob'
    });
  }
}
