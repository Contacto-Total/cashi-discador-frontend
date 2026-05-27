import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { Message, Chat, Contact } from '../../models/message.model';
import { ApiService } from './api.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messagesMap = new Map<string, Message[]>();
  private chatsSubject = new BehaviorSubject<Chat[]>([]);
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  private allItemsSubject = new BehaviorSubject<Chat[]>([]);
  private currentChatSubject = new BehaviorSubject<Chat | null>(null);
  private currentMessagesSubject = new BehaviorSubject<Message[]>([]);
  private windowStatusUpdateSubject = new BehaviorSubject<any>(null);
  private presenceSubject = new BehaviorSubject<Map<string, { online: boolean; lastSeen?: number }>>(new Map());
  private typingSubject = new BehaviorSubject<Map<string, { typing: boolean; media: 'text' | 'audio' }>>(new Map());

  chats$ = this.chatsSubject.asObservable();
  contacts$ = this.contactsSubject.asObservable();
  allItems$ = this.allItemsSubject.asObservable();
  currentChat$ = this.currentChatSubject.asObservable();
  currentMessages$ = this.currentMessagesSubject.asObservable();
  windowStatusUpdate$ = this.windowStatusUpdateSubject.asObservable();
  presence$ = this.presenceSubject.asObservable();
  typing$ = this.typingSubject.asObservable();

  // Mapas internos de presencia/escritura y timers para auto-expirar "escribiendo…"
  private presenceMap = new Map<string, { online: boolean; lastSeen?: number }>();
  private typingMap = new Map<string, { typing: boolean; media: 'text' | 'audio' }>();
  private typingTimers = new Map<string, any>();

  constructor(
    private apiService: ApiService,
    private wsService: WebsocketService
  ) {
    console.log('🔧 MessageService constructor called');
    this.initializeWebSocket();
    this.loadChatsAndContacts();
  }

  private initializeWebSocket(): void {
    this.wsService.getMessages().subscribe({
      next: (wsMsg: any) => {
        console.log('📨 WebSocket mensaje recibido:', wsMsg);

        const msgType = wsMsg.type || wsMsg.Type;

        switch (msgType) {
          case 'INCOMING':
          case 'OUTGOING':
          case 'MESSAGE':
            this.handleIncomingMessage(wsMsg);
            break;
          case 'RECEIPT':
            this.handleReceipt(wsMsg);
            break;
          case 'PRESENCE':
            this.handlePresence(wsMsg);
            break;
          case 'TYPING':
            this.handleTyping(wsMsg);
            break;
          case 'REACTION':
            this.handleReaction(wsMsg);
            break;
          case 'EDIT':
            this.handleEdit(wsMsg);
            break;
          case 'DELETE':
            this.handleDelete(wsMsg);
            break;
          case 'CHAT_UPDATE':
            this.loadChats();
            break;
          case 'WINDOW_STATUS':
          case 'WINDOW_UPDATE':
          case 'BLOCKED':
          case 'UNBLOCKED':
            this.handleWindowStatusUpdate(wsMsg);
            break;
          default:
            console.log('⚠️ Tipo de mensaje desconocido:', msgType);
        }
      },
      error: (err) => {
        console.error('❌ WebSocket error:', err);
      }
    });
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

      // Si es INCOMING y no estoy en ese chat, incrementar contador
      if (!isFromMe) {
        const currentChat = this.currentChatSubject.value;
        if (!currentChat || currentChat.jid !== chatId) {
          this.incrementUnreadCount(chatId);
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

  private handleWindowStatusUpdate(payload: any): void {
    console.log('🔔 Actualización de estado de ventana recibida:', payload);

    // Emitir el evento para que chat-window lo escuche
    this.windowStatusUpdateSubject.next(payload);
  }

  // ---- Presencia (en línea / última vez) ----
  private handlePresence(payload: any): void {
    if (!payload?.chat) return;
    this.presenceMap.set(payload.chat, {
      online: !!payload.online,
      lastSeen: payload.lastSeen
    });
    this.presenceSubject.next(new Map(this.presenceMap));
    this.patchChat(payload.chat, { isOnline: !!payload.online, lastSeen: payload.lastSeen });
  }

  // ---- Indicador "escribiendo…/grabando…" ----
  private handleTyping(payload: any): void {
    if (!payload?.chat) return;
    const typing = payload.state === 'composing';
    const media: 'text' | 'audio' = payload.media === 'audio' ? 'audio' : 'text';
    this.typingMap.set(payload.chat, { typing, media });
    this.typingSubject.next(new Map(this.typingMap));
    this.patchChat(payload.chat, { isTyping: typing, typingMedia: media });

    // Auto-expirar el "escribiendo…" tras 8s sin nuevas señales (WhatsApp no
    // siempre manda el "paused"), para no dejarlo pegado.
    const prev = this.typingTimers.get(payload.chat);
    if (prev) clearTimeout(prev);
    if (typing) {
      this.typingTimers.set(payload.chat, setTimeout(() => {
        this.typingMap.set(payload.chat, { typing: false, media });
        this.typingSubject.next(new Map(this.typingMap));
        this.patchChat(payload.chat, { isTyping: false });
      }, 8000));
    }
  }

  // ---- Reacción emoji a un mensaje ----
  private handleReaction(payload: any): void {
    if (!payload?.chat || !payload.msgId) return;
    const messages = this.messagesMap.get(payload.chat);
    if (!messages) return;
    const msg = messages.find(m => m.msgId === payload.msgId);
    if (!msg) return;

    const fromMe = !!payload.fromMe;
    const reactions = (msg.reactions || []).filter(r => r.fromMe !== fromMe);
    if (payload.reaction) {
      reactions.push({ emoji: payload.reaction, fromMe });
    }
    msg.reactions = reactions;
    this.emitIfCurrent(payload.chat, messages);
  }

  // ---- Edición de mensaje ----
  private handleEdit(payload: any): void {
    if (!payload?.chat || !payload.msgId) return;
    const messages = this.messagesMap.get(payload.chat);
    if (!messages) return;
    const msg = messages.find(m => m.msgId === payload.msgId);
    if (!msg) return;
    msg.text = payload.text ?? msg.text;
    msg.isEdited = true;
    this.emitIfCurrent(payload.chat, messages);
  }

  // ---- Eliminación de mensaje (revoke) ----
  private handleDelete(payload: any): void {
    if (!payload?.chat || !payload.msgId) return;
    const messages = this.messagesMap.get(payload.chat);
    if (!messages) return;
    const msg = messages.find(m => m.msgId === payload.msgId);
    if (!msg) return;
    msg.isDeleted = true;
    msg.text = '';
    msg.hasMedia = false;
    msg.media = undefined;
    this.emitIfCurrent(payload.chat, messages);
  }

  // Emite la lista de mensajes si el chat afectado es el que se está viendo.
  private emitIfCurrent(chatId: string, messages: Message[]): void {
    const currentChat = this.currentChatSubject.value;
    if (currentChat && currentChat.jid === chatId) {
      this.currentMessagesSubject.next([...messages]);
    }
  }

  // Aplica cambios de presencia a un chat en la lista (para el punto verde).
  // No tocamos currentChatSubject aquí: chat-window consume presence$/typing$
  // directamente para evitar re-disparar la lógica de ventana en cada update.
  private patchChat(chatId: string, patch: Partial<Chat>): void {
    const allItems = [...this.allItemsSubject.value];
    const i = allItems.findIndex(c => c.jid === chatId);
    if (i !== -1) {
      allItems[i] = { ...allItems[i], ...patch };
      this.allItemsSubject.next(allItems);
    }
  }

  // ---- Acciones salientes: reaccionar / editar / eliminar ----
  reactToMessage(chatId: string, msgId: string, emoji: string): void {
    const messages = this.messagesMap.get(chatId);
    if (messages) {
      const msg = messages.find(m => m.msgId === msgId);
      if (msg) {
        const mine = (msg.reactions || []).find(r => r.fromMe);
        const same = mine?.emoji === emoji;
        const reactions = (msg.reactions || []).filter(r => !r.fromMe);
        if (!same && emoji) reactions.push({ emoji, fromMe: true });
        msg.reactions = reactions;
        this.emitIfCurrent(chatId, messages);
        // Si tocó el mismo emoji, lo quitamos (toggle)
        emoji = same ? '' : emoji;
      }
    }
    this.apiService.reactToMessage(chatId, msgId, emoji).subscribe({
      error: (err) => console.error('❌ Error al reaccionar:', err)
    });
  }

  editMessage(chatId: string, msgId: string, newText: string): void {
    this.apiService.editMessage(chatId, msgId, newText).subscribe({
      next: () => {
        const messages = this.messagesMap.get(chatId);
        if (messages) {
          const msg = messages.find(m => m.msgId === msgId);
          if (msg) { msg.text = newText; msg.isEdited = true; this.emitIfCurrent(chatId, messages); }
        }
      },
      error: (err) => console.error('❌ Error al editar:', err)
    });
  }

  deleteMessage(chatId: string, msgId: string): void {
    this.apiService.deleteMessage(chatId, msgId).subscribe({
      next: () => this.handleDelete({ chat: chatId, msgId }),
      error: (err) => console.error('❌ Error al eliminar:', err)
    });
  }

  // Reenvía el indicador de "escribiendo…" propio al contacto.
  sendTypingState(chatId: string, state: 'composing' | 'paused'): void {
    this.apiService.sendChatPresence(chatId, state).subscribe({ error: () => {} });
  }

  loadChats(): void {
    this.loadChatsAndContacts();
  }

  loadChatsAndContacts(): void {
    console.log('📥 Cargando chats y contactos desde BD...');

    forkJoin({
      chats: this.apiService.getChats(),
      contacts: this.apiService.getContacts()
    }).subscribe({
      next: ({ chats, contacts }) => {
        console.log('✅ Datos cargados - Chats:', chats.length, '| Contactos:', contacts.length);

        this.chatsSubject.next(chats);
        this.contactsSubject.next(contacts);

        // Filtrar y ordenar chats con mensajes
        const chatsWithMessages = chats
          .filter(chat => chat.lastMsgTs && chat.lastMsgTs > 0)
          .sort((a, b) => (b.lastMsgTs || 0) - (a.lastMsgTs || 0));

        console.log('📋 Chats con mensajes:', chatsWithMessages.length);
        this.allItemsSubject.next(chatsWithMessages);
      },
      error: (err) => {
        console.error('❌ Error cargando chats/contactos:', err);
      }
    });
  }

  selectChat(chat: Chat | null): void {
    if (chat === null) {
      console.log('💬 Chat deseleccionado');
      this.currentChatSubject.next(null);
      this.currentMessagesSubject.next([]);
      return;
    }

    console.log('💬 Chat seleccionado:', chat.name);
    this.currentChatSubject.next(chat);
    this.loadMessages(chat.jid);

    // Suscribirse a la presencia del contacto (en línea / última vez)
    this.apiService.subscribePresence(chat.jid).subscribe({ error: () => {} });

    // Marcar como leído
    setTimeout(() => {
      this.updateChatUnreadCount(chat.jid, 0);
    }, 300);
  }

  private loadMessages(chatId: string): void {
    console.log('📨 Cargando mensajes desde BD para:', chatId);

    // Limpiar mensajes del chat anterior para que el chat-window resetee su
    // estado de carga y la condición isNewChatLoad sea verdadera al recibir los nuevos.
    this.currentMessagesSubject.next([]);

    this.apiService.getMessages(chatId).subscribe({
      next: (messages) => {
        console.log('✅ Mensajes cargados desde BD:', messages.length);

        const messagesWithStatus: Message[] = messages.map(msg => ({
          msgId: msg.msgId,
          chat: msg.chat,
          chatTitle: msg.chatTitle,
          text: msg.text || '',
          fromMe: msg.fromMe,
          timestamp: msg.timestamp,
          hasMedia: msg.hasMedia || false,
          media: msg.media,
          status: msg.status || (msg.fromMe ? 'sent' : undefined),
          quotedMessageId: msg.quotedMessageId,
          quotedText: msg.quotedText,
          quotedSender: msg.quotedSender,
          quotedFromMe: msg.quotedFromMe
        }));

        // Ordenar por timestamp ascendente (más viejo primero)
        messagesWithStatus.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        // Reemplazar completamente los mensajes en memoria con los de BD
        this.messagesMap.set(chatId, messagesWithStatus);
        this.currentMessagesSubject.next([...messagesWithStatus]);

        // Auto-marcar como leído si hay mensajes no leídos
        const hasUnreadMessages = messagesWithStatus.some(m => !m.fromMe);
        if (hasUnreadMessages && messagesWithStatus.length > 0) {
          setTimeout(() => {
            const lastMsg = messagesWithStatus[messagesWithStatus.length - 1];
            this.apiService.markAsRead(chatId, lastMsg.msgId).subscribe();
          }, 500);
        }
      },
      error: (err) => console.error('❌ Error loading messages:', err)
    });
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
  }
}
