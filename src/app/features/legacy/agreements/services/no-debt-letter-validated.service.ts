import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import {
  EligibleNoDebtLetterClientsResponse,
  GenerateValidatedNoDebtLetterRequest,
  NoDebtLetterValidationErrorResponse
} from '../models/no-debt-letter-validated.model';

@Injectable({
  providedIn: 'root'
})
export class NoDebtLetterValidatedService {
  private readonly baseUrl = `${environment.apiUrl}/cartas/carta-no-adeudo`;

  constructor(private http: HttpClient) {}

  generateValidated(request: GenerateValidatedNoDebtLetterRequest): Observable<HttpResponse<Blob>> {
    return this.http.post(`${this.baseUrl}/generar-validado`, request, {
      observe: 'response',
      responseType: 'blob'
    }).pipe(
      catchError((error: HttpErrorResponse) => this.handleBlobError(error))
    );
  }

  getEligible(params: {
    tenantId: number;
    carteraId: number;
    subcarteraId: number;
    page?: number;
    size?: number;
  }): Observable<EligibleNoDebtLetterClientsResponse> {
    const queryParams = new HttpParams()
      .set('tenantId', params.tenantId.toString())
      .set('carteraId', params.carteraId.toString())
      .set('subcarteraId', params.subcarteraId.toString())
      .set('page', (params.page ?? 0).toString())
      .set('size', (params.size ?? 20).toString());

    return this.http.get<EligibleNoDebtLetterClientsResponse>(`${this.baseUrl}/elegibles`, { params: queryParams });
  }

  private handleBlobError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof Blob) {
      return from(this.readBlobAsJson(error.error)).pipe(
        switchMap((body) => throwError(() => ({
          status: error.status,
          body
        })))
      );
    }

    return throwError(() => ({
      status: error.status,
      body: error.error as NoDebtLetterValidationErrorResponse
    }));
  }

  private async readBlobAsJson(blob: Blob): Promise<NoDebtLetterValidationErrorResponse> {
    const text = await blob.text();
    return text ? JSON.parse(text) : {};
  }
}
