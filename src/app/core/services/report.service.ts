import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalCallsToday: number;
  answeredCallsToday: number;
  averageDuration: number;
  availableAgents: number;
  busyAgents: number;
  contactRate: number;
  abandonRate: number;
}

export interface CallsByHour {
  hour: number;
  totalCalls: number;
  answeredCalls: number;
  averageDuration: number;
}

export interface AgentPerformanceReport {
  agentId: number;
  agentName: string;
  totalCalls: number;
  answeredCalls: number;
  totalTalkTime: number;
  averageTalkTime: number;
  successfulContacts: number;
}

export interface CampaignReport {
  campaignId: number;
  campaignName: string;
  totalContacts: number;
  contactedContacts: number;
  pendingContacts: number;
  totalCalls: number;
  answeredCalls: number;
  successRate: number;
  averageDuration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }

  getCallsByHour(date?: Date, campaignId?: number): Observable<CallsByHour[]> {
    let params = new HttpParams();
    if (date) params = params.set('date', date.toISOString());
    if (campaignId) params = params.set('campaignId', campaignId.toString());

    return this.http.get<CallsByHour[]>(`${this.apiUrl}/calls-by-hour`, { params });
  }

  getAgentPerformance(dateFrom?: Date, dateTo?: Date, agentId?: number): Observable<AgentPerformanceReport[]> {
    let params = new HttpParams();
    if (dateFrom) params = params.set('dateFrom', dateFrom.toISOString());
    if (dateTo) params = params.set('dateTo', dateTo.toISOString());
    if (agentId) params = params.set('agentId', agentId.toString());

    return this.http.get<AgentPerformanceReport[]>(`${this.apiUrl}/agent-performance`, { params });
  }

  getCampaignStats(campaignId: number): Observable<CampaignReport> {
    return this.http.get<CampaignReport>(`${this.apiUrl}/campaign-stats/${campaignId}`);
  }

  getAllCampaignStats(dateFrom?: Date, dateTo?: Date): Observable<CampaignReport[]> {
    let params = new HttpParams();
    if (dateFrom) params = params.set('dateFrom', dateFrom.toISOString());
    if (dateTo) params = params.set('dateTo', dateTo.toISOString());

    return this.http.get<CampaignReport[]>(`${this.apiUrl}/campaign-stats`, { params });
  }
}
