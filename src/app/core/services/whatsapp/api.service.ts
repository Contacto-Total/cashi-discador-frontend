import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message, Chat, Contact } from '../../models/message.model';
import { environment } from '../../../../environments/environment';

// Shape que devuelve el Go service en GET /messages/{chat}
interface GoMessage {
  id: string;
  fromMe: boolean;
  text: string;
  hasMedia: boolean;
  media?: any;
  ts: number;
  // campos opcionales de reply
  quotedMessageId?: string;
  quotedText?: string;
  quotedSender?: string;
  quotedFromMe?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Go service (puerto 8090): tiempo real, envío, WebSocket
  private readonly GO_BASE = environment.whatsappApiUrl;

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.GO_BASE}/contacts`);
  }

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.GO_BASE}/chats`);
  }

  getMessages(chat: string): Observable<Message[]> {
    const encoded = encodeURIComponent(chat);
    return this.http.get<GoMessage[]>(`${this.GO_BASE}/messages/${encoded}`).pipe(
      map(msgs => msgs.map(m => ({
        msgId:           m.id,
        chat:            chat,
        chatTitle:       chat,
        text:            m.text || '',
        fromMe:          m.fromMe,
        timestamp:       m.ts,
        hasMedia:        m.hasMedia || false,
        media:           m.media,
        status:          m.fromMe ? 'sent' as const : undefined,
        quotedMessageId: m.quotedMessageId,
        quotedText:      m.quotedText,
        quotedSender:    m.quotedSender,
        quotedFromMe:    m.quotedFromMe
      })))
    );
  }

  sendTextMessage(to: string, message: string, quotedMessageId?: string): Observable<any> {
    const payload: any = { to, message };
    if (quotedMessageId) payload.quotedMessageId = quotedMessageId;
    return this.http.post(`${this.GO_BASE}/send-text`, payload);
  }

  sendMediaMessage(to: string, media: string, mimetype: string, caption?: string): Observable<any> {
    let kind = 'document';
    if (mimetype.startsWith('image/'))  kind = 'image';
    else if (mimetype.startsWith('video/')) kind = 'video';
    else if (mimetype.startsWith('audio/')) kind = 'audio';

    const payload: any = { to, base64: media, kind, mime: mimetype };
    if (caption) payload.caption = caption;
    return this.http.post(`${this.GO_BASE}/send-media`, payload);
  }

  markAsRead(chat: string, upTo?: string): Observable<any> {
    return this.http.post(`${this.GO_BASE}/mark-read`, { chat, upTo: upTo || '' });
  }

  // Reacción emoji a un mensaje (reaction='' la quita)
  reactToMessage(to: string, msgId: string, reaction: string): Observable<any> {
    return this.http.post(`${this.GO_BASE}/react`, { to, msgId, reaction });
  }

  // Editar texto de un mensaje propio ya enviado
  editMessage(to: string, msgId: string, message: string): Observable<any> {
    return this.http.post(`${this.GO_BASE}/edit`, { to, msgId, message });
  }

  // Eliminar un mensaje para todos (revoke)
  deleteMessage(to: string, msgId: string): Observable<any> {
    return this.http.post(`${this.GO_BASE}/delete`, { to, msgId });
  }

  // Suscribirse a la presencia (online / última vez) de un contacto
  subscribePresence(chat: string): Observable<any> {
    return this.http.post(`${this.GO_BASE}/subscribe-presence`, { chat });
  }

  // Enviar nuestro propio indicador de "escribiendo…/grabando…"
  sendChatPresence(to: string, state: 'composing' | 'paused', media: 'text' | 'audio' = 'text'): Observable<any> {
    return this.http.post(`${this.GO_BASE}/chat-presence`, { to, state, media });
  }

  // Estos endpoints no existen en el Go service — devuelven valores neutros
  getWindowStatus(_chatJid: string): Observable<any> {
    return of({ isBlocked: false, hasActiveWindow: false, hoursRemaining: 0, minutesRemaining: 0 });
  }

  getBlockedChats(): Observable<any[]> {
    return of([]);
  }
}
