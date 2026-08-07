import { Component, OnInit, OnDestroy, Output, EventEmitter, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormatService } from '@/shared/services/format.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { Chat } from '../../../../../core/models/message.model';
import { MessageService } from '../../../../../core/services/whatsapp/message.service';
import { ThemeService } from '../../../../../core/services/whatsapp/theme.service';
import { AuthService } from '../../../../../core/services/whatsapp/auth.service';
import { MatIconButton } from '@angular/material/button';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconButton,
    MatMenuModule,
    LucideAngularModule
  ],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.scss'
})
export class ChatList implements OnInit, OnDestroy {
  private fmt = inject(FormatService);

  @Output() chatSelected = new EventEmitter<Chat>();

  allItems: Chat[] = [];
  allContacts: any[] = [];
  filteredChats: Chat[] = [];
  searchText: string = '';
  selectedChatJid: string | null = null;
  isDarkMode: boolean = false;
  filterMode: 'all' | 'unread' = 'all';
  chatsLoading = false;
  chatsHasMore = false;

  // La búsqueda la resuelve el backend (`q`); se debouncea para no lanzar una
  // consulta por tecla.
  private searchInput$ = new Subject<string>();
  private subs = new Subscription();
  showNewChatInput = false;
  newChatNumber = '';
  contextMenuChat: Chat | null = null;
  contextMenuX = 0;
  contextMenuY = 0;
  showContextMenu = false;

