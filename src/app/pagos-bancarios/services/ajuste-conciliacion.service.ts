import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ContextoAjuste,
  DesconciliarPagoRequest,
  FichaPagoBanco,
  ResultadoAjuste,
  VistaPreviaAjuste
} from '../models/ajuste-conciliacion.model';

/** Ajustes finos de conciliación: cada acción tiene vista previa (no escribe) y ejecución con motivo. */
@Injectable({ providedIn: 'root' })
export class AjusteConciliacionService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.gatewayUrl}/pagos-bcp/ajustes`;

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
