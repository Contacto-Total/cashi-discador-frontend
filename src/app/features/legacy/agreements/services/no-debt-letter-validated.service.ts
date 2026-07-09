import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import {
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
