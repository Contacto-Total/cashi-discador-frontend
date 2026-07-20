import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chat } from '../../../models';
import { WhatsappMessageStoreService } from '../../../services';

@Component({
  selector: 'app-whatsapp-message-input-widget',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-2">
      @if (windowWarning()) {
        <p class="rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
          {{ windowWarning() }}
        </p>
      }

      @if (store.sendMessageError()) {
        <p class="rounded-md bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-rose-200">
          {{ store.sendMessageError() }}
        </p>
      }

      <form class="flex items-end gap-2" (ngSubmit)="send()">
        <label class="min-w-0 flex-1">
          <span class="sr-only">Mensaje</span>
          <textarea
            class="max-h-32 min-h-11 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-500"
            rows="1"
            placeholder="Escribe un mensaje"
            [disabled]="!canSend() || store.sendingMessage()"
            [ngModel]="text()"
            name="messageText"
            (ngModelChange)="text.set($event)"
            (keydown.enter)="handleEnter($event)"
          ></textarea>
        </label>

        <button
          type="submit"
          class="h-11 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          [disabled]="!canSubmit()"
        >
          @if (store.sendingMessage()) {
            Enviando
          } @else {
            Enviar
          }
        </button>
      </form>
    </div>
  `
})
export class MessageInputWidgetComponent {
  readonly text = signal('');
  readonly chat = computed(() => this.store.currentChat());
  readonly canSend = computed(() => this.canSendToChat(this.chat()));
  readonly canSubmit = computed(() => this.canSend() && !!this.text().trim() && !this.store.sendingMessage());
  readonly windowWarning = computed(() => this.getWindowWarning(this.chat()));

  constructor(readonly store: WhatsappMessageStoreService) {}

  send(): void {
    const chat = this.chat();
    const body = this.text().trim();
    if (!chat?.id || !body || !this.canSubmit()) return;

    this.store.sendText(chat.id, body);
    this.text.set('');
  }

  handleEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) return;
    keyboardEvent.preventDefault();
    this.send();
  }

  private canSendToChat(chat: Chat | null): boolean {
    if (!chat?.id || chat.blocked) return false;
    if (!chat.windowExpiresAt) return true;
    return new Date(chat.windowExpiresAt).getTime() > Date.now();
  }

  private getWindowWarning(chat: Chat | null): string {
    if (!chat) return '';
    if (chat.blocked) return 'Chat fuera de ventana. Para escribir se requiere una plantilla.';
    if (chat.windowExpiresAt && new Date(chat.windowExpiresAt).getTime() <= Date.now()) {
      return 'La ventana de 24h expiró. Para escribir se requiere una plantilla.';
    }
    return '';
  }
}
