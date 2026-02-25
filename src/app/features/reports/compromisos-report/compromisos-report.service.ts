import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ReporteGestionesDTO,
  ResumenMetricas,
  ReporteResponse
} from '../gestiones-report/gestiones-report.service';

@Injectable({
  providedIn: 'root'
})
export class CompromisosReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/gestiones/compromisos`;

  constructor(private http: HttpClient) {}

  getReporte(
    fechaDesde?: string,
    fechaHasta?: string,
    idCartera?: number,
    idSubcartera?: number,
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
