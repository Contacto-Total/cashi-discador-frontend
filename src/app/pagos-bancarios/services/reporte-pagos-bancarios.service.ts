import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FiltrosReportePagosBancarios, ReportePagosBancarios } from '../models/reporte-pagos-bancarios.model';

@Injectable({ providedIn: 'root' })
export class ReportePagosBancariosService {
  private readonly baseUrl = `${environment.apiUrl}/pagos-bcp/reporte`;

  constructor(private readonly http: HttpClient) {}

  obtenerReporte(filtros: FiltrosReportePagosBancarios, pagina = 0, tamanoPagina = 50): Observable<ReportePagosBancarios> {
    let params = new HttpParams()
      .set('periodo', filtros.periodo)
      .set('tenantId', filtros.tenantId.toString())
      .set('carteraId', filtros.carteraId.toString())
      .set('subcarteraId', filtros.subcarteraId.toString())
      .set('pagina', pagina.toString())
      .set('tamanoPagina', tamanoPagina.toString());
    if (filtros.compra) params = params.set('compra', filtros.compra);
    return this.http.get<ReportePagosBancarios>(this.baseUrl, { params });
  }
}
