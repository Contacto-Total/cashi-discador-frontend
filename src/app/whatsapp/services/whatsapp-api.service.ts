import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Conversation,
  Message,
  MessageAgentView,
  MessagePageResponse,
  PageResponse,
  SendMessageRequest,
  SendMessageResponse,
  ViewerResponse,
  EngagementStatus,
  WhatsappAccount
} from '../models';

@Injectable({ providedIn: 'root' })
export class WhatsappApiService {
  private readonly apiBase = `${environment.apiUrl}/v2/whatsapp`;

  constructor(private readonly http: HttpClient) {}

  getWhatsappAccounts(): Observable<WhatsappAccount[]> {
    return this.http.get<WhatsappAccount[]>(`${this.apiBase}/accounts`);
  }

  bindWhatsappAccount(id: number, request: {
    tenantId: number;
    carteraId: number;
    subcarteraId: number;
    active: boolean;
  }): Observable<WhatsappAccount> {
    return this.http.put<WhatsappAccount>(`${this.apiBase}/accounts/${id}/binding`, request);
  }

  setWhatsappAccountActive(id: number, active: boolean): Observable<WhatsappAccount> {
    return this.http.patch<WhatsappAccount>(`${this.apiBase}/accounts/${id}/active`, { active });
  }

  cleanupWhatsappAccount(id: number): Observable<WhatsappAccount> {
    return this.http.post<WhatsappAccount>(`${this.apiBase}/accounts/${id}/cleanup`, {});
  }

  getChats(page = 0, size = 30, q?: string, accountId?: number, includeHistorical = false): Observable<PageResponse<Conversation>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (q) params = params.set('q', q);
    if (accountId) params = params.set('accountId', accountId);
    if (includeHistorical) params = params.set('includeHistorical', true);
    return this.http.get<PageResponse<Conversation>>(`${this.apiBase}/chats`, { params });
  }

  /** Una conversación por id (abrir un chat por URL/notificación). */
  getChat(conversationId: number): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiBase}/chats/${conversationId}`);
  }

  getMessages(conversationId: number, limit = 60, before?: number): Observable<MessagePageResponse> {
    let params = new HttpParams().set('limit', limit);
    if (before) params = params.set('before', before);
    return this.http.get<MessagePageResponse>(`${this.apiBase}/chats/${conversationId}/messages`, { params });
  }

  searchMessages(conversationId: number, q: string, limit = 50): Observable<Message[]> {
    const params = new HttpParams().set('q', q).set('limit', limit);
    return this.http.get<Message[]>(`${this.apiBase}/chats/${conversationId}/messages/search`, { params });
  }

  markRead(conversationId: number, agentId?: string): Observable<void> {
    const headers = agentId ? new HttpHeaders({ 'X-Agent-Id': agentId }) : undefined;
    return this.http.post<void>(`${this.apiBase}/chats/${conversationId}/mark-read`, {}, { headers });
  }

  sendMessage(request: SendMessageRequest): Observable<SendMessageResponse> {
    return this.http.post<SendMessageResponse>(`${this.apiBase}/send`, request);
  }

  /** Sube un adjunto saliente (multipart) y devuelve la ref corta para /send. */
  uploadMedia(file: File): Observable<{ ref: string; fileName?: string; mime?: string }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ ref: string; fileName?: string; mime?: string }>(`${this.apiBase}/media/upload`, form);
  }

  getMessageViews(msgId: string): Observable<MessageAgentView[]> {
    return this.http.get<MessageAgentView[]>(`${this.apiBase}/messages/${encodeURIComponent(msgId)}/views`);
  }

  getViewers(conversationId: number): Observable<ViewerResponse> {
    return this.http.get<ViewerResponse>(`${this.apiBase}/chats/${conversationId}/viewers`);
  }

  getEngagement(conversationId: number): Observable<EngagementStatus> {
    return this.http.get<EngagementStatus>(`${this.apiBase}/chats/${conversationId}/engagement`);
  }

  joinViewers(conversationId: number): Observable<ViewerResponse> {
    return this.http.post<ViewerResponse>(`${this.apiBase}/chats/${conversationId}/viewers/me`, {});
  }

  leaveViewers(conversationId: number): Observable<ViewerResponse> {
    return this.http.delete<ViewerResponse>(`${this.apiBase}/chats/${conversationId}/viewers/me`);
  }
}
