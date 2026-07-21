import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, effect, signal } from '@angular/core';
import { Chat, Message } from '../../../models';
import { UserInfoService, WhatsappApiService, WhatsappMessageStoreService } from '../../../services';
import { MessageInputWidgetComponent } from '../message-input-widget/message-input-widget.component';

interface MessageViewer {
  agentId: string;
  name: string;
  seenAt: string;
}

interface MessageSender {
  name: string;
  role?: string;
  cartera?: string;
}

@Component({
  selector: 'app-whatsapp-chat-widget',
  standalone: true,
  imports: [DatePipe, MessageInputWidgetComponent],
  template: `
    <section class="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      @if (chat(); as selectedChat) {
        <header class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          @if (selectedChat.profilePictureUrl) {
            <img
              class="size-11 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
              [src]="selectedChat.profilePictureUrl"
              [alt]="selectedChat.name"
            />
          } @else {
            <div class="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-slate-950">
              {{ initials(selectedChat) }}
            </div>
          }
          <div class="min-w-0 flex-1">
            <h2 class="truncate text-base font-semibold text-slate-950">{{ chatDisplayName(selectedChat) }}</h2>
            <p class="truncate text-xs text-slate-500">{{ displayContact(selectedChat) }}</p>
          </div>
          @if (viewersText()) {
            <p class="ml-auto max-w-[45%] truncate text-right text-xs font-medium text-emerald-700">
              Viendo actualmente: {{ viewersText() }}
            </p>
          }
          @if (store.loadingMessages()) {
            <span class="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Cargando</span>
          }
        </header>

        <div #messagesPanel class="chat-bg min-h-0 flex-1 overflow-y-auto px-5 py-4">
          @if (store.hasMore()) {
            <div class="mb-4 flex justify-center">
              <button
                type="button"
                class="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-50"
                [disabled]="store.loadingMessages()"
                (click)="store.loadMoreMessages()"
              >
                Cargar mensajes anteriores
              </button>
            </div>
          }

          @if (!messages().length && !store.loadingMessages()) {
            <div class="flex h-full flex-col items-center justify-center text-center text-slate-500">
              <p class="font-semibold text-slate-900">Sin mensajes</p>
              <p class="mt-1 text-sm">Todavía no hay historial cargado para esta conversación.</p>
            </div>
          } @else {
            <div class="space-y-1.5">
              @for (message of messages(); track message.msgId) {
                <article class="flex" [class.justify-end]="message.fromMe" [class.justify-start]="!message.fromMe">
                  <div [class]="bubbleClass(message)" (click)="openMessageDetail(message)">
                    @if (isImage(message) && mediaUrl(message)) {
                      <button type="button" class="block max-w-[180px] overflow-hidden rounded-lg" (click)="openImageViewer(message); $event.stopPropagation()">
                        <img class="max-h-48 w-full object-cover" [src]="mediaUrl(message)" [alt]="message.media?.caption || message.text || 'Imagen'" />
                      </button>
                    } @else if (isSticker(message) && mediaUrl(message)) {
                      <img class="max-h-12 max-w-12 object-contain" [src]="mediaUrl(message)" [alt]="message.media?.caption || 'Sticker'" />
                    } @else if (message.hasMedia) {
                      <p class="mb-1 text-xs font-semibold opacity-80">{{ mediaLabel(message) }}</p>
                    }
                    @if (message.text && !isSticker(message)) {
                      <p class="whitespace-pre-wrap break-words text-sm leading-snug">{{ message.text }}</p>
                    } @else if (!message.hasMedia) {
                      <p class="text-sm italic opacity-70">Mensaje sin texto</p>
                    }
                    <div class="mt-0.5 flex items-center justify-end gap-1.5 text-[11px]">
                      <time class="opacity-80" [dateTime]="toIso(message.timestamp)">{{ message.timestamp | date: 'HH:mm' }}</time>
                      @if (message.fromMe && message.status) {
                        <span class="inline-flex items-center" [style.color]="messageStatusColor(message.status)" [attr.aria-label]="messageStatusAria(message.status)">
                          @switch (message.status) {
                            @case ('pending') {
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
                            }
                            @case ('error') {
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="7.5" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12.01" y2="16.5"/></svg>
                            }
                            @case ('read') {
                              <svg width="18" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12l3.5 3.5L11 5"/><path d="M12 12l3.5 3.5L21 5"/></svg>
                            }
                            @case ('delivered') {
                              <svg width="18" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12l3.5 3.5L11 5"/><path d="M12 12l3.5 3.5L21 5"/></svg>
                            }
                            @default {
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-11"/></svg>
                            }
                          }
                        </span>
                      }
                    </div>
                  </div>
                </article>
              }
            </div>
          }
        </div>

        <footer class="border-t border-slate-200 bg-white px-4 py-3">
          <app-whatsapp-message-input-widget />
        </footer>
      } @else {
        <div class="flex h-full flex-col items-center justify-center bg-slate-50 p-8 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">WhatsApp v2</p>
          <h1 class="mt-3 text-3xl font-semibold text-slate-950">Selecciona una conversación</h1>
          <p class="mt-4 max-w-md text-slate-600">Al elegir un chat se cargarán sus mensajes paginados desde el backend v2.</p>
        </div>
      }
    </section>

    @if (selectedImage(); as imageMessage) {
      <div class="fixed inset-0 z-50 flex flex-col bg-slate-950/95 p-4 text-white" (click)="closeImageViewer()">
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold">{{ imageMessage.media?.fileName || 'Imagen' }}</p>
            @if (imageMessage.text) {
              <p class="truncate text-xs text-slate-300">{{ imageMessage.text }}</p>
            }
          </div>
          <button
            type="button"
            class="rounded-md border border-white/20 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            (click)="closeImageViewer(); $event.stopPropagation()"
          >
            Cerrar
          </button>
        </div>

        <div class="flex min-h-0 flex-1 items-center justify-center py-4">
          <img
            class="max-h-full max-w-full object-contain"
            [src]="mediaUrl(imageMessage)"
            [alt]="imageMessage.media?.caption || imageMessage.text || 'Imagen'"
            (click)="$event.stopPropagation()"
          />
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-4" (click)="$event.stopPropagation()">
          <button
            type="button"
            class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            (click)="copyImage(imageMessage)"
          >
            Copiar
          </button>
          <button
            type="button"
            class="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            (click)="downloadImage(imageMessage)"
          >
            Descargar
          </button>
        </div>
      </div>
    }

    @if (detailMessage(); as detail) {
      <div class="fixed inset-0 z-50 flex justify-end bg-slate-950/50" (click)="closeMessageDetail()">
        <aside class="detail-panel flex h-full w-full max-w-sm flex-col bg-white shadow-2xl" (click)="$event.stopPropagation()">
          <header class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h3 class="text-sm font-semibold text-slate-950">Detalle del mensaje</h3>
            <button
              type="button"
              class="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Cerrar"
              (click)="closeMessageDetail()"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>

          <div class="flex-1 overflow-y-auto px-5 py-4">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Enviado por</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">
              {{ detailSender()?.name || detailSenderFallback(detail) }}
            </p>
            @if (detailSender()?.role) {
              <p class="text-xs text-slate-500">{{ detailSender()?.role }}</p>
            }
            @if (detailSender()?.cartera) {
              <p class="text-xs text-slate-500">Cartera: {{ detailSender()?.cartera }}</p>
            }
            <p class="mt-2 text-xs text-slate-500">{{ detail.timestamp | date: 'd MMM y, HH:mm' }}</p>

            @if (!detail.fromMe) {
              <hr class="my-4 border-slate-200" />

              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Visto por</p>
              @if (detailLoadingViews()) {
                <p class="mt-2 text-sm text-slate-500">Cargando…</p>
              } @else if (!detailViews().length) {
                <p class="mt-2 text-sm text-slate-500">Nadie ha visto este mensaje aún.</p>
              } @else {
                <ul class="mt-2 space-y-2">
                  @for (viewer of detailViews(); track viewer.agentId) {
                    <li class="flex items-center justify-between gap-3">
                      <span class="flex min-w-0 items-center gap-2">
                        <span class="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
                          {{ viewerInitials(viewer.name) }}
                        </span>
                        <span class="truncate text-sm text-slate-800">{{ viewer.name }}</span>
                      </span>
                      <time class="shrink-0 text-xs text-slate-400" [dateTime]="viewer.seenAt">{{ viewer.seenAt | date: 'd MMM, HH:mm' }}</time>
                    </li>
                  }
                </ul>
              }
            }
          </div>
        </aside>
      </div>
    }
  `,
  styles: [`
    .detail-panel { animation: detail-slide-in 0.22s ease-out; }
    @keyframes detail-slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    /* Fondo estilo WhatsApp Web: beige + patrón de doodles sutil (SVG inline, sin asset). */
    .chat-bg {
      background-color: #efeae2;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90'%3E%3Cg fill='none' stroke='%23b3a996' stroke-opacity='0.4' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M12 20q7-8 15 0'/%3E%3Ccircle cx='66' cy='24' r='5'/%3E%3Cpath d='M36 52l5 5 7-11'/%3E%3Cpath d='M74 66q-6 8-13 3'/%3E%3Crect x='16' y='64' width='10' height='10' rx='3'/%3E%3Cpath d='M50 74h12'/%3E%3Cpath d='M28 40c3-3 8-1 7 4'/%3E%3C/g%3E%3C/svg%3E");
      background-size: 160px 160px;
    }
  `]
})
export class ChatWidgetComponent {
  @ViewChild('messagesPanel') private messagesPanel?: ElementRef<HTMLElement>;

