import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface UploadResponse {
  job_id: string;
  size_bytes: number;
  path: string;
}

export interface AmdEvent {
  type: string;
  ts?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AmdTestService {
  // El disparador corre en localhost:9000
  // de /amd-disparador/ -> http://localhost:9000/ (mismo origen).
  private readonly httpBase = `/amd-disparador`;
  private readonly wsBase = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/amd-disparador`;

  constructor(private http: HttpClient) {}

  // Funcion paracargar los archivos y pasarlo al disparador
  upload(file: File): Observable<UploadResponse> {
    const formatoData = new FormData();
    formatoData.append('audio', file);
    return this.http.post<UploadResponse>(`${this.httpBase}/upload`, formatoData);
  }
    
  // Abre la conexion websocket contra el disparador para poder recibir los eventos del stream del audio que se envia. 
  openProgress(jobId: string): { event$: Subject<AmdEvent>; close: () => void } {
    const event$ = new Subject<AmdEvent>();
    const ws = new WebSocket(`${this.wsBase}/progress/${jobId}`);

    ws.onmessage = (msg) => {
      try {
        event$.next(JSON.parse(msg.data));
      } catch {
        event$.next({ type: 'parse_error', raw: msg.data });
      }
    };
    ws.onerror = () => event$.next({ type: 'ws_error' });
    ws.onclose = () => { event$.next({ type: 'ws_closed' }); event$.complete(); };

    return { event$, close: () => ws.close() };
  }
}