import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, Chat, Contact } from '../../models/message.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE = environment.whatsappApiUrl || environment.apiUrl;

  constructor(private http: HttpClient) { }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.API_BASE}/frontend/contacts`);
  }

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.API_BASE}/frontend/chats`);
  }

  getMessages(chat: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.API_BASE}/frontend/chats/${chat}/messages`);
  }

  sendTextMessage(to: string, message: string, quotedMessageId?: string): Observable<any> {
    const payload: any = { to, message };
    if (quotedMessageId) {
      payload.quotedMessageId = quotedMessageId;
    }
    return this.http.post(`${this.API_BASE}/frontend/send-text`, payload);
  }

  sendMediaMessage(to: string, media: string, mimetype: string, caption?: string): Observable<any> {
    // Determinar el kind basándose en el mimetype
    let kind = 'document';
    if (mimetype.startsWith('image/')) {
      kind = 'image';
    } else if (mimetype.startsWith('video/')) {
      kind = 'video';
    } else if (mimetype.startsWith('audio/')) {
      kind = 'audio';
    }

    const payload: any = {
      to,
      base64: media,  // El backend espera "base64" no "media"
      kind,           // El backend requiere "kind"
      mime: mimetype  // El backend espera "mime" no "mimetype"
    };

    if (caption) {
      payload.caption = caption;
    }

    console.log('📤 Enviando media:', { to, kind, mime: mimetype, captionLength: caption?.length || 0, mediaLength: media.length });
    return this.http.post(`${this.API_BASE}/frontend/send-media`, payload);
  }

  markAsRead(chat: string, upTo?: string): Observable<any> {
    return this.http.post(`${this.API_BASE}/frontend/chats/${chat}/mark-read`, {});
  }

  // Obtener estado de ventana de respuesta
  getWindowStatus(chatJid: string): Observable<any> {
    return this.http.get(`${this.API_BASE}/frontend/chats/${chatJid}/window-status`);
  }

  // Obtener chats bloqueados
  getBlockedChats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/frontend/blocked-chats`);
  }

  // Logout helper
  logout(): Observable<any> {
    // El logout es manejado por AuthService (client-side)
    // Este método está aquí por si necesitas invalidar el token en el backend
    return this.http.post(`${this.API_BASE}/auth/logout`, {});
  }
}
