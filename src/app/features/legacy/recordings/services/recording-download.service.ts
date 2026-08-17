import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { RecordingDownloadRequest } from '../models/recording-download.request';

@Injectable({
  providedIn: 'root'
})
export class RecordingDownloadService {
  // apiUrl (cashi-discador-backend): los audios históricos ahora se sirven desde
  // S3 y no desde el FTP interno, que al ser una IP privada solo se alcanzaba
  // desde la red de la oficina. La ruta va en singular ('/recording') porque es
  // la que ya usaba el backend antiguo; no se pisa con '/recordings' del discador.
  baseUrl = environment.apiUrl + '/recording';

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

  downloadGestionHistoricaAudioFileByName(downloadHistoricoAudioRequest: RecordingDownloadRequest) {
    console.log('Download Request:', downloadHistoricoAudioRequest);
    return this.http
      .post(this.baseUrl + '/download/historico/audio', downloadHistoricoAudioRequest, { ...this.fileHttpOptions, responseType: 'blob' })
      .pipe(retry(2), catchError(this.handleError));
  }

  downloadGestionHistoricaAudioFiles(downloadHistoricoAudioRequest: RecordingDownloadRequest[]) {
    return this.http
      .post(this.baseUrl + '/download/historico/audio/zip', downloadHistoricoAudioRequest, { ...this.fileHttpOptions, responseType: 'blob' })
      .pipe(retry(2), catchError(this.handleError));
  }
}
