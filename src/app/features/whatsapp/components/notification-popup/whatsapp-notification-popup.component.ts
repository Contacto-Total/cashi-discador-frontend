import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { RealtimeService, WhatsAppEvent } from '../../../../core/services/whatsapp/realtime.service';

interface WhatsAppNotification {
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

  constructor(
    private realtime: RealtimeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sub = this.realtime.events$.subscribe(event => {
      if (event.type !== 'MESSAGE_NOTIFICATION') return;
      this.notification = this.toNotification(event);
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  close(): void {
    this.notification = null;
    this.cdr.markForCheck();
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
      chat: payload.chat || event.chat || '',
      chatTitle: payload.chatTitle || payload.chat || event.chat || 'WhatsApp',
      text: payload.text || '',
      profilePictureUrl: payload.profilePictureUrl,
      hasMedia: !!payload.hasMedia,
      mediaKind: payload.mediaKind
    };
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
