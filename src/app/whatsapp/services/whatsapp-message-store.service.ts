import { computed, Injectable, signal } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { Chat, conversationToChat, Message, MessageStatus, OutboundFailedPayload, SendMessageRequest, TypedWhatsAppEvent } from '../models';
import { WhatsappApiService } from './whatsapp-api.service';
import { WhatsappRealtimeService } from './whatsapp-realtime.service';

@Injectable({ providedIn: 'root' })
export class WhatsappMessageStoreService {
  private readonly messagesByConversation = signal(new Map<number, Message[]>());
  private readonly hasMoreByConversation = signal(new Map<number, boolean>());
  private realtimeSubscription?: Subscription;

  // Receipts que llegaron antes que su mensaje (carrera eco OUTGOING / receipt):
  // se guardan por msgId y se aplican cuando el mensaje entra al store.
  private readonly pendingReceipts = new Map<string, MessageStatus>();
  // outboundId (respuesta de POST /send) → temporal optimista, para empatar un
  // OUTBOUND_FAILED con el mensaje exacto que lo originó.
  private readonly tempByOutboundId = new Map<number, { conversationId: number; tempMsgId: string }>();
  private tempCounter = 0;

  readonly chats = signal<Chat[]>([]);
  readonly currentChat = signal<Chat | null>(null);
  readonly loadingChats = signal(false);
  readonly loadingMessages = signal(false);
  readonly sendingMessage = signal(false);
  readonly uploadingMedia = signal(false);
  readonly sendMessageError = signal<string | null>(null);
  readonly activeViewers = signal<string[]>([]);
  readonly replyingTo = signal<Message | null>(null);
  readonly chatsPage = signal(0);
  readonly chatsTotalPages = signal(0);
  readonly chatsQuery = signal<string | undefined>(undefined);

  readonly currentMessages = computed(() => {
    const conversationId = this.currentChat()?.id;
    return conversationId ? this.messagesByConversation().get(conversationId) || [] : [];
  });

  readonly hasMore = computed(() => {
    const conversationId = this.currentChat()?.id;
    return conversationId ? !!this.hasMoreByConversation().get(conversationId) : false;
  });

  readonly hasMoreChats = computed(() => this.chatsPage() + 1 < this.chatsTotalPages());

  constructor(
    private readonly api: WhatsappApiService,
    private readonly realtime: WhatsappRealtimeService
  ) {}

  loadChats(page = 0, size = 30, q?: string): void {
    this.loadingChats.set(true);
    this.api.getChats(page, size, q).pipe(finalize(() => this.loadingChats.set(false))).subscribe({
      next: (response) => {
        this.chatsPage.set(response.number);
        this.chatsTotalPages.set(response.totalPages);
        this.chatsQuery.set(q);
        const mapped = response.content.map(conversationToChat);
        this.chats.set(page === 0 ? mapped : this.mergeChats(this.chats(), mapped));
      }
    });
  }

  loadNextChatsPage(size = 30): void {
    if (this.loadingChats() || !this.hasMoreChats()) return;
    this.loadChats(this.chatsPage() + 1, size, this.chatsQuery());
  }

  selectChatByRoute(conversationId?: number, jid?: string): void {
    const existing = this.findChat(conversationId, jid);
    if (existing) {
      this.selectChat(existing);
      return;
    }

    // Con conversationId: traerla por id (el search del back NO matchea el jid).
    // La agregamos a la lista y la abrimos; los mensajes cargan por id igual.
    if (conversationId) {
      this.api.getChat(conversationId).subscribe({
        next: (conv) => {
          const chat = conversationToChat(conv);
          this.upsertChat(chat);
          this.selectChat(chat);
        },
        error: () => {
          if (jid) this.selectChat({ id: conversationId, jid, name: jid });
        }
      });
      return;
    }

    // Sin id, best-effort por jid (búsqueda por nombre/número).
    if (jid) {
      this.api.getChats(0, 30, jid).subscribe({
        next: (response) => {
          const mapped = response.content.map(conversationToChat);
          this.chats.set(this.mergeChats(this.chats(), mapped).sort((a, b) => (b.lastMsgTs || 0) - (a.lastMsgTs || 0)));
          const found = this.findChat(undefined, jid);
          if (found) this.selectChat(found);
        }
      });
    }
  }

  setReplyingTo(message: Message | null): void {
    this.replyingTo.set(message);
  }

