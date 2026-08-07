import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReportePagosBancarios } from '../models/reporte-pagos-bancarios.model';

@Injectable({ providedIn: 'root' })
export class ReportePagosBancariosService {
  private readonly baseUrl = `${environment.apiUrl}/pagos-bcp/reporte`;

  constructor(private readonly http: HttpClient) {}

  obtenerReporte(periodo: string, banco: string): Observable<ReportePagosBancarios> {
    const params = new HttpParams().set('periodo', periodo).set('banco', banco);
    return this.http.get<ReportePagosBancarios>(this.baseUrl, { params });
  }
}
