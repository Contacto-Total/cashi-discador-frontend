import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { Chat } from '../../../../../core/models/message.model';
import { MessageService } from '../../../../../core/services/whatsapp/message.service';
import { ThemeService } from '../../../../../core/services/whatsapp/theme.service';
import { AuthService } from '../../../../../core/services/whatsapp/auth.service';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatBadgeModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconButton,
    MatMenuModule
  ],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.scss'
})
export class ChatList implements OnInit {
  @Output() chatSelected = new EventEmitter<Chat>();

  allItems: Chat[] = [];
  allContacts: any[] = [];
  filteredChats: Chat[] = [];
  searchText: string = '';
  selectedChatJid: string | null = null;
  isDarkMode: boolean = false;

  constructor(
    private messageService: MessageService,
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los chats activos
    this.messageService.allItems$.subscribe(items => {
      console.log('📱 Chats activos:', items.length);
      this.allItems = items;
      this.filterChats();
    });

    // Suscribirse a TODOS los contactos para la búsqueda
    this.messageService.contacts$.subscribe(contacts => {
      console.log('📇 Todos los contactos:', contacts.length);
      this.allContacts = contacts;
    });

    // Suscribirse al estado del tema
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }

  getCurrentUsername(): string {
    const user = this.authService.getCurrentUser();
    console.log('👤 getCurrentUsername() llamado');
    console.log('👤 Usuario actual:', user);
    console.log('👤 fullName:', user?.fullName);
    console.log('👤 username:', user?.username);

    // Mostrar nombre completo, si no existe mostrar username, si no existe mostrar 'Usuario'
    const displayName = user?.fullName || user?.username || 'Usuario';
    console.log('👤 Mostrando:', displayName);
    return displayName;
  }

  filterChats(): void {
    if (!this.searchText.trim()) {
      // Sin búsqueda: mostrar solo chats activos
      this.filteredChats = this.allItems;
    } else {
      const search = this.searchText.toLowerCase().trim();

      // Buscar en chats activos
      const chatsMatched = this.allItems.filter(chat => {
        const name = chat.name?.toLowerCase() || '';
        const jid = chat.jid?.toLowerCase() || '';
        const lastMessage = chat.lastMsgText?.toLowerCase() || '';

        return name.includes(search) ||
               jid.includes(search) ||
               lastMessage.includes(search);
      });

      // Buscar en TODOS los contactos (incluye los que no tienen chat)
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
      return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) {
      return date.toLocaleDateString('es-PE', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });
    }
  }

  truncateMessage(message?: string): string {
    if (!message) return 'Toca para iniciar conversación';
    return message.length > 50 ? message.substring(0, 50) + '...' : message;
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
