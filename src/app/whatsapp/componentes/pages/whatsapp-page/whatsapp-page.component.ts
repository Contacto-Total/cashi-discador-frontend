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

      @if (isInactive) {
        <section class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6" aria-live="assertive">
          <div class="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
            <h1 class="text-lg font-semibold text-slate-950">Sesión inactiva</h1>
            <p class="mt-2 text-sm text-slate-600">Tu estado cambió a desconectado por inactividad.</p>
            <button
              type="button"
              class="mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              (click)="reloadPage()">
              Recargar página
            </button>
          </div>
        </section>
      }
    </main>
  `
})
export class WhatsappPageComponent implements OnInit, OnDestroy {
  private static readonly INACTIVITY_TIMEOUT_MS = 5000;
  private routeSub?: Subscription;
  private statusChangedByWhatsapp = false;
  private inactivityTimer?: ReturnType<typeof setTimeout>;
  isInactive = false;

  constructor(
    private readonly store: WhatsappMessageStoreService,
    private readonly route: ActivatedRoute,
    private readonly auth: AuthService,
    private readonly agentStatus: AgentStatusService
  ) {}

  ngOnInit(): void {
    this.setWhatsappAgentStatus();
    document.addEventListener('pointermove', this.resetInactivityTimer);
    document.addEventListener('pointerdown', this.resetInactivityTimer);
    document.addEventListener('keydown', this.resetInactivityTimer);
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
    document.removeEventListener('pointermove', this.resetInactivityTimer);
    document.removeEventListener('pointerdown', this.resetInactivityTimer);
    document.removeEventListener('keydown', this.resetInactivityTimer);
    this.clearInactivityTimer();
    this.disconnectFromWhatsapp();
    this.store.stopViewingCurrentChat();
    this.store.disconnectRealtime();
  }

  private setWhatsappAgentStatus(): void {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return;

    this.agentStatus.getAgentStatus(user.id).subscribe({
      next: status => {
        const currentStatus = status.estadoActual as AgentState;
        if (this.isProtectedStatus(currentStatus)) return;
        this.agentStatus.changeStatus(user.id, { estado: AgentState.WHATSAPP }).subscribe({
          next: () => {
            this.statusChangedByWhatsapp = true;
            this.resetInactivityTimer();
          }
        });
      }
    });
  }

  private readonly resetInactivityTimer = (): void => {
    if (!this.statusChangedByWhatsapp || this.isInactive) return;
    this.clearInactivityTimer();
    this.inactivityTimer = setTimeout(() => this.disconnectFromWhatsapp(true), WhatsappPageComponent.INACTIVITY_TIMEOUT_MS);
  };

  private disconnectFromWhatsapp(markInactive = false): void {
    const user = this.auth.getCurrentUser();
    if (!user?.id || !this.statusChangedByWhatsapp) return;

    this.clearInactivityTimer();
    this.agentStatus.getAgentStatus(user.id).subscribe({
      next: status => {
        if (status.estadoActual !== AgentState.WHATSAPP) {
          this.statusChangedByWhatsapp = false;
          return;
        }

        this.statusChangedByWhatsapp = false;
        if (markInactive) this.isInactive = true;
        this.agentStatus.changeStatus(user.id, { estado: AgentState.DESCONECTADO }).subscribe();
      }
    });
  }

  private clearInactivityTimer(): void {
    if (!this.inactivityTimer) return;
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = undefined;
  }

  private isProtectedStatus(status: AgentState): boolean {
    return status === AgentState.EN_LLAMADA ||
      status === AgentState.TIPIFICANDO ||
      status === AgentState.SEGUIMIENTO;
  }

  reloadPage(): void {
    window.location.reload();
  }
}
