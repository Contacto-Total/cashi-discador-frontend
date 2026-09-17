import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerPaymentsContext, CustomerPaymentsPage } from '../models/customer-payments.model';

@Injectable({ providedIn: 'root' })
export class CustomerPaymentsService {
  private readonly baseUrl = `${environment.gatewayUrl}/pagos-bcp`;

  constructor(private http: HttpClient) {}

  getCancelaciones(
    documento: string,
    context: CustomerPaymentsContext,
    page: number,
    size: number
  ): Observable<CustomerPaymentsPage> {
    const params = new HttpParams()
      .set('tenantId', context.tenantId.toString())
      .set('carteraId', context.carteraId.toString())
      .set('subcarteraId', context.subcarteraId.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<CustomerPaymentsPage>(
      `${this.baseUrl}/clientes/${encodeURIComponent(documento)}/cancelaciones`,
      { params }
    );
  }
}
