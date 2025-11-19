import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DynamicQueryRequest, Row, SmsPrecheckResult, PreviewInitResp, PreviewStepResp } from '../models/dyn-query.model';

export interface PreviewInitReq {
  query: DynamicQueryRequest;
  candidatas?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DynQueryService {
  private root = `${environment.webServiceUrl}/plantillas/sms`;
  private dynamicQueryUrl = `${this.root}/dynamic-query`;
  private exportUrl = `${this.root}/export`;
  private precheckUrl = `${this.root}/precheck`;
  private previewInitUrl = `${this.root}/preview/init`;
  private previewChooseUrl = `${this.root}/preview/choose`;
  private previewSkipUrl = `${this.root}/preview/skip`;
  private previewDlUrl = `${this.root}/preview/download`;

  constructor(private http: HttpClient) {}

  run(body: DynamicQueryRequest): Observable<Row[]> {
    return this.http.post<Row[]>(this.dynamicQueryUrl, body);
  }

  precheck(body: DynamicQueryRequest, template: string): Observable<SmsPrecheckResult> {
    return this.http.post<SmsPrecheckResult>(this.precheckUrl, { query: body, template });
  }

  export(body: DynamicQueryRequest, template: string): Observable<Blob> {
    const payload: any = { ...body };
    if (payload.limit == null) delete payload.limit;
    payload.selectAll = true;
    payload.template = template;
    return this.http.post(this.exportUrl, payload, { responseType: 'blob' });
  }

  // Preview workflow methods
  previewInit(query: DynamicQueryRequest, template: string, candidatas?: string[]): Observable<PreviewInitResp> {
    const payload: PreviewInitReq = { query: { ...query, template } as any, candidatas };
    return this.http.post<PreviewInitResp>(this.previewInitUrl, payload);
  }

  previewChoose(sessionId: string, variableElegida: string): Observable<PreviewStepResp> {
    return this.http.post<PreviewStepResp>(this.previewChooseUrl, { sessionId, variableElegida });
  }

  previewSkip(sessionId: string): Observable<PreviewStepResp> {
    return this.http.post<PreviewStepResp>(this.previewSkipUrl, { sessionId });
  }

  previewDownload(sessionId: string): Observable<Blob> {
    return this.http.post(this.previewDlUrl, { sessionId }, { responseType: 'blob' });
  }

  previewDownloadBase(sessionId: string): Observable<Blob> {
    return this.http.get(`${this.root}/preview/${sessionId}/download-base`, {
      responseType: 'blob'
    });
  }
}
