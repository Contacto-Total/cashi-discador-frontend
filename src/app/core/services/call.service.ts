import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Call, MakeCallRequest, CompleteCallRequest } from '../models/call.model';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  private readonly apiUrl = `${environment.apiUrl}/calls`;

  constructor(private http: HttpClient) {}

  makeCall(request: MakeCallRequest): Observable<Call> {
    return this.http.post<Call>(`${this.apiUrl}/make`, request);
  }

  registerCall(request: MakeCallRequest): Observable<Call> {
    return this.http.post<Call>(`${this.apiUrl}/register`, request);
  }

  hangupCall(callId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${callId}/hangup`, {});
  }

  completeCall(callId: string, request: CompleteCallRequest): Observable<Call> {
    return this.http.post<Call>(`${this.apiUrl}/${callId}/complete`, request);
  }

  transferCall(callId: string, destination: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${callId}/transfer`, { destination });
  }

  getCallById(callId: string): Observable<Call> {
    return this.http.get<Call>(`${this.apiUrl}/${callId}`);
  }

  getCallHistory(filters?: {
    agentId?: number;
    campaignId?: number;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    page?: number;
    size?: number;
  }): Observable<Call[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.agentId) params = params.set('agentId', filters.agentId.toString());
      if (filters.campaignId) params = params.set('campaignId', filters.campaignId.toString());
      if (filters.startDate) params = params.set('startDate', filters.startDate.toISOString());
      if (filters.endDate) params = params.set('endDate', filters.endDate.toISOString());
      if (filters.status) params = params.set('status', filters.status);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.size) params = params.set('size', filters.size.toString());
    }

    return this.http.get<Call[]>(`${this.apiUrl}/history`, { params });
  }

  getAgentCurrentCall(agentId: number): Observable<Call | null> {
    return this.http.get<Call | null>(`${this.apiUrl}/agent/${agentId}/current`);
  }
}
