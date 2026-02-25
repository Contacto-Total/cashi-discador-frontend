import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ReporteGestionesDTO,
  ResumenMetricas,
  ReporteResponse
} from '../gestiones-report/gestiones-report.service';

export interface AgenteCompromiso {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompromisosReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/gestiones/compromisos`;

  constructor(private http: HttpClient) {}

  getTiposCompromiso(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/tipos`);
  }

  getEstadosCompromiso(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/estados`);
  }

  getAgentesCompromiso(): Observable<AgenteCompromiso[]> {
    return this.http.get<AgenteCompromiso[]>(`${this.baseUrl}/agentes`);
  }

  getReporte(
    fechaDesde?: string,
    fechaHasta?: string,
    idCartera?: number,
    idSubcartera?: number,
    idAgente?: number,
    estadoPago?: string,
    rutaNivel2?: string,
    documento?: string,
    nombre?: string,
    page: number = 0,
    size: number = 50
  ): Observable<ReporteResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    if (idAgente) params = params.set('idAgente', idAgente.toString());
    if (estadoPago) params = params.set('estadoPago', estadoPago);
    if (rutaNivel2) params = params.set('rutaNivel2', rutaNivel2);
    if (documento) params = params.set('documento', documento);
    if (nombre) params = params.set('nombre', nombre);

    return this.http.get<ReporteResponse>(this.baseUrl, { params });
  }

  exportarExcel(
    fechaDesde?: string,
    fechaHasta?: string,
    idCartera?: number,
    idSubcartera?: number,
    idAgente?: number,
    estadoPago?: string,
    rutaNivel2?: string,
    documento?: string,
    nombre?: string
  ): Observable<Blob> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    if (idAgente) params = params.set('idAgente', idAgente.toString());
    if (estadoPago) params = params.set('estadoPago', estadoPago);
    if (rutaNivel2) params = params.set('rutaNivel2', rutaNivel2);
    if (documento) params = params.set('documento', documento);
    if (nombre) params = params.set('nombre', nombre);

    return this.http.get(`${this.baseUrl}/excel`, {
      params,
      responseType: 'blob'
    });
  }
}
