import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chat } from '../../../models';
import { WhatsappMessageStoreService } from '../../../services';

@Component({
  selector: 'app-whatsapp-chat-list-widget',
  standalone: true,
  imports: [DatePipe, FormsModule],
  template: `
    <aside class="flex h-full min-h-0 flex-col overflow-hidden border-r border-slate-200 bg-white text-slate-950">
      <header class="border-b border-slate-200 p-3">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">WhatsApp</p>
            <h2 class="mt-1 text-xl font-semibold">Conversaciones</h2>
          </div>
          <button
            type="button"
            class="grid size-9 shrink-0 place-items-center rounded-full border border-slate-300 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-50"
            [disabled]="store.loadingChats()"
            (click)="reload()"
            title="Actualizar"
            aria-label="Actualizar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.animate-spin]="store.loadingChats()"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>
          </button>
        </div>

        <label class="mt-3 block">
          <span class="sr-only">Buscar chat</span>
          <input
            class="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            type="search"
            placeholder="Buscar chat"
            [ngModel]="query()"
            (ngModelChange)="search($event)"
          />
        </label>
      </header>

      <section class="min-h-0 flex-1 overflow-y-auto">
        @if (store.loadingChats() && !store.chats().length) {
          <div class="space-y-2 p-2">
            @for (item of skeletonItems; track item) {
              <div class="h-20 animate-pulse rounded-lg bg-slate-100"></div>
            }
          </div>
        } @else if (!store.chats().length) {
          <div class="flex h-full flex-col items-center justify-center px-8 text-center text-slate-500">
            <div class="grid size-14 place-items-center rounded-full bg-slate-100 text-2xl">#</div>
            <p class="mt-4 font-semibold text-slate-900">Sin conversaciones</p>
            <p class="mt-2 text-sm">No encontramos chats para mostrar con el filtro actual.</p>
          </div>
        } @else {
          <div>
            @for (chat of store.chats(); track trackChat(chat)) {
              <button
                type="button"
                [class]="chatButtonClass(chat)"
                (click)="selectChat(chat)"
              >
                <div class="relative shrink-0">
                  @if (chat.profilePictureUrl) {
                    <img
                      class="size-12 rounded-full object-cover ring-1 ring-slate-200"
                      [src]="chat.profilePictureUrl"
                      [alt]="chat.name"
                    />
                  } @else {
                    <div class="grid size-12 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-slate-950">
                      {{ initials(chat) }}
                    </div>
                  }
                  @if (chat.blocked) {
                    <span class="absolute -bottom-1 -right-1 rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">24h</span>
                  }
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2">
                    <p class="truncate text-sm font-semibold text-slate-950">{{ chatDisplayName(chat) }}</p>
                    @if (chat.lastMsgTs) {
                      <time class="shrink-0 text-xs font-medium text-slate-500" [dateTime]="toIso(chat.lastMsgTs)">
                        {{ chat.lastMsgTs | date: 'HH:mm' }}
                      </time>
                    }
                  </div>
                  <div class="mt-1 flex items-center justify-between gap-2">
                    <p class="truncate text-sm text-slate-600">
                      @if (chat.lastMsgFromMe) {
                        <span class="font-medium text-emerald-700">Tú: </span>
                      }
                      {{ preview(chat) }}
                    </p>
                    @if ((chat.unreadCount || 0) > 0) {
                      <span class="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-emerald-500 px-1.5 text-[11px] font-bold leading-none text-white">
                        {{ unreadBadge(chat) }}
                      </span>
                    }
                  </div>
                </div>
              </button>
            }
          </div>
        }
      </section>

      <footer class="border-t border-slate-200 p-2">
        <button
          type="button"
          class="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          [disabled]="!store.hasMoreChats() || store.loadingChats()"
          (click)="store.loadNextChatsPage()"
        >
          @if (store.loadingChats() && store.chats().length) {
            Cargando...
          } @else if (store.hasMoreChats()) {
            Cargar más chats
          } @else {
            No hay más chats
          }
        </button>
      </footer>
    </aside>
  `
})
export class ChatListWidgetComponent implements OnInit {
  readonly query = signal('');
  readonly skeletonItems = [1, 2, 3, 4, 5];
  readonly selectedChat = computed(() => this.store.currentChat());

  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor(readonly store: WhatsappMessageStoreService) {}

  ngOnInit(): void {
    if (!this.store.chats().length) this.store.loadChats();
  }

  search(value: string): void {
    this.query.set(value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const q = value.trim() || undefined;
      this.store.loadChats(0, 30, q);
    }, 250);
  }

  reload(): void {
    this.store.loadChats(0, 30, this.query().trim() || undefined);
  }

  selectChat(chat: Chat): void {
    this.store.selectChat(chat);
  }

  isSelected(chat: Chat): boolean {
    const selected = this.selectedChat();
    return !!selected && (selected.id === chat.id || selected.jid === chat.jid);
  }

  chatButtonClass(chat: Chat): string {
    const base = 'group flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition';
    return this.isSelected(chat) ? `${base} bg-emerald-100 hover:bg-emerald-100` : `${base} hover:bg-slate-50`;
  }

  chatDisplayName(chat: Chat): string {
    if (!chat.name || chat.name.includes('@lid') || chat.name.includes('@s.whatsapp.net')) {
      return chat.contactPhone || chat.name || chat.jid;
    }
    return chat.name;
  }

  trackChat(chat: Chat): string | number {
    return chat.id ?? chat.jid;
  }

  initials(chat: Chat): string {
    const source = chat.name || chat.jid;
    const parts = source.split(/\s+/).filter(Boolean);
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : source.slice(0, 2).toUpperCase();
  }

  /** No-leídos con tope visual "+10" (como WhatsApp). */
  unreadBadge(chat: Chat): string {
    const count = chat.unreadCount || 0;
    return count > 10 ? '+10' : String(count);
  }

  preview(chat: Chat): string {
    if (chat.lastMsgText?.trim()) return chat.lastMsgText;
    return chat.lastMsgTs ? 'Mensaje multimedia' : 'Sin mensajes recientes';
  }

  toIso(timestamp: number): string {
    return new Date(timestamp).toISOString();
  }
}