  readonly chat = computed(() => this.store.currentChat());
  readonly messages = computed(() => this.store.currentMessages());
  readonly viewerNames = signal(new Map<string, string>());
  readonly selectedImage = signal<Message | null>(null);

  // Panel de detalle de un mensaje (quién lo envió + quiénes lo vieron).
  readonly detailMessage = signal<Message | null>(null);
  readonly detailSender = signal<MessageSender | null>(null);
  readonly detailViews = signal<MessageViewer[]>([]);
  readonly detailLoadingViews = signal(false);
  readonly viewersText = computed(() => this.truncateViewers(this.store.activeViewers()
    .map((viewerId) => this.viewerNames().get(viewerId) || viewerId)
    .join(', ')));

  private lastChatId?: number;
  private lastMessageKey = '';
  private pendingScrollToBottom = false;

  constructor(
    readonly store: WhatsappMessageStoreService,
    private readonly userInfo: UserInfoService,
    private readonly api: WhatsappApiService
  ) {
    effect(() => {
      const chatId = this.chat()?.id;
      const messages = this.messages();
      const messageCount = messages.length;
      const lastMessage = messages[messageCount - 1];
      const lastMessageKey = lastMessage ? `${chatId}:${lastMessage.msgId}:${lastMessage.timestamp}` : `${chatId}:empty`;

      if (chatId !== this.lastChatId) {
        this.lastChatId = chatId;
        this.lastMessageKey = lastMessageKey;
        this.pendingScrollToBottom = !!chatId;
      }

      if (this.pendingScrollToBottom && messageCount > 0) {
        this.scrollToBottom();
        this.lastMessageKey = lastMessageKey;
        return;
      }

      if (messageCount > 0 && lastMessageKey !== this.lastMessageKey) {
        this.lastMessageKey = lastMessageKey;
        this.scrollToBottom();
      }
    });

    effect(() => {
      for (const viewerId of this.store.activeViewers()) {
        if (this.viewerNames().has(viewerId)) continue;
        this.loadViewerName(viewerId);
      }
    });
  }

