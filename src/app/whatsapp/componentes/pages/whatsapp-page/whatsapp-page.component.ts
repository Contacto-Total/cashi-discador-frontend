import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatListWidgetComponent } from '../../widgets/chat-list-widget/chat-list-widget.component';
import { ChatWidgetComponent } from '../../widgets/chat-widget/chat-widget.component';
import { InfoClientWidgetComponent } from '../../info-client/info-client-widget.component';
import { WhatsappMessageStoreService } from '../../../services';
import { AuthService } from '../../../../core/services/auth.service';
import { AgentStatusService } from '../../../../core/services/agent-status.service';
import { AgentState } from '../../../../core/models/agent-status.model';

@Component({
  selector: 'app-whatsapp-page',
  standalone: true,
  imports: [ChatListWidgetComponent, ChatWidgetComponent, InfoClientWidgetComponent],
  template: `
    <main class="h-screen min-h-0 overflow-hidden bg-slate-100 text-slate-950">
      <section class="grid h-full min-h-0 grid-cols-1 sm:grid-cols-[minmax(300px,30%)_minmax(0,1fr)] lg:grid-cols-[minmax(280px,22%)_minmax(0,1fr)_minmax(300px,24%)]">
        <app-whatsapp-chat-list-widget class="min-h-0 min-w-0" />
        <app-whatsapp-chat-widget class="hidden h-full min-h-0 min-w-0 sm:block" />
        <app-whatsapp-info-client-widget class="hidden h-full min-h-0 min-w-0 lg:block" />
      </section>
    </main>
  `
})
export class WhatsappPageComponent implements OnInit, OnDestroy {
  private routeSub?: Subscription;
  private statusChangedByWhatsapp = false;
  private previousStatus?: AgentState;

  constructor(
    private readonly store: WhatsappMessageStoreService,
    private readonly route: ActivatedRoute,
    private readonly auth: AuthService,
    private readonly agentStatus: AgentStatusService
  ) {}

  ngOnInit(): void {
    this.setWhatsappAgentStatus();
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
    this.restoreAgentStatus();
    this.store.stopViewingCurrentChat();
    this.store.disconnectRealtime();
  }

  private setWhatsappAgentStatus(): void {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return;

    this.agentStatus.getAgentStatus(user.id).subscribe({
      next: status => {
        const currentStatus = status.estadoActual as AgentState;
        this.previousStatus = currentStatus;
        if (currentStatus !== AgentState.DISPONIBLE) return;
        this.agentStatus.changeStatus(user.id, { estado: AgentState.TIPIFICANDO }).subscribe({
          next: () => this.statusChangedByWhatsapp = true
        });
      }
    });
  }

  private restoreAgentStatus(): void {
    const user = this.auth.getCurrentUser();
    if (!user?.id || !this.statusChangedByWhatsapp) return;
    this.agentStatus.changeStatus(user.id, {
      estado: this.previousStatus || AgentState.DISPONIBLE
    }).subscribe();
    this.statusChangedByWhatsapp = false;
  }
}
