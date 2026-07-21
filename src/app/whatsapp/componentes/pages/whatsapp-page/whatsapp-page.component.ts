import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatListWidgetComponent } from '../../widgets/chat-list-widget/chat-list-widget.component';
import { ChatWidgetComponent } from '../../widgets/chat-widget/chat-widget.component';
import { WhatsappMessageStoreService } from '../../../services';

@Component({
  selector: 'app-whatsapp-page',
  standalone: true,
  imports: [ChatListWidgetComponent, ChatWidgetComponent],
  template: `
    <main class="h-screen overflow-hidden bg-slate-100 text-slate-950">
      <section class="grid h-full grid-cols-1 lg:grid-cols-[380px_1fr]">
        <app-whatsapp-chat-list-widget />
        <app-whatsapp-chat-widget class="hidden h-full min-h-0 lg:block" />
      </section>
    </main>
  `
})
export class WhatsappPageComponent implements OnInit, OnDestroy {
  constructor(private readonly store: WhatsappMessageStoreService) {}

  ngOnInit(): void {
    this.store.connectRealtime();
  }

  ngOnDestroy(): void {
    this.store.disconnectRealtime();
  }
}