  bubbleClass(message: Message): string {
    if (this.isImage(message) || this.isSticker(message)) {
      return 'max-w-[78%] text-slate-900';
    }

    const base = 'max-w-[78%] cursor-pointer rounded-lg px-3 py-1.5 shadow-sm transition hover:brightness-95';
    return message.fromMe
      ? `${base} bg-emerald-600 text-white rounded-br-sm`
      : `${base} bg-white text-slate-900 ring-1 ring-slate-200 rounded-bl-sm`;
  }

  isImage(message: Message): boolean {
    return message.media?.kind === 'image' || !!message.media?.mime?.startsWith('image/');
  }

  isSticker(message: Message): boolean {
    return message.media?.kind === 'sticker';
  }

  mediaUrl(message: Message): string {
    return message.media?.url || message.media?.mediaId || '';
  }

  openImageViewer(message: Message): void {
    if (!this.mediaUrl(message)) return;
    this.selectedImage.set(message);
  }

  closeImageViewer(): void {
    this.selectedImage.set(null);
  }

  openMessageDetail(message: Message): void {
    this.detailMessage.set(message);
    this.detailSender.set(null);
    this.detailViews.set([]);
    this.detailLoadingViews.set(false);

    // Quién lo envió: resolver el nombre del agente (mismo servicio que "viendo
    // actualmente"). sentByAgentId solo viene en salientes despachados por outbox.
    const agentId = Number(message.sentByAgentId);
    if (message.sentByAgentId && Number.isFinite(agentId)) {
      this.userInfo.getUserInfoView(agentId).subscribe({
        next: (user) => this.detailSender.set({
          name: user.displayName,
          role: user.roles?.[0],
          cartera: user.asignaciones?.[0]?.nombreCartera
        }),
        error: () => this.detailSender.set({ name: `Agente ${message.sentByAgentId}` })
      });
    }

    // "Visto por" (asesores internos) solo se registra sobre mensajes ENTRANTES.
    // En salientes únicamente importa quién lo envió, así que ni consultamos.
    if (message.fromMe) return;

    // Quiénes lo vieron: endpoint existente; los IDs se resuelven a nombres.
    this.detailLoadingViews.set(true);
    this.api.getMessageViews(message.msgId).subscribe({
      next: (views) => {
        this.detailViews.set(views.map((view) => ({ agentId: view.agentId, name: view.agentId, seenAt: view.seenAt })));
        this.detailLoadingViews.set(false);
        for (const view of views) {
          const id = Number(view.agentId);
          if (!Number.isFinite(id)) continue;
          this.userInfo.getUserInfoView(id).subscribe({
            next: (user) => this.detailViews.update((list) =>
              list.map((item) => item.agentId === view.agentId ? { ...item, name: user.displayName } : item))
          });
        }
      },
      error: () => this.detailLoadingViews.set(false)
    });
  }

