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

  chats$ = this.chatsSubject.asObservable();
  contacts$ = this.contactsSubject.asObservable();
  allItems$ = this.allItemsSubject.asObservable();
  currentChat$ = this.currentChatSubject.asObservable();
  currentMessages$ = this.currentMessagesSubject.asObservable();

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
          case 'CHAT_UPDATE':
            this.loadChats();
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

  selectChat(chat: Chat): void {
    console.log('💬 Chat seleccionado:', chat.name);
    this.currentChatSubject.next(chat);
    this.loadMessages(chat.jid);

    // Marcar como leído
    setTimeout(() => {
      this.updateChatUnreadCount(chat.jid, 0);
    }, 300);
  }

  private loadMessages(chatId: string): void {
    console.log('📨 Cargando mensajes desde BD para:', chatId);

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
