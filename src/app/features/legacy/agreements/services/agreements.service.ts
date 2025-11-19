import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CreatePaymentAgreementRequest } from '../models/create-payment-agreement.request';
import { AgreementDataResponse } from '../models/agreement-data.response';

@Injectable({
  providedIn: 'root'
})
export class AgreementsService {

  baseUrl = environment.legacyApiUrl + '/cartas';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': '69420',
    })
  };

  fileHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': '69420',
    }),
    responseType: 'blob' as 'json'
  };

  handleError(error: HttpErrorResponse) {
    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      console.log(
        `An error occurred ${error.status}, body was: ${error.error.message}`
      );
    } else {
      console.log(
        `Backend returned code ${error.status}, body was: ${error.error.message}`
      );
    }
    return throwError(() => ({ status: error.status, message: error.error.message }));
  }

  downloadAgreementCard(createPaymentAgreementRequest: CreatePaymentAgreementRequest) {
    return this.http.post(this.baseUrl + '/carta-acuerdo', createPaymentAgreementRequest, {
      ...this.fileHttpOptions, responseType: 'blob'
    }).pipe(retry(2), catchError(this.handleError));
  }

  getAgreementData(dni: string) {
    return this.http.get<AgreementDataResponse>(this.baseUrl + `/datos-cliente/${dni}`, this.httpOptions);
  }
}
