import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HistoricalRecordingsByPhoneRequest } from '../models/historical-recordings-by-phone.request';
import { HistoricalRecordingsByDocumentRequest } from '../models/historical-recordings-by-document.request';
import { HistoricalRecordingsByDateRangeRequest } from '../models/historical-recordings-by-date-range.request';
import { HistoricalRecordingsByTractRequest } from '../models/historical-recordings-by-tract';

@Injectable({
  providedIn: 'root'
})
export class HistoricalRecordingsService {
  baseUrl = environment.webServiceUrl + '/gestion/historica/audios';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

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
    return throwError(() => ({ status: error.status, message: error.error.message }))
  }

  getGestionHistoricaAudiosByTramo(tractRequest: HistoricalRecordingsByTractRequest) {
    return this.http
      .post(this.baseUrl + '/tramo', tractRequest, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getGestionHistoricaAudiosByDateRange(dateRangeRequest: HistoricalRecordingsByDateRangeRequest) {
    return this.http
      .post(this.baseUrl + '/date/range', dateRangeRequest, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getGestionHistoricaAudiosByDocumento(documentoRequest: HistoricalRecordingsByDocumentRequest) {
    return this.http
      .post(this.baseUrl + '/documento', documentoRequest, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getGestionHistoricaAudiosByTelefono(telefonoRequest: HistoricalRecordingsByPhoneRequest) {
    return this.http
      .post(this.baseUrl + '/telefono', telefonoRequest, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
