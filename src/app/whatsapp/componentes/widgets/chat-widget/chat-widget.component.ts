import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, effect, signal } from '@angular/core';
import { Chat, Message } from '../../../models';
import { UserInfoService, WhatsappMessageStoreService } from '../../../services';
import { MessageInputWidgetComponent } from '../message-input-widget/message-input-widget.component';

@Component({
  selector: 'app-whatsapp-chat-widget',
  standalone: true,
  imports: [DatePipe, MessageInputWidgetComponent],
  template: `
    <section class="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
      @if (chat(); as selectedChat) {
        <header class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <div class="grid size-11 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-slate-950">
            {{ initials(selectedChat) }}
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="truncate text-base font-semibold text-slate-950">{{ selectedChat.name }}</h2>
            <p class="truncate text-xs text-slate-500">{{ displayContact(selectedChat) }}</p>
            @if (viewersText()) {
              <p class="mt-0.5 truncate text-xs font-medium text-emerald-700">
                Viendo actualmente: {{ viewersText() }}
              </p>
            }
          </div>
          @if (store.loadingMessages()) {
            <span class="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Cargando</span>
          }
        </header>

        <div #messagesPanel class="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-5 py-4">
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
            <div class="space-y-3">
              @for (message of messages(); track message.msgId) {
                <article class="flex" [class.justify-end]="message.fromMe" [class.justify-start]="!message.fromMe">
                  <div [class]="bubbleClass(message)">
                    @if (isImage(message) && mediaUrl(message)) {
                      <button type="button" class="block max-w-[180px] overflow-hidden rounded-lg" (click)="openImageViewer(message)">
                        <img class="max-h-48 w-full object-cover" [src]="mediaUrl(message)" [alt]="message.media?.caption || message.text || 'Imagen'" />
                      </button>
                    } @else if (isSticker(message) && mediaUrl(message)) {
                      <img class="max-h-12 max-w-12 object-contain" [src]="mediaUrl(message)" [alt]="message.media?.caption || 'Sticker'" />
                    } @else if (message.hasMedia) {
                      <p class="mb-1 text-xs font-semibold opacity-80">{{ mediaLabel(message) }}</p>
                    }
                    @if (message.text && !isSticker(message)) {
                      <p class="whitespace-pre-wrap break-words text-sm leading-relaxed">{{ message.text }}</p>
                    } @else if (!message.hasMedia) {
                      <p class="text-sm italic opacity-70">Mensaje sin texto</p>
                    }
                    <div class="mt-1 flex items-center justify-end gap-2 text-[11px] opacity-70">
                      <time [dateTime]="toIso(message.timestamp)">{{ message.timestamp | date: 'HH:mm' }}</time>
                      @if (message.fromMe && message.status) {
                        <span [class]="messageStatusClass(message.status)" [attr.aria-label]="messageStatusAria(message.status)">
                          {{ messageStatusIcon(message.status) }}
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
  `,
  styles: [`
    .message-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.08em;
    }

    .status-pending,
    .status-sent,
    .status-delivered {
      color: #64748b;
    }

    .status-read {
      color: #2563eb;
    }

    .status-error {
      color: #dc2626;
      letter-spacing: 0;
    }
  `]
})
export class ChatWidgetComponent {
  @ViewChild('messagesPanel') private messagesPanel?: ElementRef<HTMLElement>;

  readonly chat = computed(() => this.store.currentChat());
  readonly messages = computed(() => this.store.currentMessages());
  readonly viewerNames = signal(new Map<string, string>());
  readonly selectedImage = signal<Message | null>(null);
  readonly viewersText = computed(() => this.truncateViewers(this.store.activeViewers()
    .map((viewerId) => this.viewerNames().get(viewerId) || viewerId)
    .join(', ')));

  private lastChatId?: number;
  private pendingScrollToBottom = false;

  constructor(
    readonly store: WhatsappMessageStoreService,
    private readonly userInfo: UserInfoService
  ) {
    effect(() => {
      const chatId = this.chat()?.id;
      const messageCount = this.messages().length;

      if (chatId !== this.lastChatId) {
        this.lastChatId = chatId;
        this.pendingScrollToBottom = !!chatId;
      }

      if (this.pendingScrollToBottom && messageCount > 0) {
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

    const base = 'max-w-[78%] rounded-lg px-4 py-2 shadow-sm';
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
    return chat.jid.replace('@lid', '').replace('@s.whatsapp.net', '').replace('@g.us', '');
  }

  initials(chat: Chat): string {
    const source = chat.name || chat.jid;
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

  messageStatusIcon(status: Message['status']): string {
    if (status === 'pending') return '◷';
    if (status === 'sent') return '✓';
    if (status === 'delivered' || status === 'read') return '✓✓';
    if (status === 'error') return '!';
    return '';
  }

  messageStatusClass(status: Message['status']): string {
    return `message-status status-${status || 'sent'}`;
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
