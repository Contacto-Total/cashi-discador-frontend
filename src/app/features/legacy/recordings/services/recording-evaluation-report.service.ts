import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CreateRecordingEvaluationReportRequest } from '../models/create-recording-evaluation-report.request';

@Injectable({
  providedIn: 'root'
})
export class RecordingEvaluationReportService {
  baseUrl = environment.webServiceUrl + '/audio/evaluation';

  constructor(private http: HttpClient) { }

  fileHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    responseType: 'blob' as 'json'
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

  downloadGestionHistoricaReporteFile(createAudioEvaluacionFileRequest: CreateRecordingEvaluationReportRequest) {
    return this.http
      .post(this.baseUrl + '/create', createAudioEvaluacionFileRequest, { ...this.fileHttpOptions, responseType: 'blob' })
      .pipe(retry(2), catchError(this.handleError));
  }

  downloadGestionHistoricaReporteFiles(createAudioEvaluacionFileRequest: CreateRecordingEvaluationReportRequest[]) {
    return this.http
      .post(this.baseUrl + '/create/zip', createAudioEvaluacionFileRequest, { ...this.fileHttpOptions, responseType: 'blob' })
      .pipe(retry(2), catchError(this.handleError));
  }
}
