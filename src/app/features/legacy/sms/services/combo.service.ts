import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ComboCreateRequest, ComboResponse, RangeDto } from '../models/combo.model';
import { Row, SmsPrecheckResult } from '../models/dyn-query.model';

@Injectable({
  providedIn: 'root'
})
export class ComboService {
  private baseUrl = `${environment.legacyApiUrl}/combos`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': '69420',
    })
  };

  constructor(private http: HttpClient) {}

  list(): Observable<ComboResponse[]> {
    return this.http.get<ComboResponse[]>(this.baseUrl, this.httpOptions);
  }

  get(id: number): Observable<ComboResponse> {
    return this.http.get<ComboResponse>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  createCombo(body: ComboCreateRequest): Observable<number> {
    return this.http.post<number>(this.baseUrl, body, this.httpOptions);
  }

  update(
    id: number,
    body: Partial<ComboCreateRequest> & {
      isActive?: boolean;
      plantillaSmsId?: number | null;
      rangos?: RangeDto[];
    }
  ): Observable<void> {
    return this.http.put<void>(this.baseUrl, { id, ...body }, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  previewFromCombo(id: number, limit?: number): Observable<Row[]> {
    let params = new HttpParams();
    if (limit != null) {
      params = params.set('limit', String(limit));
    }
    return this.http.post<Row[]>(`${this.baseUrl}/${id}/preview`, null, { params });
  }

  getPlantillaTexto(id: number): Observable<string> {
    return this.http.get<{ template?: string } | string>(`${this.baseUrl}/plantillas/${id}`)
      .pipe(map((r: any) => typeof r === 'string' ? r : (r?.template ?? '')));
  }

  exportFromCombo(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/export`, { responseType: 'blob' });
  }

  precheck(id: number, limit?: number): Observable<SmsPrecheckResult> {
    let params = new HttpParams();
    if (limit != null) {
      params = params.set('limit', String(limit));
    }
    return this.http.post<SmsPrecheckResult>(`${this.baseUrl}/${id}/precheck`, null, { params });
  }
}
