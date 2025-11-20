import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CampaignReportRequest } from '../models/campaign-report.request';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = environment.webServiceUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getDueDates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/campania/fechas-de-vencimiento-disponibles`, this.httpOptions);
  }

  getFileToCampaña(request: CampaignReportRequest): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/campania/generar-zip-reportes`, request, {
      headers: headers,
      responseType: 'blob'
    });
  }
}
