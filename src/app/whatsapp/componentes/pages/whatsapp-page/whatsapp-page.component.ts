import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatListWidgetComponent } from '../../widgets/chat-list-widget/chat-list-widget.component';
import { ChatWidgetComponent } from '../../widgets/chat-widget/chat-widget.component';
import { WhatsappMessageStoreService } from '../../../services';

@Component({
  selector: 'app-whatsapp-page',
  standalone: true,
  imports: [ChatListWidgetComponent, ChatWidgetComponent],
  template: `
    <main class="h-screen overflow-hidden bg-slate-100 text-slate-950">
      <section class="grid h-full grid-cols-1 sm:grid-cols-[minmax(320px,30%)_minmax(0,1fr)]">
        <app-whatsapp-chat-list-widget />
        <app-whatsapp-chat-widget class="hidden h-full min-h-0 sm:block" />
      </section>
    </main>
  `
})
export class WhatsappPageComponent implements OnInit, OnDestroy {
  private routeSub?: Subscription;

  constructor(
    private readonly store: WhatsappMessageStoreService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.connectRealtime();
    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      const rawConversationId = params.get('conversationId');
      const conversationId = rawConversationId ? Number(rawConversationId) : undefined;
      const chat = params.get('chat') || undefined;
      if (conversationId || chat) this.store.selectChatByRoute(conversationId, chat);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.store.disconnectRealtime();
  }
}