  selectChat(chat: Chat | null): void {
    this.currentChat.set(chat);
    this.activeViewers.set([]);
    this.replyingTo.set(null); // no arrastrar una respuesta en curso entre chats
    if (!chat?.id) return;

    // El backend marca leído (markRead) pero no emite CHAT_UPDATE, así que el badge
    // de no-leídos hay que bajarlo en la vista al instante o queda "pegado".
    this.clearUnread(chat.id);
    this.loadMessages(chat.id);
    this.api.getViewers(chat.id).subscribe({ next: (response) => this.activeViewers.set(response.viewers) });
    this.api.joinViewers(chat.id).subscribe({ next: (response) => this.activeViewers.set(response.viewers) });
    this.api.markRead(chat.id).subscribe();
  }

  private clearUnread(conversationId: number): void {
    this.chats.update((chats) =>
      chats.map((chat) => chat.id === conversationId && chat.unreadCount ? { ...chat, unreadCount: 0 } : chat));
  }

  loadMessages(conversationId: number, before?: number): void {
    this.loadingMessages.set(true);
    this.api.getMessages(conversationId, 60, before).pipe(finalize(() => this.loadingMessages.set(false))).subscribe({
      next: ({ messages, hasMore }) => {
        const sorted = [...messages].sort((a, b) => a.timestamp - b.timestamp);
        const current = before ? this.messagesByConversation().get(conversationId) || [] : [];
        this.setMessages(conversationId, before ? this.mergeMessages(sorted, current) : sorted);
        this.setHasMore(conversationId, hasMore);
      }
    });
  }

  loadMoreMessages(): void {
    const conversationId = this.currentChat()?.id;
    const messages = conversationId ? this.messagesByConversation().get(conversationId) || [] : [];
    if (!conversationId || !this.hasMore() || !messages.length) return;
    this.loadMessages(conversationId, messages[0].timestamp);
  }

  sendText(conversationId: number, body: string, quotedMessageId?: string): void {
    this.sendMessage({ conversationId, type: 'TEXT', body, quotedMessageId });
  }

  sendMedia(conversationId: number, mediaRef: string, body?: string): void {
    this.sendMessage({ conversationId, type: 'MEDIA', body, mediaRef });
  }

  /** Sube el archivo al backend (multipart) y luego lo envía con su ref corta. */
  sendMediaFile(conversationId: number, file: File, caption?: string): void {
    this.sendMessageError.set(null);
    this.uploadingMedia.set(true);
    this.api.uploadMedia(file).pipe(finalize(() => this.uploadingMedia.set(false))).subscribe({
      next: ({ ref }) => this.sendMedia(conversationId, ref, caption),
      error: () => this.sendMessageError.set('No se pudo subir el archivo.')
    });
  }

  sendMessage(request: SendMessageRequest): void {
    this.sendingMessage.set(true);
    this.sendMessageError.set(null);

    // Burbuja optimista: aparece al instante en 'pending'. El eco OUTGOING la
    // reconcilia con el msgId real (ver upsertMessage) y desde ahí los receipts
    // la actualizan en vivo.
    const tempMsgId = this.insertOptimisticMessage(request);

    this.api.sendMessage(request).pipe(finalize(() => this.sendingMessage.set(false))).subscribe({
      next: (response) => {
        if (tempMsgId && response?.id != null) {
          this.tempByOutboundId.set(response.id, { conversationId: request.conversationId, tempMsgId });
        }
      },
      error: (error: unknown) => {
        this.sendMessageError.set(this.getSendErrorMessage(error));
        if (tempMsgId) this.markMessageError(request.conversationId, tempMsgId);
      }
    });
  }

  private insertOptimisticMessage(request: SendMessageRequest): string | undefined {
    if (!request.conversationId) return undefined;
    const tempMsgId = `temp_${Date.now()}_${++this.tempCounter}`;
    // Cita optimista: resolver el mensaje referenciado para mostrar el bloque de
    // respuesta al instante (el eco OUTGOING traerá los mismos campos del backend).
    const quoted = request.quotedMessageId
      ? (this.messagesByConversation().get(request.conversationId) || []).find((m) => m.msgId === request.quotedMessageId)
      : undefined;
    const optimistic: Message = {
      msgId: tempMsgId,
      chat: this.currentChat()?.jid || '',
      conversationId: request.conversationId,
      text: request.body || '',
      fromMe: true,
      timestamp: Date.now(),
      hasMedia: request.type === 'MEDIA',
      status: 'pending',
      quotedMessageId: request.quotedMessageId,
      quotedText: quoted?.text,
      quotedSender: quoted ? (quoted.fromMe ? 'Tú' : (quoted.chatTitle || undefined)) : undefined,
      quotedFromMe: quoted?.fromMe
    };
    const current = this.messagesByConversation().get(request.conversationId) || [];
    this.setMessages(request.conversationId, [...current, optimistic]);
    // Refleja el envío en la lista al instante (preview + subir el chat), sin
    // esperar el eco OUTGOING.
    this.patchChatFromMessage(optimistic);
    return tempMsgId;
  }

