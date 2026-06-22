import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BuscarPagosPendientesConciliacionRequest,
  CorreccionPagoContexto,
  CorregirPagoRequest,
  CorregirPagoResponse,
  PagoPendienteConciliacion
} from '../models/correccion-pagos.model';

@Injectable({
  providedIn: 'root'
})
export class CorreccionPagosService {
  private readonly baseUrl = `${environment.gatewayUrl}/pagos`;

  constructor(private http: HttpClient) {}

  buscarPendientesConciliacion(request: BuscarPagosPendientesConciliacionRequest): Observable<PagoPendienteConciliacion[]> {
    const params = new HttpParams()
      .set('documento', request.documento.trim())
      .set('tenantId', request.tenantId.toString())
      .set('carteraId', request.carteraId.toString())
      .set('subcarteraId', request.subcarteraId.toString());

    return this.http.get<PagoPendienteConciliacion[]>(`${this.baseUrl}/pendientes-conciliacion`, { params });
  }

  corregirPago(
    pagoCuotaId: number,
    contexto: CorreccionPagoContexto,
    request: CorregirPagoRequest
  ): Observable<CorregirPagoResponse> {
    const params = new HttpParams()
      .set('tenantId', contexto.tenantId.toString())
      .set('carteraId', contexto.carteraId.toString())
      .set('subcarteraId', contexto.subcarteraId.toString());

    return this.http.put<CorregirPagoResponse>(`${this.baseUrl}/${pagoCuotaId}/corregir`, request, { params });
  }
}