  constructor(
    private messageService: MessageService,
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los chats activos
    this.subs.add(this.messageService.allItems$.subscribe(items => {
      console.log('📱 Chats activos:', items.length);
      this.allItems = items;
      this.filterChats();
    }));

    // Suscribirse a TODOS los contactos para la búsqueda
    this.subs.add(this.messageService.contacts$.subscribe(contacts => {
      this.allContacts = contacts;
    }));

    // Suscribirse al estado del tema
    this.subs.add(this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    }));

    // Estado de la paginación
    this.subs.add(this.messageService.chatsLoading$.subscribe(v => this.chatsLoading = v));
    this.subs.add(this.messageService.chatsHasMore$.subscribe(v => this.chatsHasMore = v));

    this.subs.add(
      this.searchInput$.pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(q => this.messageService.loadChats(q))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * Cada tecla filtra en local (respuesta inmediata sobre lo ya cargado) y, tras
   * el debounce, dispara la búsqueda remota que trae los chats que no están en
   * memoria.
   */
  onSearchChange(): void {
    this.filterChats();
    this.searchInput$.next(this.searchText.trim());
  }

  clearSearch(): void {
    this.searchText = '';
    this.onSearchChange();
  }

  /** Carga la siguiente página al acercarse al final de la lista. */
  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const nearEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    if (nearEnd) {
      this.messageService.loadMoreChats();
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }

  getCurrentUsername(): string {
    const user = this.authService.getCurrentUser();
    if (!user) return 'Usuario';

    // Combinar firstName y lastName, o usar username si no existen
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return fullName || user.username || 'Usuario';
  }

  setFilter(mode: 'all' | 'unread'): void {
    this.filterMode = mode;
    this.filterChats();
  }

  trackByChatJid(index: number, chat: Chat): string {
    return chat.jid;
  }

  filterChats(): void {
    let chatsToShow = this.allItems;

    // Aplicar filtro de no leídos primero
    if (this.filterMode === 'unread') {
      chatsToShow = this.allItems.filter(chat => chat.unreadCount && chat.unreadCount > 0);
    }

    if (!this.searchText.trim()) {
      // Sin búsqueda: mostrar chats según filtro
      this.filteredChats = chatsToShow;
    } else {
      const search = this.searchText.toLowerCase().trim();

      // Buscar en chats según filtro aplicado
      const chatsMatched = chatsToShow.filter(chat => {
        const name = chat.name?.toLowerCase() || '';
        const jid = chat.jid?.toLowerCase() || '';
        const lastMessage = chat.lastMsgText?.toLowerCase() || '';

        return name.includes(search) ||
               jid.includes(search) ||
               lastMessage.includes(search);
      });

      // Buscar en TODOS los contactos solo si estamos en modo "todos" (no en "no leídos")
      if (this.filterMode === 'all') {
        const chatJids = new Set(this.allItems.map(c => c.jid));
        const contactsMatched = this.allContacts
          .filter(contact => {
            // No duplicar contactos que ya tienen chat
            if (chatJids.has(contact.jid)) return false;

            const name = contact.name?.toLowerCase() || '';
            const jid = contact.jid?.toLowerCase() || '';

            return name.includes(search) || jid.includes(search);
          })
          .map(contact => ({
            jid: contact.jid,
            name: contact.name || contact.pushName || contact.jid,
            lastMsgText: '',
            lastMsgTs: 0,
            unreadCount: 0
          } as Chat));

        // Combinar resultados: chats primero, luego contactos
        this.filteredChats = [...chatsMatched, ...contactsMatched];
        console.log(`🔍 Búsqueda: "${this.searchText}" - Chats: ${chatsMatched.length}, Contactos: ${contactsMatched.length}`);
      } else {
        // En modo "no leídos" solo mostrar chats, no contactos
        this.filteredChats = chatsMatched;
      }
    }
  }

  selectChat(chat: Chat): void {
    this.selectedChatJid = chat.jid;
    this.chatSelected.emit(chat);
    this.messageService.selectChat(chat);
  }

  formatTime(timestamp?: number): string {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 86400000) {
      return this.fmt.time(date, false);
    } else if (diff < 604800000) {
      return this.fmt.date(date, { weekday: 'short' });
    } else {
      return this.fmt.date(date, { day: '2-digit', month: '2-digit' });
    }
  }

  truncateMessage(message?: string): string {
    if (!message) return 'Toca para iniciar conversación';
    return message.length > 50 ? message.substring(0, 50) + '...' : message;
  }

  getMediaIcon(chat: Chat): string {
    switch (chat.lastMsgMediaKind) {
      case 'image':    return '📷';
      case 'video':    return '🎥';
      case 'audio':    return '🎵';
      case 'document': return '📄';
      case 'sticker':  return '🎭';
      default:         return '📎';
    }
  }

  getLastMsgPreview(chat: Chat): string {
    if (chat.lastMsgHasMedia) {
      const icon = this.getMediaIcon(chat);
      const caption = chat.lastMsgText?.trim() ? ` ${chat.lastMsgText}` : '';
      switch (chat.lastMsgMediaKind) {
        case 'image':    return `${icon} Foto${caption}`;
        case 'video':    return `${icon} Video${caption}`;
        case 'audio':    return `${icon} Mensaje de voz`;
        case 'document': return `${icon} Documento`;
        case 'sticker':  return `${icon} Sticker`;
        default:         return `${icon} Adjunto`;
      }
    }
    if (!chat.lastMsgText) return 'Toca para iniciar conversación';
    return chat.lastMsgText.length > 48
      ? chat.lastMsgText.substring(0, 48) + '…'
      : chat.lastMsgText;
  }

  toggleNewChat(): void {
    this.showNewChatInput = !this.showNewChatInput;
    this.newChatNumber = '';
  }

  startNewChat(): void {
    const raw = this.newChatNumber.replace(/\D/g, '');
    if (!raw) return;
    const jid = raw.startsWith('51') ? `${raw}@s.whatsapp.net` : `51${raw}@s.whatsapp.net`;
    const newChat: Chat = {
      jid,
      name: `+${raw.startsWith('51') ? raw : '51' + raw}`,
      lastMsgText: '',
      lastMsgTs: 0,
      unreadCount: 0,
      isGroup: false,
    };
    this.showNewChatInput = false;
    this.newChatNumber = '';
    this.selectChat(newChat);
  }

  openContextMenu(event: MouseEvent, chat: Chat): void {
    event.preventDefault();
    this.contextMenuChat = chat;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.showContextMenu = true;
  }

  closeContextMenu(): void {
    this.showContextMenu = false;
    this.contextMenuChat = null;
  }

  markAsUnread(chat: Chat): void {
    this.messageService.markChatAsUnread(chat.jid);
    this.closeContextMenu();
  }

  // Formatear nombre del chat para mostrar números bonitos
  formatChatName(chat: Chat): string {
    if (!chat.name || chat.name.includes('@s.whatsapp.net')) {
      // Si es un JID crudo, formatearlo
      return this.formatPhoneNumber(chat.jid);
    }
    return chat.name;
  }

  // Formatear número de teléfono a formato internacional
  private formatPhoneNumber(jid: string): string {
    // Extraer el número del JID
    const phone = jid.split('@')[0];

    // Verificar que sea un número
    if (!/^\d+$/.test(phone)) {
      return jid;
    }

    // Formatear según longitud
    if (phone.length >= 11) {
      // Ej: 51913254120 -> +51 913 254 120
      const countryCode = phone.substring(0, 2);
      const rest = phone.substring(2);
      const formatted = rest.match(/.{1,3}/g)?.join(' ') || rest;
      return `+${countryCode} ${formatted}`;
    } else if (phone.length >= 10) {
      // Número de 10 dígitos
      const countryCode = phone.substring(0, 1);
      const rest = phone.substring(1);
      const formatted = rest.match(/.{1,3}/g)?.join(' ') || rest;
      return `+${countryCode} ${formatted}`;
    } else {
      return `+${phone}`;
    }
  }
}