  private markMessageError(conversationId: number, msgId: string): void {
    const current = this.messagesByConversation().get(conversationId);
    if (!current) return;
    this.setMessages(conversationId, current.map((message) => message.msgId === msgId ? { ...message, status: 'error' } : message));
  }

  connectRealtime(token?: string): void {
    if (this.realtimeSubscription) return;
    this.realtimeSubscription = this.realtime.connect(token).subscribe({ next: (event) => this.applyEvent(event) });
  }

  disconnectRealtime(): void {
    this.realtimeSubscription?.unsubscribe();
    this.realtimeSubscription = undefined;
    this.realtime.disconnect();
  }

  private applyEvent(event: TypedWhatsAppEvent): void {
    switch (event.type) {
      case 'INCOMING':
      case 'OUTGOING':
        this.upsertMessage(event.payload);
        this.patchChatFromMessage(event.payload);
        this.markCurrentChatRead(event.payload);
        break;
      case 'RECEIPT':
        this.patchReceiptEvent(event.payload);
        break;
      case 'OUTBOUND_FAILED':
        this.patchOutboundFailed(event.payload);
        break;
      case 'CHAT_UPDATE':
        this.upsertChat(conversationToChat(event.payload));
        break;
      case 'VIEWERS':
        if (event.payload.conversationId === this.currentChat()?.id) {
          this.activeViewers.set(event.payload.viewers);
        }
        break;
    }
  }

  private upsertMessage(message: Message): void {
    if (!message.conversationId) return;
    const normalizedMessage: Message = {
      ...message,
      status: this.normalizeStatus(message.status) || message.status
    };
    const current = this.messagesByConversation().get(message.conversationId) || [];

    let index = current.findIndex((item) => item.msgId === normalizedMessage.msgId || String(item.id) === normalizedMessage.msgId);

    // Reconciliar la burbuja optimista: el eco OUTGOING trae el msgId real; si aún
    // existe el temporal pendiente con el mismo texto, se reemplaza en su lugar
    // para que los RECEIPT (que llegan con el msgId real) lo encuentren.
    if (index === -1 && normalizedMessage.fromMe) {
      index = current.findIndex((item) =>
        item.msgId.startsWith('temp_') &&
        item.fromMe &&
        (item.status === 'pending' || item.status === 'sent') &&
        item.text === normalizedMessage.text
      );
    }

    let next = index === -1
      ? [...current, normalizedMessage]
      : current.map((item, i) => i === index ? { ...item, ...normalizedMessage } : item);

    // Aplicar un receipt que llegó antes que el mensaje (carrera eco/receipt).
    const buffered = this.pendingReceipts.get(normalizedMessage.msgId);
    if (buffered) {
      this.pendingReceipts.delete(normalizedMessage.msgId);
      next = next.map((item) =>
        item.msgId === normalizedMessage.msgId && item.fromMe && !this.isStatusDowngrade(item.status, buffered)
          ? { ...item, status: buffered }
          : item
      );
    }

    this.setMessages(message.conversationId, next.sort((a, b) => a.timestamp - b.timestamp));
  }

  private patchOutboundFailed(payload: OutboundFailedPayload): void {
    this.sendMessageError.set(payload.error || 'No se pudo enviar el mensaje.');

    const conversationId = payload.conversationId;
    if (!conversationId) return;
    const current = this.messagesByConversation().get(conversationId);
    if (!current) return;

    // Correlación preferente por outboundId; si no, por texto del temporal pendiente.
    const targetTempId = payload.outboundId != null ? this.tempByOutboundId.get(payload.outboundId)?.tempMsgId : undefined;
    const next = current.map((message) => {
      const isTarget = targetTempId
        ? message.msgId === targetTempId
        : message.msgId.startsWith('temp_') && message.fromMe
          && (message.status === 'pending' || message.status === 'sent')
          && (payload.text == null || message.text === payload.text);
      return isTarget ? { ...message, status: 'error' as MessageStatus } : message;
    });

    this.setMessages(conversationId, next);
    if (payload.outboundId != null) this.tempByOutboundId.delete(payload.outboundId);
  }

