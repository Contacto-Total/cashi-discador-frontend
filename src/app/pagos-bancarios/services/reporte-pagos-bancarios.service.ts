import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReportePagosBancarios } from '../models/reporte-pagos-bancarios.model';

@Injectable({ providedIn: 'root' })
export class ReportePagosBancariosService {
  private readonly baseUrl = `${environment.apiUrl}/pagos-bcp/reporte`;

  constructor(private readonly http: HttpClient) {}

  obtenerReporte(periodo: string, tenantId: number, carteraId: number, subcarteraId: number, pagina = 0, tamanoPagina = 50): Observable<ReportePagosBancarios> {
    const params = new HttpParams()
      .set('periodo', periodo)
      .set('tenantId', tenantId.toString())
      .set('carteraId', carteraId.toString())
      .set('subcarteraId', subcarteraId.toString())
      .set('pagina', pagina.toString())
      .set('tamanoPagina', tamanoPagina.toString());
    return this.http.get<ReportePagosBancarios>(this.baseUrl, { params });
  }
}
