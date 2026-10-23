import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CambiarPeriodoPagoRequest,
  ConsolidadoCargaResultado,
  ConsolidadoContexto,
  ConsolidadoCuadre,
  PeriodoPagoBancoResponse,
  RegularizarConsolidadoRequest,
  RegularizarConsolidadoResponse
} from '../models/consolidado-banco.model';

/**
 * Consolidado mensual de pagos del banco: carga, cuadre por cliente y regularización de faltantes.
 */
@Injectable({
  providedIn: 'root'
})
export class ConsolidadoBancoService {

  private readonly baseUrl = `${environment.gatewayUrl}/pagos-bcp/consolidados`;

  constructor(private http: HttpClient) {}

  cargar(file: File, contexto: ConsolidadoContexto, reemplazar: boolean): Observable<ConsolidadoCargaResultado> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenantId', contexto.tenantId.toString());
    formData.append('carteraId', contexto.carteraId.toString());
    formData.append('subcarteraId', contexto.subcarteraId.toString());
    formData.append('periodo', contexto.periodo);
    formData.append('reemplazar', String(reemplazar));
    return this.http.post<ConsolidadoCargaResultado>(`${this.baseUrl}/cargar`, formData);
  }

  obtenerCuadre(contexto: ConsolidadoContexto): Observable<ConsolidadoCuadre> {
    return this.http.get<ConsolidadoCuadre>(this.baseUrl, { params: this.params(contexto) });
  }

  regularizar(
    documento: string,
    contexto: ConsolidadoContexto,
    request: RegularizarConsolidadoRequest
  ): Observable<RegularizarConsolidadoResponse> {
    return this.http.post<RegularizarConsolidadoResponse>(
      `${this.baseUrl}/clientes/${encodeURIComponent(documento)}/regularizar`,
      request,
      { params: this.params(contexto) }
    );
  }

  /** Vuelve a revisar los pagos del límite de mes contra el consolidado activo. */
  ajustarPeriodos(contexto: ConsolidadoContexto): Observable<PeriodoPagoBancoResponse> {
    return this.http.post<PeriodoPagoBancoResponse>(`${this.baseUrl}/ajustar-periodos`, null, { params: this.params(contexto) });
  }

  /** Cambia el mes en que cuenta un pago bancario: el de su fecha o el anterior. */
  cambiarPeriodoPago(
    pagoId: number,
    contexto: ConsolidadoContexto,
    request: CambiarPeriodoPagoRequest
  ): Observable<PeriodoPagoBancoResponse> {
    return this.http.post<PeriodoPagoBancoResponse>(`${this.baseUrl}/pagos/${pagoId}/periodo`, request, { params: this.params(contexto) });
  }

  private params(contexto: ConsolidadoContexto): HttpParams {
    return new HttpParams()
      .set('tenantId', contexto.tenantId.toString())
      .set('carteraId', contexto.carteraId.toString())
      .set('subcarteraId', contexto.subcarteraId.toString())
      .set('periodo', contexto.periodo);
  }
}