  private patchReceiptEvent(payload: unknown): void {
    const receipt = payload as { msgId?: string; id?: string; ids?: string[]; status?: string; receipt?: string };
    const status = this.normalizeStatus(receipt.status || receipt.receipt);
    if (!status) return;

    const messageIds = Array.isArray(receipt.ids)
      ? receipt.ids
      : receipt.msgId
        ? [receipt.msgId]
        : receipt.id
          ? [receipt.id]
          : [];

    for (const msgId of messageIds) {
      this.patchReceipt(msgId, status);
    }
  }

  private patchReceipt(msgId: string, status: MessageStatus): void {
    const nextMap = new Map(this.messagesByConversation());
    let matched = false;
    for (const [conversationId, messages] of nextMap) {
      if (!messages.some((message) => message.fromMe && message.msgId === msgId)) continue;
      matched = true;
      nextMap.set(conversationId, messages.map((message) => {
        if (!message.fromMe || message.msgId !== msgId || this.isStatusDowngrade(message.status, status)) return message;
        return { ...message, status };
      }));
    }

    if (matched) {
      this.messagesByConversation.set(nextMap);
      return;
    }

    // Receipt adelantado (llegó antes que el eco OUTGOING): se guarda y se aplica
    // cuando el mensaje con ese msgId entre al store (upsertMessage).
    const buffered = this.pendingReceipts.get(msgId);
    if (!buffered || !this.isStatusDowngrade(buffered, status)) {
      this.pendingReceipts.set(msgId, status);
    }
  }

  private patchChatFromMessage(message: Message): void {
    this.chats.update((chats) => chats.map((chat) => chat.id === message.conversationId ? {
      ...chat,
      lastMsgText: message.text,
      lastMsgTs: message.timestamp,
      lastMsgFromMe: message.fromMe,
      unreadCount: message.fromMe || this.currentChat()?.id === message.conversationId ? 0 : (chat.unreadCount || 0) + 1
    } : chat).sort((a, b) => (b.lastMsgTs || 0) - (a.lastMsgTs || 0)));
  }

  private markCurrentChatRead(message: Message): void {
    if (message.fromMe || !message.conversationId || this.currentChat()?.id !== message.conversationId) return;
    this.api.markRead(message.conversationId).subscribe();
  }

  private upsertChat(chat: Chat): void {
    this.chats.update((chats) => {
      const exists = chats.some((item) => item.id === chat.id || item.jid === chat.jid);
      return (exists ? chats.map((item) => item.id === chat.id || item.jid === chat.jid ? { ...item, ...chat } : item) : [chat, ...chats])
        .sort((a, b) => (b.lastMsgTs || 0) - (a.lastMsgTs || 0));
    });
  }

  private setMessages(conversationId: number, messages: Message[]): void {
    const next = new Map(this.messagesByConversation());
    next.set(conversationId, messages);
    this.messagesByConversation.set(next);
  }

  private setHasMore(conversationId: number, hasMore: boolean): void {
    const next = new Map(this.hasMoreByConversation());
    next.set(conversationId, hasMore);
    this.hasMoreByConversation.set(next);
  }

  private mergeMessages(previous: Message[], current: Message[]): Message[] {
    const currentIds = new Set(current.map((message) => message.msgId));
    return [...previous.filter((message) => !currentIds.has(message.msgId)), ...current];
  }

  private mergeChats(current: Chat[], nextPage: Chat[]): Chat[] {
    const currentKeys = new Set(current.map((chat) => chat.id ?? chat.jid));
    return [...current, ...nextPage.filter((chat) => !currentKeys.has(chat.id ?? chat.jid))];
  }

  private findChat(conversationId?: number, jid?: string): Chat | undefined {
    return this.chats().find((chat) =>
      (conversationId != null && chat.id === conversationId) || (!!jid && chat.jid === jid)
    );
  }

  private normalizeStatus(status?: string): MessageStatus | undefined {
    const normalized = status?.toLowerCase();
    if (normalized === 'pending' || normalized === 'sent' || normalized === 'delivered' || normalized === 'read' || normalized === 'error') {
      return normalized;
    }
    return undefined;
  }

  private isStatusDowngrade(current: MessageStatus | undefined, next: MessageStatus): boolean {
    const rank: Record<MessageStatus, number> = {
      pending: 0,
      sent: 1,
      delivered: 2,
      read: 3,
      error: 4
    };

    if (!current || next === 'error') return false;
    if (current === 'error') return true;
    return rank[next] < rank[current];
  }

  private getSendErrorMessage(error: unknown): string {
    const response = error as { status?: number; error?: { error?: string; detail?: string; message?: string } };
    if (response.status === 409 && response.error?.error === 'CHAT_BLOCKED') {
      return '24 h expirado.';
    }
    return response.error?.message || 'No se pudo enviar el mensaje.';
  }
}
