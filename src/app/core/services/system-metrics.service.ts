import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HttpErrorDetail {
  timestamp: number;
  method: string;
  url: string;
  statusCode: number;
}

export interface MetricsSnapshot {
  timestamp: number;

  // Sesiones
  websocketSessions: number;
  sipRegistrations: number;
  totalExtensions: number;
  eslConnected: number;

  // FreeSWITCH
  activeChannels: number;
  callsPerMinute: number;
  callsSuccess: number;
  callsFailed: number;
  callsAbandoned: number;

  // AMD
  amdResponseTimeMs: number;
  amdHuman: number;
  amdMachine: number;
  amdUnknown: number;

  // HTTP Traffic
  requestsPerMinute: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  errors4xx: number;
  errors5xx: number;

  // Detalle de errores HTTP
  httpErrors?: HttpErrorDetail[];
}

@Injectable({
  providedIn: 'root'
})
export class SystemMetricsService {
  private readonly apiUrl = `${environment.gatewayUrl}/admin/system-metrics`;

  constructor(private http: HttpClient) {}

  getMetrics(minutes: number = 30): Observable<MetricsSnapshot[]> {
    return this.http.get<MetricsSnapshot[]>(this.apiUrl, {
      params: { minutes: minutes.toString() }
    });
  }
}
