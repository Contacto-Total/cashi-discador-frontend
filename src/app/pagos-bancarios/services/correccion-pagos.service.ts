import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AmpliarVencimientoRequest,
  AmpliarVencimientoResponse,
  BuscarCuotasValidasTipificarRequest,
  BuscarPagosPendientesConciliacionRequest,
  CorreccionPagoContexto,
  CorregirPagoRequest,
  CorregirPagoResponse,
  CrearCancelacionRequest,
  CrearCancelacionResponse,
  CrearPromesaSistemaPagoBancoRequest,
  CrearPromesaSistemaPagoBancoResponse,
  CuotaValidaTipificar,
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

  buscarCuotasValidasTipificar(request: BuscarCuotasValidasTipificarRequest): Observable<CuotaValidaTipificar[]> {
    const params = new HttpParams()
      .set('documento', request.documento.trim())
      .set('tenantId', request.tenantId.toString())
      .set('carteraId', request.carteraId.toString())
      .set('subcarteraId', request.subcarteraId.toString());

    return this.http.get<CuotaValidaTipificar[]>(`${this.baseUrl}/cuotas-validas-tipificar`, { params });
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

  crearCancelacion(
    cuotaId: number,
    contexto: CorreccionPagoContexto,
    request: CrearCancelacionRequest
  ): Observable<CrearCancelacionResponse> {
    const params = new HttpParams()
      .set('tenantId', contexto.tenantId.toString())
      .set('carteraId', contexto.carteraId.toString())
      .set('subcarteraId', contexto.subcarteraId.toString());

    return this.http.post<CrearCancelacionResponse>(`${this.baseUrl}/cuotas/${cuotaId}/crear-cancelacion`, request, { params });
  }

  ampliarVencimiento(
    cuotaId: number,
    contexto: CorreccionPagoContexto,
    request: AmpliarVencimientoRequest
  ): Observable<AmpliarVencimientoResponse> {
    const params = new HttpParams()
      .set('tenantId', contexto.tenantId.toString())
      .set('carteraId', contexto.carteraId.toString())
      .set('subcarteraId', contexto.subcarteraId.toString());

    return this.http.post<AmpliarVencimientoResponse>(`${this.baseUrl}/cuotas/${cuotaId}/ampliar-vencimiento`, request, { params });
  }

  crearPromesaSistemaPagoBanco(
    cuotaId: number,
    contexto: CorreccionPagoContexto,
    request: CrearPromesaSistemaPagoBancoRequest
  ): Observable<CrearPromesaSistemaPagoBancoResponse> {
    const params = new HttpParams()
      .set('tenantId', contexto.tenantId.toString())
      .set('carteraId', contexto.carteraId.toString())
      .set('subcarteraId', contexto.subcarteraId.toString());

    return this.http.post<CrearPromesaSistemaPagoBancoResponse>(`${this.baseUrl}/cuotas/${cuotaId}/crear-promesa-sistema-pago-banco`, request, { params });
  }
}