  closeMessageDetail(): void {
    this.detailMessage.set(null);
  }

  detailSenderFallback(message: Message): string {
    if (message.sentByAgentId) return `Agente ${message.sentByAgentId}`;
    return message.fromMe ? 'Tú / sistema' : (this.chat()?.name || 'Contacto');
  }

  async copyImage(message: Message): Promise<void> {
    const url = this.mediaUrl(message);
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    } catch {
      await navigator.clipboard.writeText(url);
    }
  }

  downloadImage(message: Message): void {
    const url = this.mediaUrl(message);
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    link.download = message.media?.fileName || `whatsapp-image-${message.msgId}.jpg`;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  displayContact(chat: Chat): string {
    return chat.contactPhone || chat.jid.replace('@lid', '').replace('@s.whatsapp.net', '').replace('@g.us', '');
  }

  chatDisplayName(chat: Chat): string {
    if (!chat.name || chat.name.includes('@lid') || chat.name.includes('@s.whatsapp.net')) {
      return chat.contactPhone || chat.name || chat.jid;
    }
    return chat.name;
  }

  initials(chat: Chat): string {
    const source = this.chatDisplayName(chat);
    const parts = source.split(/\s+/).filter(Boolean);
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : source.slice(0, 2).toUpperCase();
  }

  mediaLabel(message: Message): string {
    const kind = message.media?.kind;
    if (kind === 'image') return 'Imagen';
    if (kind === 'video') return 'Video';
    if (kind === 'audio') return 'Audio';
    if (kind === 'document') return 'Documento';
    return 'Adjunto';
  }

  viewerInitials(name: string): string {
    const parts = (name || '').split(/\s+/).filter(Boolean);
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : (name || '?').slice(0, 2).toUpperCase();
  }

  messageStatusColor(status: Message['status']): string {
    // Sobre la burbuja verde (emerald-600): blanco para enviado/entregado y azul
    // vivo para leído, así el doble check tiene contraste y se distingue del gris.
    if (status === 'read') return '#38bdf8';
    if (status === 'error') return '#fecdd3';
    if (status === 'pending') return 'rgba(255,255,255,0.75)';
    return 'rgba(255,255,255,0.95)';
  }

  messageStatusAria(status: Message['status']): string {
    if (status === 'pending') return 'pendiente';
    if (status === 'sent') return 'enviado';
    if (status === 'delivered') return 'entregado';
    if (status === 'read') return 'leído';
    if (status === 'error') return 'error';
    return '';
  }

  toIso(timestamp: number): string {
    return new Date(timestamp).toISOString();
  }

  private loadViewerName(viewerId: string): void {
    const idUsuario = Number(viewerId);
    if (!Number.isFinite(idUsuario)) {
      this.setViewerName(viewerId, viewerId);
      return;
    }

    this.userInfo.getUserInfoView(idUsuario).subscribe({
      next: (user) => this.setViewerName(viewerId, user.displayName),
      error: () => this.setViewerName(viewerId, viewerId)
    });
  }

  private setViewerName(viewerId: string, name: string): void {
    const next = new Map(this.viewerNames());
    next.set(viewerId, name);
    this.viewerNames.set(next);
  }

  private truncateViewers(value: string): string {
    return value.length > 90 ? `${value.slice(0, 90)}.....` : value;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      requestAnimationFrame(() => {
        const element = this.messagesPanel?.nativeElement;
        if (!element) return;
        element.scrollTop = element.scrollHeight;
        this.pendingScrollToBottom = false;
      });
    });
  }
}
