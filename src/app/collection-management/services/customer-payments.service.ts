import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerPaymentsContext, CustomerPaymentsSummary } from '../models/customer-payments.model';

@Injectable({ providedIn: 'root' })
export class CustomerPaymentsService {
  private readonly baseUrl = `${environment.gatewayUrl}/pagos-bcp`;

  constructor(private http: HttpClient) {}

  getSummary(documento: string, context: CustomerPaymentsContext): Observable<CustomerPaymentsSummary> {
    const params = new HttpParams()
      .set('tenantId', context.tenantId.toString())
      .set('carteraId', context.carteraId.toString())
      .set('subcarteraId', context.subcarteraId.toString());

    return this.http.get<CustomerPaymentsSummary>(
      `${this.baseUrl}/clientes/${encodeURIComponent(documento)}/resumen-conciliacion`,
      { params }
    );
  }
}
