import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatListWidgetComponent } from '../../widgets/chat-list-widget/chat-list-widget.component';
import { ChatWidgetComponent } from '../../widgets/chat-widget/chat-widget.component';
import { WhatsappMessageStoreService } from '../../../services/whatsapp-message-store.service';

@Component({
  selector: 'app-whatsapp-history',
  standalone: true,
  imports: [RouterLink, ChatListWidgetComponent, ChatWidgetComponent],
  template: `
    <main class="history-page">
      <header class="history-header">
        <div>
          <span class="history-kicker">Archivo operativo</span>
          <h1>Historial de instancias</h1>
          <p>Consulta conversaciones de cuentas actuales, sesiones cerradas y números reemplazados sin mezclarlas.</p>
        </div>
        <a routerLink="/whatsapp/dashboard" class="back-link">← Volver al dashboard</a>
      </header>

      <section class="history-shell">
        <app-whatsapp-chat-list-widget [includeHistorical]="true"></app-whatsapp-chat-list-widget>
        <app-whatsapp-chat-widget [readOnly]="true"></app-whatsapp-chat-widget>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100%; }
    .history-page { min-height: 100vh; padding: 24px clamp(12px, 3vw, 34px) 34px; background: var(--bg-primary); color: var(--text-primary); }
    .history-header, .history-shell { max-width: 1420px; margin: 0 auto; }
    .history-header { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 18px; padding: 22px 24px; border: 1px solid rgba(148,163,184,.18); border-radius: 22px; background: color-mix(in srgb, var(--bg-secondary) 82%, transparent); }
    .history-kicker { color: #0f9d8a; font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    h1 { margin: 7px 0 0; font-size: clamp(26px, 4vw, 42px); font-weight: 850; letter-spacing: -.05em; line-height: 1; }
    .history-header p { max-width: 680px; margin-top: 9px; color: var(--text-secondary); font-size: 13px; line-height: 1.5; }
    .back-link { padding: 9px 12px; border: 1px solid rgba(148,163,184,.22); border-radius: 10px; color: var(--text-secondary); font-size: 12px; font-weight: 800; text-decoration: none; white-space: nowrap; }
    .back-link:hover { border-color: #14b8a6; color: #0f766e; }
    .history-shell { display: grid; grid-template-columns: minmax(280px, 390px) minmax(0, 1fr); height: calc(100vh - 190px); min-height: 520px; overflow: hidden; border: 1px solid rgba(148,163,184,.18); border-radius: 22px; background: white; box-shadow: 0 20px 48px rgba(15,23,42,.07); }
    .history-shell > * { min-width: 0; min-height: 0; }
    @media (max-width: 800px) {
      .history-header { align-items: start; flex-direction: column; }
      .history-shell { grid-template-columns: 1fr; height: 760px; }
    }
  `]
})
export class WhatsappHistoryComponent implements OnInit, OnDestroy {
  constructor(private readonly store: WhatsappMessageStoreService) {}

  ngOnInit(): void {
    this.store.connectRealtime();
  }

  ngOnDestroy(): void {
    this.store.stopViewingCurrentChat();
    this.store.disconnectRealtime();
  }
}
