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

/**
 * Service para el módulo de AMD test.
 *
 * El disparador corre en el mismo servidor que el frontend, puerto 9000.
 * Usamos window.location.hostname para resolverlo dinámicamente.
 */
@Injectable({ providedIn: 'root' })
export class AmdTestService {
  private readonly httpBase = `http://${window.location.hostname}:9000`;
  private readonly wsBase = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:9000`;

  constructor(private http: HttpClient) {}

  /**
   * Sube el WAV al disparador. Devuelve job_id.
   */
  upload(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('audio', file);
    return this.http.post<UploadResponse>(`${this.httpBase}/upload`, formData);
  }

  /**
   * Abre WebSocket de progreso. Devuelve un Subject que emite cada evento JSON.
   * El consumidor se subscribe y recibe eventos hasta el final.
   */
  openProgress(jobId: string): { events$: Subject<AmdEvent>; close: () => void } {
    const events$ = new Subject<AmdEvent>();
    const ws = new WebSocket(`${this.wsBase}/progress/${jobId}`);

    ws.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data);
        events$.next(event);
      } catch (e) {
        events$.next({ type: 'parse_error', raw: msg.data });
      }
    };

    ws.onerror = (e) => {
      events$.next({ type: 'ws_error', error: 'WebSocket error' });
    };

    ws.onclose = () => {
      events$.next({ type: 'ws_closed' });
      events$.complete();
    };

    return {
      events$,
      close: () => ws.close(),
    };
  }
}
