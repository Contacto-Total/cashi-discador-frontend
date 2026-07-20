import { computed, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Chat, conversationToChat, Message, SendMessageRequest, TypedWhatsAppEvent } from '../models';
import { WhatsappApiService } from './whatsapp-api.service';
import { WhatsappRealtimeService } from './whatsapp-realtime.service';

@Injectable({ providedIn: 'root' })
export class WhatsappMessageStoreService {
  private readonly messagesByConversation = signal(new Map<number, Message[]>());
  private readonly hasMoreByConversation = signal(new Map<number, boolean>());

  readonly chats = signal<Chat[]>([]);
  readonly currentChat = signal<Chat | null>(null);
  readonly loadingChats = signal(false);
  readonly loadingMessages = signal(false);
  readonly activeViewers = signal<string[]>([]);
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

  selectChat(chat: Chat | null): void {
    this.currentChat.set(chat);
    this.activeViewers.set([]);
    if (!chat?.id) return;

    this.loadMessages(chat.id);
    this.api.getViewers(chat.id).subscribe({ next: (response) => this.activeViewers.set(response.viewers) });
    this.api.joinViewers(chat.id).subscribe({ next: (response) => this.activeViewers.set(response.viewers) });
    this.api.markRead(chat.id).subscribe();
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

  sendMessage(request: SendMessageRequest): void {
    this.api.sendMessage(request).subscribe();
  }

  connectRealtime(token?: string): void {
    this.realtime.connect(token).subscribe({ next: (event) => this.applyEvent(event) });
  }

  disconnectRealtime(): void {
    this.realtime.disconnect();
  }

  private applyEvent(event: TypedWhatsAppEvent): void {
    switch (event.type) {
      case 'INCOMING':
      case 'OUTGOING':
        this.upsertMessage(event.payload);
        this.patchChatFromMessage(event.payload);
        break;
      case 'RECEIPT':
        this.patchReceipt(event.payload.msgId, event.payload.status);
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
    const current = this.messagesByConversation().get(message.conversationId) || [];
    const index = current.findIndex((item) => item.msgId === message.msgId);
    const next = index === -1 ? [...current, message] : current.map((item, i) => i === index ? { ...item, ...message } : item);
    this.setMessages(message.conversationId, next.sort((a, b) => a.timestamp - b.timestamp));
  }

  private patchReceipt(msgId: string, status: Message['status']): void {
    const nextMap = new Map(this.messagesByConversation());
    for (const [conversationId, messages] of nextMap) {
      if (!messages.some((message) => message.msgId === msgId)) continue;
      nextMap.set(conversationId, messages.map((message) => message.msgId === msgId ? { ...message, status } : message));
    }
    this.messagesByConversation.set(nextMap);
  }

  private patchChatFromMessage(message: Message): void {
    this.chats.update((chats) => chats.map((chat) => chat.id === message.conversationId ? {
      ...chat,
      lastMsgText: message.text,
      lastMsgTs: message.timestamp,
      lastMsgFromMe: message.fromMe,
      unreadCount: message.fromMe ? chat.unreadCount : (chat.unreadCount || 0) + 1
    } : chat).sort((a, b) => (b.lastMsgTs || 0) - (a.lastMsgTs || 0)));
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
}
