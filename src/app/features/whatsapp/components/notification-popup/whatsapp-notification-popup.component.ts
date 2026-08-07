import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { RealtimeService, WhatsAppEvent } from '../../../../core/services/whatsapp/realtime.service';

interface WhatsAppNotification {
  conversationId?: number;
  chat: string;
  chatTitle: string;
  text: string;
  profilePictureUrl?: string;
  hasMedia?: boolean;
  mediaKind?: string;
}

@Component({
  selector: 'app-whatsapp-notification-popup',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './whatsapp-notification-popup.component.html',
  styleUrl: './whatsapp-notification-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsAppNotificationPopupComponent implements OnInit, OnDestroy {
  notification: WhatsAppNotification | null = null;
  private sub?: Subscription;
  private closeTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private realtime: RealtimeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sub = this.realtime.events$.subscribe(event => {
      if (event.type !== 'MESSAGE_NOTIFICATION') return;
      this.notification = this.toNotification(event);
      this.scheduleAutoClose();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.clearAutoClose();
  }

  close(): void {
    this.clearAutoClose();
    this.notification = null;
    this.cdr.markForCheck();
  }

  openChat(): void {
    if (!this.notification) return;
    // Abrir en una pestaña NUEVA para no cortar el flujo de trabajo actual del
    // agente (antes navegaba en la misma pestaña con router.navigate).
    const params = new URLSearchParams();
    params.set('conversationId', String(this.notification.conversationId));
    if (this.notification.chat) params.set('chat', this.notification.chat);
    window.open(`/wsp2?${params.toString()}`, '_blank', 'noopener');
    this.close();
  }

  displayName(): string {
    if (!this.notification) return '';
    const title = this.notification.chatTitle || this.notification.chat;
    return title.includes('@') ? this.formatPhone(this.notification.chat) : title;
  }

  preview(): string {
    if (!this.notification) return '';
    const text = this.notification.text?.trim();
    if (text) return text.length > 90 ? text.substring(0, 90) + '...' : text;
    if (!this.notification.hasMedia) return 'Nuevo mensaje';
    switch (this.notification.mediaKind) {
      case 'image': return 'Foto';
      case 'sticker': return 'Sticker';
      case 'audio': return 'Mensaje de voz';
      case 'video': return 'Video';
      case 'document': return 'Documento';
      default: return 'Adjunto';
    }
  }

  private toNotification(event: WhatsAppEvent): WhatsAppNotification {
    const payload = event.payload || {};
    return {
      conversationId: payload.conversationId || event.conversationId,
      chat: payload.chat || event.chat || '',
      chatTitle: payload.chatTitle || payload.chat || event.chat || 'WhatsApp',
      text: payload.text || '',
      profilePictureUrl: payload.profilePictureUrl,
      hasMedia: !!payload.hasMedia,
      mediaKind: payload.mediaKind
    };
  }

  private scheduleAutoClose(): void {
    this.clearAutoClose();
    this.closeTimer = setTimeout(() => this.close(), 15000);
  }

  private clearAutoClose(): void {
    if (!this.closeTimer) return;
    clearTimeout(this.closeTimer);
    this.closeTimer = undefined;
  }

  private formatPhone(jid: string): string {
    const phone = jid.split('@')[0];
    if (!/^\d+$/.test(phone)) return jid;
    if (phone.length >= 11) {
      return `+${phone.substring(0, 2)} ${phone.substring(2).match(/.{1,3}/g)?.join(' ') || phone.substring(2)}`;
    }
    return `+${phone}`;
  }
}
