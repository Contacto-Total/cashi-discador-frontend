import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ActiveCall {
  callUuid: string;
  agentExtension: string;
  agentName: string;
  clientNumber: string;
  callDirection: string;
  callState: string;
  startTime: string;
  duration: number;
  campaignId?: number;
  campaignName?: string;
  isBeingMonitored: boolean;
  monitoringMode?: string;
  monitoredBy?: string;
}

export interface MonitoringRequest {
  callUuid: string;
  adminExtension: string;
  adminUsername: string;
}

export interface ExtensionRegistration {
  extension: string;
  username: string;
  displayName: string;
  ipAddress: string;
  port: string;
  status: string;
  pingMs: string;
  userAgent: string;
  userId?: number;
  fullName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminMonitoringService {
  private apiUrl = `${environment.gatewayUrl}/admin/monitoring`;

  constructor(private http: HttpClient) {}

  /**
   * Get all active calls
   */
  getActiveCalls(): Observable<ActiveCall[]> {
    return this.http.get<ActiveCall[]>(`${this.apiUrl}/active-calls`);
  }

  /**
   * Get specific call details
   */
  getCall(callUuid: string): Observable<ActiveCall> {
    return this.http.get<ActiveCall>(`${this.apiUrl}/active-calls/${callUuid}`);
  }

  /**
   * Start SPY mode (Vigía) - Listen only
   */
  startSpyMode(request: MonitoringRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/spy`, request);
  }

  /**
   * Start WHISPER mode (Susurro) - Speak to agent only
   */
  startWhisperMode(request: MonitoringRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/whisper`, request);
  }

  /**
   * Start BARGE mode (Tripartita) - Join as full participant
   */
  startBargeMode(request: MonitoringRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/barge`, request);
  }

  /**
   * Stop monitoring a call
   */
  stopMonitoring(callUuid: string, adminCallUuid: string, adminUsername: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/stop`, {
      callUuid,
      adminCallUuid,
      adminUsername
    });
  }

  /**
   * Get active call count
   */
  getActiveCallCount(): Observable<{activeCallCount: number}> {
    return this.http.get<{activeCallCount: number}>(`${this.apiUrl}/stats/active-count`);
  }

  /**
   * Get FreeSWITCH status (for debugging)
   */
  getFreeSwitchStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/freeswitch/status`);
  }

  /**
   * Get specific active call (alias for getCall)
   */
  getActiveCall(callUuid: string): Observable<ActiveCall> {
    return this.getCall(callUuid);
  }

  /**
   * SPY mode - simplified (admin extension 1000)
   */
  spyCall(callUuid: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/spy`, {
      callUuid,
      adminExtension: '1000',
      adminUsername: 'admin'
    });
  }

  /**
   * WHISPER mode - simplified (admin extension 1000)
   */
  whisperCall(callUuid: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/whisper`, {
      callUuid,
      adminExtension: '1000',
      adminUsername: 'admin'
    });
  }

  /**
   * BARGE mode - simplified (admin extension 1000)
   */
  bargeCall(callUuid: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/barge`, {
      callUuid,
      adminExtension: '1000',
      adminUsername: 'admin'
    });
  }

  /**
   * Get SIP extension registrations
   */
  getExtensionRegistrations(): Observable<ExtensionRegistration[]> {
    return this.http.get<ExtensionRegistration[]>(`${this.apiUrl}/extensions/registrations`);
  }
}
