import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RecordingDTO {
  id: number;
  uuidLlamada: string;
  documento: string;
  telefono: string;
  cliente: string;
  campana: string;
  agente: string;
  fechaInicio: string;
  fechaFin: string;
  duracionSegundos: number;
  estadoLlamada: string;
  resultado: string;
  tipificacion: string;
  /** Si la grabación tiene evaluación de calidad: habilita el botón de reporte. */
  tieneEvaluacion: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminRecordingsService {
  private readonly apiUrl = `${environment.apiUrl}/recordings`;

  constructor(private http: HttpClient) {}

  searchByDates(tenantId: number, portfolioId: number, subPortfolioId: number,
                fechaDesde: string, fechaHasta: string): Observable<RecordingDTO[]> {
    const params = new HttpParams()
      .set('tenantId', tenantId.toString())
      .set('portfolioId', portfolioId.toString())
      .set('subPortfolioId', subPortfolioId.toString())
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);

    return this.http.get<RecordingDTO[]>(`${this.apiUrl}/search/dates`, { params });
  }

  searchByDocumento(tenantId: number, portfolioId: number, subPortfolioId: number,
                    documento: string): Observable<RecordingDTO[]> {
    const params = new HttpParams()
      .set('tenantId', tenantId.toString())
      .set('portfolioId', portfolioId.toString())
      .set('subPortfolioId', subPortfolioId.toString())
      .set('documento', documento);

    return this.http.get<RecordingDTO[]>(`${this.apiUrl}/search/documento`, { params });
  }

  searchByTelefono(tenantId: number, portfolioId: number, subPortfolioId: number,
                   telefono: string): Observable<RecordingDTO[]> {
    const params = new HttpParams()
      .set('tenantId', tenantId.toString())
      .set('portfolioId', portfolioId.toString())
      .set('subPortfolioId', subPortfolioId.toString())
      .set('telefono', telefono);

    return this.http.get<RecordingDTO[]>(`${this.apiUrl}/search/telefono`, { params });
  }

  downloadAudio(uuid: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${uuid}`, { responseType: 'blob' });
  }

  /**
   * Reporte de evaluación de calidad en XLSX.
   * Usa `id` (marcador_llamadas.id) y no `uuidLlamada` porque el reporte cuelga
   * de la gestión; el uuid identifica al audio.
   */
  downloadReporte(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reporte/${id}`, { responseType: 'blob' });
  }

  downloadAudiosZip(uuids: string[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/download/zip`, { uuids }, { responseType: 'blob' });
  }
}
