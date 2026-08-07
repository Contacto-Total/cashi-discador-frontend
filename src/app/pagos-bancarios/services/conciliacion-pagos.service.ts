import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PosibleMatchConciliacionDTO,
  PosiblesMatchConciliacionParams
} from '../models/conciliacion-pagos.model';

@Injectable({
  providedIn: 'root'
})
export class ConciliacionPagosService {
  private readonly baseUrl = `${environment.gatewayUrl}/pagos-bcp/conciliacion`;

  constructor(private http: HttpClient) {}

  obtenerPosiblesMatch(params: PosiblesMatchConciliacionParams): Observable<PosibleMatchConciliacionDTO[]> {
    let httpParams = new HttpParams()
      .set('fechaInicio', params.fechaInicio)
      .set('tenantId', params.tenantId.toString())
      .set('carteraId', params.carteraId.toString())
      .set('subcarteraId', params.subcarteraId.toString());

    if (params.fechaFin) {
      httpParams = httpParams.set('fechaFin', params.fechaFin);
    }

    if (params.toleranciaMonto !== undefined) {
      httpParams = httpParams.set('toleranciaMonto', params.toleranciaMonto.toString());
    }

    if (params.toleranciaDias !== undefined) {
      httpParams = httpParams.set('toleranciaDias', params.toleranciaDias.toString());
    }

    return this.http.get<PosibleMatchConciliacionDTO[]>(`${this.baseUrl}/posibles-match`, { params: httpParams });
  }
}
