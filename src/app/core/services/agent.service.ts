import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { AgentStatus, ChangeStatusRequest } from '../models/agent-status.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  // FIX: Cambiar de auth-api a gateway (/api) para acceder al discador-backend
  private readonly apiUrl = `${environment.gatewayUrl}/agent-status`;

  constructor(private http: HttpClient) {}

  getAllAgents(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getAgentStatus(agentId: number): Observable<AgentStatus> {
    return this.http.get<AgentStatus>(`${this.apiUrl}/${agentId}/status`);
  }

  changeAgentStatus(agentId: number, request: ChangeStatusRequest): Observable<AgentStatus> {
    return this.http.post<AgentStatus>(`${this.apiUrl}/${agentId}/status`, request);
  }

  getAvailableAgents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/available`);
  }

  // Comentado temporalmente - AgentPerformance no está definido
  // getAgentPerformance(agentId: number, dateFrom?: Date, dateTo?: Date): Observable<AgentPerformance> {
  //   let url = `${this.apiUrl}/${agentId}/performance`;
  //   const params: string[] = [];

  //   if (dateFrom) params.push(`dateFrom=${dateFrom.toISOString()}`);
  //   if (dateTo) params.push(`dateTo=${dateTo.toISOString()}`);

  //   if (params.length > 0) {
  //     url += '?' + params.join('&');
  //   }

  //   return this.http.get<AgentPerformance>(url);
  // }
}
