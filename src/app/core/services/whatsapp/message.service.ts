import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message, Chat, Contact } from '../../models/message.model';
import { ApiService } from './api.service';
import { RealtimeService, WhatsAppEvent } from './realtime.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messagesMap = new Map<string, Message[]>();
  private hasMoreMap  = new Map<string, boolean>();   // si hay mensajes anteriores
  private chatsSubject = new BehaviorSubject<Chat[]>([]);
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  private allItemsSubject = new BehaviorSubject<Chat[]>([]);
  private currentChatSubject = new BehaviorSubject<Chat | null>(null);
  private currentMessagesSubject = new BehaviorSubject<Message[]>([]);
  private hasMoreSubject = new BehaviorSubject<boolean>(false);
  private loadingMoreSubject = new BehaviorSubject<boolean>(false);
  private windowStatusUpdateSubject = new BehaviorSubject<any>(null);
  private viewersSubject = new BehaviorSubject<Map<number, string[]>>(new Map());

  chats$ = this.chatsSubject.asObservable();
  contacts$ = this.contactsSubject.asObservable();
  allItems$ = this.allItemsSubject.asObservable();
  currentChat$ = this.currentChatSubject.asObservable();
  currentMessages$ = this.currentMessagesSubject.asObservable();
  hasMore$ = this.hasMoreSubject.asObservable();
  loadingMore$ = this.loadingMoreSubject.asObservable();
  windowStatusUpdate$ = this.windowStatusUpdateSubject.asObservable();
  viewers$ = this.viewersSubject.asObservable();

  // ---- Paginación de la lista de chats ----
  private readonly CHATS_PAGE_SIZE = 30;
  private chatsPage = 0;
  private chatsQuery = '';
  private chatsHasMoreSubject = new BehaviorSubject<boolean>(false);
  private chatsLoadingSubject = new BehaviorSubject<boolean>(false);

  chatsHasMore$ = this.chatsHasMoreSubject.asObservable();
  chatsLoading$ = this.chatsLoadingSubject.asObservable();

  private viewersMap = new Map<number, string[]>();

  private readonly originalTitle = document.title;

  constructor(
    private apiService: ApiService,
    private realtime: RealtimeService
  ) {
    console.log('🔧 MessageService constructor called');
    this.requestNotificationPermission();
    this.initializeRealtime();
    this.loadChats();
  }

  private requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  private playNotificationSound(): void {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx() as AudioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }

  private showBrowserNotification(chatId: string, message: Message): void {
    if (document.hasFocus()) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const chat = this.allItemsSubject.value.find(c => c.jid === chatId);
    const title = chat?.name || chatId;
    let body = message.text || '';
    if (message.hasMedia && !body) {
      const kind = message.media?.kind;
      body = kind === 'image' ? '📷 Foto'
           : kind === 'video' ? '🎥 Video'
           : kind === 'audio' ? '🎵 Mensaje de voz'
           : '📎 Adjunto';
    }
    const n = new Notification(title, {
      body: body.substring(0, 100),
      icon: chat?.profilePictureUrl || '/favicon.ico',
      tag: chatId,
    });
    n.onclick = () => { window.focus(); n.close(); };
  }

  updateDocumentTitle(): void {
    const total = this.allItemsSubject.value.reduce((s, c) => s + (c.unreadCount || 0), 0);
    document.title = total > 0 ? `(${total}) ${this.originalTitle}` : this.originalTitle;
  }

  markChatAsUnread(chatId: string): void {
    const allItems = [...this.allItemsSubject.value];
    const i = allItems.findIndex(c => c.jid === chatId);
    if (i !== -1) {
      allItems[i] = { ...allItems[i], unreadCount: Math.max(1, allItems[i].unreadCount || 0) };
      this.allItemsSubject.next(allItems);
      this.updateDocumentTitle();
    }
  }

  private initializeRealtime(): void {
    this.realtime.events$.subscribe({
      next: (event: WhatsAppEvent) => {
        switch (event.type) {
          case 'INCOMING':
          case 'OUTGOING':
            // Los handlers trabajan con un objeto plano; el chat vive en el
            // sobre del evento, no en el payload.
            this.handleIncomingMessage({
              ...event.payload,
              chat: event.chat || event.payload?.chat,
              type: event.type
            });
            break;
          case 'RECEIPT':
            this.handleReceipt({ ...event.payload, chat: event.chat });
            break;
          case 'CHAT_UPDATE':
            this.handleChatUpdate(event);
            break;
          case 'VIEWERS':
            this.handleViewers(event);
            break;
          case 'STATUS':
            // Estado de la cuenta (conectada/baneada): sin UI en /whatsapp por ahora.
            console.log('ℹ️ Estado de cuenta:', event.payload);
            break;
          default:
            console.log('⚠️ Evento realtime desconocido:', event.type);
        }
      },
      error: (err) => {
        console.error('❌ Error en el stream realtime:', err);
      }
    });
  }

  /**
   * Resumen de conversación recalculado por el backend: es la fuente de verdad
   * del no-leído, la ventana de 24h y el último mensaje.
   */
  private handleChatUpdate(event: WhatsAppEvent): void {
    if (!event.payload) return;

    // toChat() refresca de paso las cachés del ApiService (id de conversación y
    // estado de ventana), de las que tira getWindowStatus().
    const fresh = this.apiService.toChat(event.payload);
    const isCurrent = this.currentChatSubject.value?.jid === fresh.jid;

    const allItems = [...this.allItemsSubject.value];
    const i = allItems.findIndex(c => c.jid === fresh.jid);

    if (i !== -1) {
      // En el chat abierto el no-leído local manda: el backend todavía cuenta el
      // mensaje que estamos a punto de marcar como leído.
      allItems[i] = { ...allItems[i], ...fresh, unreadCount: isCurrent ? 0 : fresh.unreadCount };
    } else {
      allItems.push({ ...fresh, isGroup: fresh.jid.endsWith('@g.us') });
    }

    this.allItemsSubject.next(allItems.sort((a, b) => (b.lastMsgTs || 0) - (a.lastMsgTs || 0)));
    this.updateDocumentTitle();

    // Alimenta el countdown de la ventana de 24h sin esperar al poll de 30s.
    this.windowStatusUpdateSubject.next({
      chat: fresh.jid,
      isBlocked: !!fresh.blocked,
      ...this.remainingWindow(fresh)
    });
  }

  private remainingWindow(chat: Chat): { hoursRemaining: number; minutesRemaining: number } {
    const expiresAt = chat.windowExpiresAt ? new Date(chat.windowExpiresAt).getTime() : 0;
    const remaining = expiresAt ? Math.max(0, expiresAt - Date.now()) : 0;
    return {
      hoursRemaining: Math.floor(remaining / 3600000),
      minutesRemaining: Math.floor((remaining % 3600000) / 60000)
    };
  }

  private handleViewers(event: WhatsAppEvent): void {
    if (event.conversationId == null) return;
    this.viewersMap.set(event.conversationId, event.payload?.viewers || []);
    this.viewersSubject.next(new Map(this.viewersMap));
  }

  /** Siembra la lista de viewers con la respuesta del POST/GET (no por evento). */
  setViewers(conversationId: number, viewers: string[]): void {
    this.viewersMap.set(conversationId, viewers);
    this.viewersSubject.next(new Map(this.viewersMap));
  }

  private handleIncomingMessage(payload: any): void {
    if (!payload || !payload.chat) {
      console.warn('⚠️ Mensaje inválido recibido:', payload);
      return;
    }

    const chatId = payload.chat;
    const isFromMe = payload.type === 'OUTGOING' || payload.fromMe === true;

    const message: Message = {
      msgId: payload.msgId || payload.id,
      chat: chatId,
      chatTitle: payload.chatTitle || chatId,
      text: payload.text || '',
      fromMe: isFromMe,
      timestamp: payload.timestamp || payload.ts || Date.now(),
      hasMedia: payload.hasMedia || false,
      media: payload.media,
      status: payload.status || (isFromMe ? 'sent' : undefined),
      sentByAgentId: payload.sentByAgentId,
      quotedMessageId: payload.quotedMessageId,
      quotedText: payload.quotedText,
      quotedSender: payload.quotedSender,
      quotedFromMe: payload.quotedFromMe
    };

    console.log(`📨 Procesando mensaje ${isFromMe ? 'OUTGOING' : 'INCOMING'}: ${message.msgId}`);

    // Inicializar array de mensajes si no existe
    if (!this.messagesMap.has(chatId)) {
      this.messagesMap.set(chatId, []);
    }

    const messages = this.messagesMap.get(chatId)!;

    // Buscar si el mensaje ya existe
    let existingIndex = messages.findIndex(m => m.msgId === message.msgId);

    // Si no existe y es OUTGOING, buscar mensaje temporal para reemplazar
    if (existingIndex === -1 && isFromMe) {
      existingIndex = messages.findIndex(m =>
        m.msgId.startsWith('temp_') &&
        m.text === message.text &&
        Math.abs(m.timestamp - message.timestamp) < 5000
      );

      if (existingIndex !== -1) {
        console.log(`🔄 Reemplazando mensaje temporal ${messages[existingIndex].msgId} con ${message.msgId}`);
      }
    }

    if (existingIndex === -1) {
      // Mensaje nuevo - agregarlo
      messages.push(message);
      console.log(`✅ Mensaje nuevo agregado: ${message.msgId}`);

      // Si es INCOMING y no estoy en ese chat, incrementar contador + notificar
      if (!isFromMe) {
        const currentChat = this.currentChatSubject.value;
        if (!currentChat || currentChat.jid !== chatId) {
          this.incrementUnreadCount(chatId);
          this.playNotificationSound();
          this.showBrowserNotification(chatId, message);
        }
      }
    } else {
      // Mensaje ya existe - solo actualizar
      messages[existingIndex] = { ...messages[existingIndex], ...message };
      console.log(`🔄 Mensaje actualizado: ${message.msgId}`);
    }

    // Si estoy viendo este chat, actualizar la vista
    const currentChat = this.currentChatSubject.value;
    if (currentChat && currentChat.jid === chatId) {
      this.currentMessagesSubject.next([...messages]);

      // Auto-marcar como leído si es INCOMING
      if (!isFromMe && existingIndex === -1) {
        setTimeout(() => {
          this.apiService.markAsRead(chatId, message.msgId).subscribe();
        }, 500);
      }
    }

    // SIEMPRE actualizar la lista de chats (mover arriba + actualizar texto)
    this.updateChatInList(chatId, message);
  }

  private handleReceipt(payload: any): void {
    if (!payload || !payload.chat) return;

    const chatId = payload.chat;
    const messageIds = Array.isArray(payload.ids) ? payload.ids :
                      payload.msgId ? [payload.msgId] :
                      payload.id ? [payload.id] : [];
    const status = payload.status || payload.receipt as Message['status'];

    if (!this.messagesMap.has(chatId)) return;

    const messages = this.messagesMap.get(chatId)!;
    let updated = false;

    messageIds.forEach((msgId: string) => {
      const message = messages.find(m => m.msgId === msgId);
      if (message && message.fromMe) {
        message.status = status;
        updated = true;
        console.log(`✅ Estado actualizado: ${msgId} → ${status}`);
      }
    });

    if (updated) {
      const currentChat = this.currentChatSubject.value;
      if (currentChat && currentChat.jid === chatId) {
        this.currentMessagesSubject.next([...messages]);
      }
    }
  }

  /** Primera página de chats. `query` no vacío = búsqueda remota por nombre/número. */
  loadChats(query = ''): void {
    this.chatsQuery = query.trim();
    this.fetchChatsPage(0, true);
  }

  /** Siguiente página (scroll al final de la lista). */
  loadMoreChats(): void {
    if (this.chatsLoadingSubject.value || !this.chatsHasMoreSubject.value) return;
    this.fetchChatsPage(this.chatsPage + 1, false);
  }

  private fetchChatsPage(page: number, replace: boolean): void {
    this.chatsLoadingSubject.next(true);

    this.apiService.getChats(page, this.CHATS_PAGE_SIZE, this.chatsQuery).subscribe({
      next: ({ chats, hasMore }) => {
        const enriched = chats.map(c => ({ ...c, isGroup: c.jid.endsWith('@g.us') }));

        // Merge por jid: al paginar, un chat que subió de posición entre páginas
        // no debe entrar dos veces.
        const byJid = new Map<string, Chat>(
          (replace ? [] : this.allItemsSubject.value).map(c => [c.jid, c])
        );
        enriched.forEach(c => byJid.set(c.jid, { ...byJid.get(c.jid), ...c }));

        const merged = [...byJid.values()]
          .filter(chat => chat.lastMsgTs && chat.lastMsgTs > 0)
          .sort((a, b) => (b.lastMsgTs || 0) - (a.lastMsgTs || 0));

        this.chatsPage = page;
        this.chatsHasMoreSubject.next(hasMore);
        this.chatsSubject.next(enriched);
        this.allItemsSubject.next(merged);
        this.chatsLoadingSubject.next(false);
        this.updateDocumentTitle();

        console.log(`📋 Chats página ${page} (${enriched.length}, hasMore=${hasMore}, q="${this.chatsQuery}")`);
      },
      error: (err) => {
        this.chatsLoadingSubject.next(false);
        console.error('❌ Error cargando chats:', err);
      }
    });
  }

  selectChat(chat: Chat | null): void {
    if (chat === null) {
      console.log('💬 Chat deseleccionado');
      this.currentChatSubject.next(null);
      this.currentMessagesSubject.next([]);
      this.hasMoreSubject.next(false);
      return;
    }

    console.log('💬 Chat seleccionado:', chat.name);
    this.currentChatSubject.next(chat);
    this.loadMessages(chat.jid);

    setTimeout(() => {
      this.updateChatUnreadCount(chat.jid, 0);
    }, 300);
  }

  private loadMessages(chatId: string): void {
    this.currentMessagesSubject.next([]);
    this.hasMoreSubject.next(false);

    this.apiService.getMessages(chatId).subscribe({
      next: ({ messages, hasMore }) => {
        console.log(`✅ Mensajes cargados: ${messages.length} (hasMore=${hasMore})`);

        const mapped = this.mapMessages(messages);
        mapped.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        this.messagesMap.set(chatId, mapped);
        this.hasMoreMap.set(chatId, hasMore);
        this.hasMoreSubject.next(hasMore);
        this.currentMessagesSubject.next([...mapped]);

        if (mapped.length > 0) {
          setTimeout(() => {
            this.apiService.markAsRead(chatId, mapped[mapped.length - 1].msgId).subscribe();
          }, 500);
        }
      },
      error: (err) => console.error('❌ Error loading messages:', err)
    });
  }

  /** Carga el bloque anterior de mensajes (paginación hacia atrás). */
  loadMoreMessages(): void {
    const chatId = this.currentChatSubject.value?.jid;
    if (!chatId || !this.hasMoreMap.get(chatId) || this.loadingMoreSubject.value) return;

    const existing = this.messagesMap.get(chatId) || [];
    const oldest = existing.length > 0 ? existing[0].timestamp : undefined;

    this.loadingMoreSubject.next(true);

    this.apiService.getMessages(chatId, oldest).subscribe({
      next: ({ messages, hasMore }) => {
        const mapped = this.mapMessages(messages);
        mapped.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        // Prepend, deduplicando por msgId
        const existingIds = new Set(existing.map(m => m.msgId));
        const newOnes = mapped.filter(m => !existingIds.has(m.msgId));
        const combined = [...newOnes, ...existing];

        this.messagesMap.set(chatId, combined);
        this.hasMoreMap.set(chatId, hasMore);
        this.hasMoreSubject.next(hasMore);
        this.currentMessagesSubject.next([...combined]);
        this.loadingMoreSubject.next(false);
        console.log(`📜 +${newOnes.length} msgs anteriores cargados (hasMore=${hasMore})`);
      },
      error: (err) => {
        this.loadingMoreSubject.next(false);
        console.error('❌ Error loading more:', err);
      }
    });
  }

  private mapMessages(messages: Message[]): Message[] {
    return messages.map(msg => ({
      msgId:           msg.msgId,
      chat:            msg.chat,
      chatTitle:       msg.chatTitle,
      text:            msg.text || '',
      fromMe:          msg.fromMe,
      timestamp:       msg.timestamp,
      hasMedia:        msg.hasMedia || false,
      media:           msg.media,
      status:          msg.status || (msg.fromMe ? 'sent' : undefined),
      sentByAgentId:   msg.sentByAgentId,
      quotedMessageId: msg.quotedMessageId,
      quotedText:      msg.quotedText,
      quotedSender:    msg.quotedSender,
      quotedFromMe:    msg.quotedFromMe
    }));
  }

  sendMessage(to: string, text: string, quotedMessageId?: string): void {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tempMessage: Message = {
      msgId: tempId,
      chat: to,
      text: text,
      fromMe: true,
      timestamp: Date.now(),
      status: 'pending'
    };

    // Agregar info de reply si existe
    if (quotedMessageId) {
      const messages = this.messagesMap.get(to) || [];
      const quotedMsg = messages.find(m => m.msgId === quotedMessageId);
      if (quotedMsg) {
        tempMessage.quotedMessageId = quotedMessageId;
        tempMessage.quotedText = quotedMsg.text;
        tempMessage.quotedSender = quotedMsg.fromMe ? 'Tú' : (quotedMsg.chatTitle || 'Usuario');
        tempMessage.quotedFromMe = quotedMsg.fromMe;
      }
    }

    // Agregar mensaje temporal a la UI
    if (!this.messagesMap.has(to)) {
      this.messagesMap.set(to, []);
    }

    const messages = this.messagesMap.get(to)!;
    messages.push(tempMessage);
    this.currentMessagesSubject.next([...messages]);

    // Actualizar lista de chats INMEDIATAMENTE
    this.updateChatInList(to, tempMessage);

    // Enviar al backend
    this.apiService.sendTextMessage(to, text, quotedMessageId).subscribe({
      next: (response) => {
        console.log('✅ Mensaje enviado correctamente:', response);
        // El WebSocket se encargará de actualizar con el ID real
      },
      error: (err) => {
        const msgIndex = messages.findIndex(m => m.msgId === tempId);
        if (msgIndex !== -1) {
          messages[msgIndex].status = 'error';
          this.currentMessagesSubject.next([...messages]);
        }
        console.error('❌ Error sending message:', err);
      }
    });
  }

  sendMedia(to: string, mediaBase64: string, mimetype: string, caption?: string): void {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tempMessage: Message = {
      msgId: tempId,
      chat: to,
      text: caption || '',
      fromMe: true,
      timestamp: Date.now(),
      hasMedia: true,
      media: { mime: mimetype, url: mediaBase64 },
      status: 'pending'
    };

    if (!this.messagesMap.has(to)) {
      this.messagesMap.set(to, []);
    }

    const messages = this.messagesMap.get(to)!;
    messages.push(tempMessage);
    this.currentMessagesSubject.next([...messages]);

    // Actualizar lista INMEDIATAMENTE
    this.updateChatInList(to, tempMessage);

    this.apiService.sendMediaMessage(to, mediaBase64, mimetype, caption).subscribe({
      next: (response) => {
        console.log('✅ Media enviado correctamente:', response);
      },
      error: (err) => {
        const msgIndex = messages.findIndex(m => m.msgId === tempId);
        if (msgIndex !== -1) {
          messages[msgIndex].status = 'error';
          this.currentMessagesSubject.next([...messages]);
        }
        console.error('❌ Error sending media:', err);
      }
    });
  }

  private updateChatInList(chatId: string, lastMessage: Message): void {
    const allItems = [...this.allItemsSubject.value];
    const itemIndex = allItems.findIndex(c => c.jid === chatId);

    if (itemIndex !== -1) {
      // Chat existe - actualizar
      allItems[itemIndex].lastMsgText = lastMessage.text;
      allItems[itemIndex].lastMsgTs = lastMessage.timestamp;
      allItems[itemIndex].lastMsgFromMe = lastMessage.fromMe;
      allItems[itemIndex].lastMsgHasMedia = lastMessage.hasMedia;
      allItems[itemIndex].lastMsgMediaKind = lastMessage.media?.kind;
    } else {
      // Chat nuevo - crear
      const newChat: Chat = {
        jid: chatId,
        name: lastMessage.chatTitle || chatId,
        lastMsgText: lastMessage.text,
        lastMsgTs: lastMessage.timestamp,
        lastMsgFromMe: lastMessage.fromMe,
        unreadCount: lastMessage.fromMe ? 0 : 1
      };
      allItems.push(newChat);
    }

    // REORDENAR por timestamp (más reciente primero)
    const sortedItems = allItems.sort((a, b) => {
      return (b.lastMsgTs || 0) - (a.lastMsgTs || 0);
    });

    console.log(`📋 Lista de chats actualizada y reordenada (${sortedItems.length} chats)`);
    this.allItemsSubject.next(sortedItems);

    // También actualizar chatsSubject
    const chats = [...this.chatsSubject.value];
    const chatIndex = chats.findIndex(c => c.jid === chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].lastMsgText = lastMessage.text;
      chats[chatIndex].lastMsgTs = lastMessage.timestamp;
      chats[chatIndex].lastMsgFromMe = lastMessage.fromMe;
      this.chatsSubject.next(chats);
    }
  }

  private incrementUnreadCount(chatId: string): void {
    const allItems = [...this.allItemsSubject.value];
    const itemIndex = allItems.findIndex(c => c.jid === chatId);

    if (itemIndex !== -1) {
      allItems[itemIndex].unreadCount = (allItems[itemIndex].unreadCount || 0) + 1;
      this.allItemsSubject.next(allItems);
    }

    const chats = [...this.chatsSubject.value];
    const chatIndex = chats.findIndex(c => c.jid === chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].unreadCount = (chats[chatIndex].unreadCount || 0) + 1;
      this.chatsSubject.next(chats);
    }

    this.updateDocumentTitle();
    console.log(`📬 Contador de no leídos incrementado para ${chatId}`);
  }

  private updateChatUnreadCount(chatId: string, count: number): void {
    const allItems = [...this.allItemsSubject.value];
    const itemIndex = allItems.findIndex(c => c.jid === chatId);

    if (itemIndex !== -1) {
      allItems[itemIndex].unreadCount = count;
      this.allItemsSubject.next(allItems);
    }

    const chats = [...this.chatsSubject.value];
    const chatIndex = chats.findIndex(c => c.jid === chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].unreadCount = count;
      this.chatsSubject.next(chats);
    }

    if (count === 0) {
      console.log(`✅ Chat marcado como leído: ${chatId}`);
    }
    this.updateDocumentTitle();
  }
}
