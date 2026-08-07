import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message, Chat, Contact } from '../../models/message.model';
import { environment } from '../../../../environments/environment';

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last?: boolean;
}

/** Una página de la lista de chats. */
export interface ChatPage {
  chats: Chat[];
  page: number;
  hasMore: boolean;
  total: number;
}

export interface ViewersResponse {
  conversationId: number;
  viewers: string[];
}

export interface ConversationResponse {
  id: number;
  contactJid: string;
  name?: string;
  isGroup?: boolean;
  lastMsgTs?: number;
  lastMsgText?: string;
  lastMsgFromMe?: boolean;
  unreadCount?: number;
  profilePictureUrl?: string;
  blocked?: boolean;
  windowExpiresAt?: string;
}

interface SpringMessage {
  id?: number;
  msgId: string;
  chat: string;
  conversationId?: number;
  chatTitle?: string;
  text?: string;
  fromMe?: boolean;
  hasMedia?: boolean;
  media?: any;
  timestamp: number;
  messageType?: string;
  status?: Message['status'];
  sentByAgentId?: string;
  quotedMessageId?: string;
  quotedText?: string;
  quotedSender?: string;
  quotedFromMe?: boolean;
  edited?: boolean;
  deleted?: boolean;
}

interface MessagePageResponse {
  messages: SpringMessage[];
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API_BASE = `${environment.apiUrl}/v2/whatsapp`;
  private readonly conversationIdsByJid = new Map<string, number>();
  private readonly chatsByJid = new Map<string, Chat>();

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    // El modelo v2 expone búsqueda/listado por conversaciones, no agenda global.
    return of([]);
  }

  /**
   * Una página de chats. Con `q` la búsqueda la resuelve el backend (nombre o
   * número), no un filtro local sobre lo ya cargado.
   */
  getChats(page = 0, size = 30, q = ''): Observable<ChatPage> {
    const params: Record<string, string | number> = { page, size };
    if (q.trim()) params['q'] = q.trim();

    return this.http.get<SpringPage<ConversationResponse>>(`${this.API_BASE}/chats`, { params }).pipe(
      map(resp => ({
        chats: resp.content.map(c => this.mapConversation(c)),
        page: resp.number,
        // `last` puede no venir según el serializador de Page; el fallback por
        // totalPages cubre ese caso.
        hasMore: resp.last !== undefined ? !resp.last : (resp.number + 1) < resp.totalPages,
        total: resp.totalElements
      }))
    );
  }

  /** Registra al agente actual (header X-Agent-Id) como viewer del chat. */
  joinViewers(conversationId: number): Observable<ViewersResponse> {
    return this.http.post<ViewersResponse>(`${this.API_BASE}/chats/${conversationId}/viewers/me`, {});
  }

  /** Libera al agente actual como viewer del chat. */
  leaveViewers(conversationId: number): Observable<ViewersResponse> {
    return this.http.delete<ViewersResponse>(`${this.API_BASE}/chats/${conversationId}/viewers/me`);
  }

  getViewers(conversationId: number): Observable<ViewersResponse> {
    return this.http.get<ViewersResponse>(`${this.API_BASE}/chats/${conversationId}/viewers`);
  }

  /**
   * Convierte el payload de un evento CHAT_UPDATE (mismo shape que GET /chats) a
   * Chat, refrescando de paso las cachés internas (ids y estado de ventana).
   */
  toChat(conversation: ConversationResponse): Chat {
    return this.mapConversation(conversation);
  }

  getMessages(chat: string, before?: number): Observable<{ messages: Message[]; hasMore: boolean }> {
    const conversationId = this.conversationIdsByJid.get(chat);
    if (!conversationId) {
      return of({ messages: [], hasMore: false });
    }

    const params: Record<string, string | number> = { limit: 60 };
    if (before) params['before'] = before;

    return this.http.get<MessagePageResponse>(`${this.API_BASE}/chats/${conversationId}/messages`, { params }).pipe(
      map(resp => ({
        hasMore: resp.hasMore,
        messages: resp.messages.map(m => this.mapMessage(m, chat))
      }))
    );
  }

  sendTextMessage(to: string, message: string, quotedMessageId?: string): Observable<any> {
    const payload: any = {
      conversationId: this.conversationIdsByJid.get(to),
      targetJid: this.conversationIdsByJid.has(to) ? undefined : to,
      type: 'TEXT',
      body: message
    };
    if (quotedMessageId) payload.quotedMessageId = quotedMessageId;
    return this.http.post(`${this.API_BASE}/send`, payload);
  }

  sendMediaMessage(to: string, media: string, _mimetype: string, caption?: string): Observable<any> {
    return this.http.post(`${this.API_BASE}/send`, {
      conversationId: this.conversationIdsByJid.get(to),
      targetJid: this.conversationIdsByJid.has(to) ? undefined : to,
      type: 'MEDIA',
      body: caption || '',
      mediaRef: media
    });
  }

  markAsRead(chat: string, _upTo?: string): Observable<any> {
    const conversationId = this.conversationIdsByJid.get(chat);
    if (!conversationId) return of(null);
    return this.http.post(`${this.API_BASE}/chats/${conversationId}/mark-read`, {});
  }

  // Reacciones, editar/eliminar mensaje y presencia/typing no existen en Spring
  // v2: se quitaron de la UI en vez de seguir llamando al Go directo.

  getWindowStatus(chatJid: string): Observable<any> {
    const chat = this.chatsByJid.get(chatJid);
    return of(this.toWindowStatus(chat));
  }

  getBlockedChats(): Observable<any[]> {
    return of([...this.chatsByJid.values()].filter(chat => chat.blocked));
  }

  private mapConversation(c: ConversationResponse): Chat {
    const chat: Chat = {
      id: c.id,
      jid: c.contactJid,
      name: c.name || c.contactJid,
      lastMsgText: c.lastMsgText || '',
      lastMsgTs: c.lastMsgTs || 0,
      unreadCount: c.unreadCount || 0,
      lastMsgFromMe: !!c.lastMsgFromMe,
      profilePictureUrl: c.profilePictureUrl,
      isGroup: !!c.isGroup,
      blocked: !!c.blocked,
      windowExpiresAt: c.windowExpiresAt
    };
    this.conversationIdsByJid.set(chat.jid, c.id);
    this.chatsByJid.set(chat.jid, chat);
    return chat;
  }

  private mapMessage(m: SpringMessage, fallbackChat: string): Message {
    return {
      msgId:           m.msgId,
      chat:            m.chat || fallbackChat,
      chatTitle:       m.chatTitle || fallbackChat,
      text:            m.text || '',
      fromMe:          !!m.fromMe,
      timestamp:       m.timestamp,
      hasMedia:        !!m.hasMedia,
      media:           m.media,
      status:          m.status || (m.fromMe ? 'sent' as const : undefined),
      messageType:     m.messageType,
      sentByAgentId:   m.sentByAgentId,
      quotedMessageId: m.quotedMessageId,
      quotedText:      m.quotedText,
      quotedSender:    m.quotedSender,
      quotedFromMe:    m.quotedFromMe,
      isEdited:        !!m.edited,
      isDeleted:       !!m.deleted
    };
  }

  private toWindowStatus(chat?: Chat): any {
    if (!chat) {
      return { isBlocked: false, hasActiveWindow: false, hoursRemaining: 0, minutesRemaining: 0 };
    }
    const expiresAt = chat.windowExpiresAt ? new Date(chat.windowExpiresAt).getTime() : 0;
    const remaining = expiresAt ? Math.max(0, expiresAt - Date.now()) : 0;
    return {
      isBlocked: !!chat.blocked,
      hasActiveWindow: remaining > 0,
      hoursRemaining: Math.floor(remaining / 3600000),
      minutesRemaining: Math.floor((remaining % 3600000) / 60000)
    };
  }
}
