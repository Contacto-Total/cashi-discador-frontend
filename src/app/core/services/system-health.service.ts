import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaces
export interface ActiveQuery {
  id: number;
  user: string;
  host: string;
  db: string;
  command: string;
  timeSeconds: number;
  state: string;
  info: string;
}

export interface HikariPoolStats {
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  pendingThreads: number;
  maxPoolSize: number;
}

export interface DatabaseHealth {
  activeQueries: number;
  slowQueries: number;
  queryList: ActiveQuery[];
  pool: HikariPoolStats;
}

export interface ServerHealth {
  cpuUsagePercent: number;
  totalMemoryMb: number;
  usedMemoryMb: number;
  freeMemoryMb: number;
  memoryUsagePercent: number;
  totalDiskGb: number;
  usedDiskGb: number;
  freeDiskGb: number;
  diskUsagePercent: number;
}

export interface FreeSwitchHealth {
  connected: boolean;
  activeChannels: number;
  gatewayStatus: string;
  gatewayName: string;
}

export interface AmdHealth {
  available: boolean;
  responseTimeMs: number;
  serviceUrl: string;
}

export interface JvmHealth {
  heapUsedMb: number;
  heapMaxMb: number;
  heapUsagePercent: number;
  nonHeapUsedMb: number;
  activeThreads: number;
  daemonThreads: number;
  uptimeMinutes: number;
}

export interface HealthAlert {
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: string;
  message: string;
  detail: string;
}

export interface SystemHealth {
  database: DatabaseHealth;
  server: ServerHealth;
  freeswitch: FreeSwitchHealth;
  amd: AmdHealth;
  jvm: JvmHealth;
  alerts: HealthAlert[];
}

@Injectable({
  providedIn: 'root'
})
export class SystemHealthService {
  private readonly apiUrl = `${environment.gatewayUrl}/admin/system-health`;

  constructor(private http: HttpClient) {}

  getSystemHealth(): Observable<SystemHealth> {
    return this.http.get<SystemHealth>(this.apiUrl);
  }
}
