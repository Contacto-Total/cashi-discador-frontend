import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ContextoAjuste,
  DesconciliarPagoRequest,
  FichaPagoBanco,
  PagoBancoCliente,
  PaginaHistoricoCorreccion,
  ResultadoAjuste,
  VistaPreviaAjuste
} from '../models/ajuste-conciliacion.model';

/** Ajustes finos de conciliación: cada acción tiene vista previa (no escribe) y ejecución con motivo. */
@Injectable({ providedIn: 'root' })
export class AjusteConciliacionService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.gatewayUrl}/pagos-bcp/ajustes`;

  listarPagosBancoCliente(documento: string, contexto: ContextoAjuste): Observable<PagoBancoCliente[]> {
    return this.http.get<PagoBancoCliente[]>(
      `${this.baseUrl}/clientes/${encodeURIComponent(documento)}/pagos-banco`,
      { params: this.params(contexto) }
    );
  }

  /** Documento del cliente de un pago bancario (búsqueda por Pb). */
  documentoDePago(pagoId: number, contexto: ContextoAjuste): Observable<{ documento: string }> {
    return this.http.get<{ documento: string }>(`${this.baseUrl}/pagos/${pagoId}/cliente`, { params: this.params(contexto) });
  }

  historicoCorrecciones(documento: string, contexto: ContextoAjuste, page = 0, size = 20): Observable<PaginaHistoricoCorreccion> {
    const params = this.params(contexto)
      .set('documento', documento)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginaHistoricoCorreccion>(`${environment.gatewayUrl}/pagos/historico-correcciones`, { params });
  }

  obtenerFicha(pagoId: number, contexto: ContextoAjuste): Observable<FichaPagoBanco> {
    return this.http.get<FichaPagoBanco>(`${this.baseUrl}/pagos/${pagoId}/ficha`, { params: this.params(contexto) });
  }

  vistaPreviaDesconciliar(pagoId: number, contexto: ContextoAjuste): Observable<VistaPreviaAjuste> {
    return this.http.get<VistaPreviaAjuste>(`${this.baseUrl}/pagos/${pagoId}/desconciliar/vista-previa`, { params: this.params(contexto) });
  }

  desconciliar(pagoId: number, contexto: ContextoAjuste, request: DesconciliarPagoRequest): Observable<ResultadoAjuste> {
    return this.http.post<ResultadoAjuste>(`${this.baseUrl}/pagos/${pagoId}/desconciliar`, request, { params: this.params(contexto) });
  }

  vistaPreviaEliminarVoluntario(pagoCuotaId: number, contexto: ContextoAjuste): Observable<VistaPreviaAjuste> {
    return this.http.get<VistaPreviaAjuste>(
      `${this.baseUrl}/pagos-cuota/${pagoCuotaId}/eliminar-voluntario/vista-previa`,
      { params: this.params(contexto) }
    );
  }

  eliminarVoluntario(pagoCuotaId: number, contexto: ContextoAjuste, motivo: string): Observable<ResultadoAjuste> {
    return this.http.post<ResultadoAjuste>(
      `${this.baseUrl}/pagos-cuota/${pagoCuotaId}/eliminar-voluntario`,
      { motivo },
      { params: this.params(contexto) }
    );
  }

  private params(contexto: ContextoAjuste): HttpParams {
    return new HttpParams()
      .set('tenantId', contexto.tenantId.toString())
      .set('carteraId', contexto.carteraId.toString())
      .set('subcarteraId', contexto.subcarteraId.toString());
  }
}
