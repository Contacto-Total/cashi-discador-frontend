import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Chat, WhatsappAccount } from '../../../models';
import { WhatsappApiService, WhatsappMessageStoreService } from '../../../services';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-whatsapp-chat-list-widget',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink],
  template: `
    <aside class="flex h-full min-h-0 flex-col overflow-hidden border-r border-slate-200 bg-white text-slate-950">
      <header class="border-b border-slate-200 p-3">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">WhatsApp</p>
            <h2 class="mt-1 text-xl font-semibold">Conversaciones</h2>
          </div>
          <div class="flex shrink-0 items-center gap-2">
          @if (isAdmin) {
            <a
              routerLink="/whatsapp/dashboard"
              class="grid size-9 place-items-center rounded-full border border-slate-300 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700"
              title="Administrar instancias"
              aria-label="Administrar instancias"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </a>
          }
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
           @if (!includeHistorical) {
           <label class="mt-2 block">
           <span class="sr-only">Filtrar por servicio WhatsApp</span>
           <select
             class="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
             [ngModel]="accountFilter()"
             (ngModelChange)="filterByAccount($event)"
           >
             <option [ngValue]="undefined">Todos los servicios activos</option>
             @for (account of serviceAccounts; track account.id) {
               <option [ngValue]="account.id">{{ account.phoneNumber || account.instanciaId }} · {{ account.subcarteraName || ('Subcartera #' + account.subcarteraId) }}</option>
             }
           </select>
            </label>
            }
            <button
              type="button"
              class="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition hover:text-emerald-700"
              [class.text-emerald-700]="hideClosedWindows()"
              (click)="hideClosedWindows.update(value => !value)"
            >
              <span class="grid size-4 place-items-center rounded border" [class.border-emerald-600]="hideClosedWindows()" [class.bg-emerald-600]="hideClosedWindows()" [class.border-slate-300]="!hideClosedWindows()">
                @if (hideClosedWindows()) { <span class="text-[10px] text-white">✓</span> }
              </span>
              Ocultar chats con ventana vencida (+24 h)
            </button>
      </header>

       <section class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
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
            @for (chat of visibleChats(); track trackChat(chat)) {
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
                         {{ chatTime(chat) }}
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
                   <p class="mt-1 truncate text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                     {{ serviceLabel(chat) }} · {{ serviceScopeLabel(chat) }}
                   </p>
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
  @Input() includeHistorical = false;
  readonly query = signal('');
  readonly accountFilter = signal<number | undefined>(undefined);
  readonly hideClosedWindows = signal(false);
  serviceAccounts: WhatsappAccount[] = [];
  readonly skeletonItems = [1, 2, 3, 4, 5];
  readonly selectedChat = computed(() => this.store.currentChat());
  readonly visibleChats = computed(() => this.store.chats().filter(chat =>
    !this.hideClosedWindows() || !this.isWindowClosed(chat)));

  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor(
    readonly store: WhatsappMessageStoreService,
    private readonly whatsappApi: WhatsappApiService,
    private readonly auth: AuthService
  ) {}

  get isAdmin(): boolean {
    return this.auth.getCurrentUser()?.role === 'ADMIN';
  }

  ngOnInit(): void {
    if (this.includeHistorical) {
      this.store.setAccountFilter(undefined, true);
    } else {
      // El store es singleton: al volver desde historial se debe reemplazar su
      // contenido, aunque todavía conserve chats de una cuenta eliminada.
      this.store.setAccountFilter(undefined, false);
    }
    this.whatsappApi.getWhatsappAccounts().subscribe({
       next: accounts => this.serviceAccounts = this.includeHistorical
         ? accounts
          : accounts.filter(account => account.active === true && account.currentAccount !== false)
    });
  }

  search(value: string): void {
    this.query.set(value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const q = value.trim() || undefined;
        this.store.loadChats(0, 30, q, this.accountFilter(), this.includeHistorical);
    }, 250);
  }

  reload(): void {
    this.store.loadChats(0, 30, this.query().trim() || undefined, this.accountFilter(), this.includeHistorical);
  }

  filterByAccount(value: number | string | undefined): void {
    const accountId = value === undefined || value === '' ? undefined : Number(value);
    this.accountFilter.set(accountId);
    this.store.setAccountFilter(accountId, this.includeHistorical);
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

  private isWindowClosed(chat: Chat): boolean {
    return chat.blocked === true
      || (!!chat.windowExpiresAt && new Date(chat.windowExpiresAt).getTime() <= Date.now());
  }

  serviceLabel(chat: Chat): string {
    return chat.servicePhoneNumber || chat.serviceInstanciaId || 'Servicio sin identificar';
  }

  serviceScopeLabel(chat: Chat): string {
    return chat.serviceSubcarteraName || (chat.serviceSubcarteraId ? `Subcartera #${chat.serviceSubcarteraId}` : 'Subcartera pendiente');
  }

  toIso(timestamp: number): string {
    return new Date(timestamp).toISOString();
  }

  chatTime(chat: Chat): string {
    if (!chat.lastMsgTs) return '';
    const date = new Date(chat.lastMsgTs);
    const now = new Date();
    const sameDay = date.getFullYear() === now.getFullYear()
      && date.getMonth() === now.getMonth()
      && date.getDate() === now.getDate();
    return formatDate(date, sameDay ? 'HH:mm' : 'dd/MM/yy', 'es-PE');
  }
}
