import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HistoricalRecordingsByPhoneRequest } from '../models/historical-recordings-by-phone.request';
import { HistoricalRecordingsByDocumentRequest } from '../models/historical-recordings-by-document.request';
import { HistoricalRecordingsByDateRangeRequest } from '../models/historical-recordings-by-date-range.request';
import { HistoricalRecordingsByTractRequest } from '../models/historical-recordings-by-tract';
import { Transcription } from '../models/transcription.model';

@Injectable({
  providedIn: 'root'
})
export class HistoricalRecordingsService {
  // apiUrl (cashi-discador-backend) y no webServiceUrl (backend antiguo): estas
  // búsquedas las atiende ahora el discador, leyendo de foh-prd. El backend
  // antiguo sigue en pie para sus otros consumidores; solo dejó de servir a esta
  // pantalla. No cambiar la clave webServiceUrl en el environment: la comparten
  // ocho servicios más que sí dependen del sistema anterior.
  baseUrl = environment.apiUrl + '/gestion/historica/audios';

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

  /**
   * El texto transcrito de UN audio.
   *
   * `idx` es gestion_historica_audios.idx y `nombre` el WAV de esa fila. Van los
   * dos porque el idx NO identifica al audio: los WAV de una misma gestión lo
   * comparten, y el texto se ata a la grabación por audios_transcripcion.TITULO.
   *
   * Es GET y no POST como las búsquedas de arriba: este endpoint es nuevo y no
   * arrastra el contrato del sistema anterior.
   *
   * Un audio sin transcripción responde 200 con la lista vacía, no 404. Por eso
   * el modal puede distinguir "no hay texto" de "falló la consulta".
   */
  getTranscripcionByIdx(idx: number, nombre?: string) {
    const params = nombre ? new HttpParams().set('nombre', nombre) : undefined;
    return this.http
      .get<Transcription[]>(`${this.baseUrl}/${idx}/transcripcion`, { ...this.httpOptions, params })
      .pipe(retry(2), catchError(this.handleError));
  }
}
