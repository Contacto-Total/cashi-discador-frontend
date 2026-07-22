import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chat } from '../../../models';
import { WhatsappMessageStoreService } from '../../../services';

/** Tope de tamaño del adjunto (se sube por multipart; el back lo guarda en disco). */
const MAX_MEDIA_BYTES = 18 * 1024 * 1024;

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

      @if (attachError()) {
        <p class="rounded-md bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-rose-200">
          {{ attachError() }}
        </p>
      }

      @if (store.replyingTo(); as reply) {
        <div class="flex items-stretch gap-2 rounded-lg bg-slate-100 py-2 pl-2 pr-1">
          <div class="w-1 shrink-0 rounded bg-emerald-500"></div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold text-emerald-700">{{ reply.fromMe ? 'Tú' : (reply.chatTitle || chat()?.name || 'Mensaje') }}</p>
            <p class="truncate text-xs text-slate-600">{{ reply.text || (reply.hasMedia ? 'Archivo adjunto' : 'Mensaje') }}</p>
          </div>
          <button
            type="button"
            class="grid size-7 shrink-0 place-items-center self-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
            aria-label="Cancelar respuesta"
            (click)="store.setReplyingTo(null)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      }

      <input #fileInput type="file" class="hidden" accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip" (change)="onFileSelected($event)" />

      @if (recording()) {
        <div class="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2">
          <span class="size-2.5 shrink-0 animate-pulse rounded-full bg-rose-500"></span>
          <span class="text-sm font-medium text-slate-700">Grabando… {{ formatSeconds() }}</span>
          <span class="flex-1"></span>
          <button type="button" class="grid size-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-800" title="Cancelar" (click)="stopRecording(false)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
          <button type="button" class="grid size-9 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700" title="Enviar audio" (click)="stopRecording(true)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>
          </button>
        </div>
      } @else {
        <form class="flex items-end gap-2" (ngSubmit)="send()">
          <button
            type="button"
            class="grid size-11 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            title="Adjuntar"
            [disabled]="!canSend() || store.sendingMessage()"
            (click)="openFilePicker()"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05 12.25 20.24a5 5 0 0 1-7.07-7.07l8.49-8.49a3 3 0 1 1 4.24 4.24l-8.49 8.49a1 1 0 0 1-1.41-1.41l7.78-7.78"/></svg>
          </button>

          <label class="min-w-0 flex-1">
            <span class="sr-only">Mensaje</span>
            <textarea
              class="max-h-32 min-h-11 w-full resize-none rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm leading-tight text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-500"
              rows="1"
              placeholder="Escribe un mensaje"
              [disabled]="!canSend() || store.sendingMessage()"
              [ngModel]="text()"
              name="messageText"
              (ngModelChange)="text.set($event)"
              (keydown.enter)="handleEnter($event)"
            ></textarea>
          </label>

          @if (text().trim()) {
            <button
              type="submit"
              class="h-11 shrink-0 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              [disabled]="!canSubmit()"
            >
              @if (store.sendingMessage()) { Enviando } @else { Enviar }
            </button>
          } @else {
            <button
              type="button"
              class="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              title="Grabar audio"
              [disabled]="!canSend() || store.sendingMessage()"
              (click)="startRecording()"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </button>
          }
        </form>
      }
    </div>
  `
})
export class MessageInputWidgetComponent {
  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  readonly text = signal('');
  readonly attachError = signal<string | null>(null);
  readonly recording = signal(false);
  readonly recordingSeconds = signal(0);
  readonly chat = computed(() => this.store.currentChat());
  readonly canSend = computed(() => this.canSendToChat(this.chat()));
  readonly canSubmit = computed(() => this.canSend() && !!this.text().trim() && !this.store.sendingMessage());
  readonly windowWarning = computed(() => this.getWindowWarning(this.chat()));

  private mediaRecorder?: MediaRecorder;
  private audioChunks: Blob[] = [];
  private audioStream?: MediaStream;
  private recordTimer?: ReturnType<typeof setInterval>;

  constructor(readonly store: WhatsappMessageStoreService) {}

  send(): void {
    const chat = this.chat();
    const body = this.text().trim();
    if (!chat?.id || !body || !this.canSubmit()) return;

    this.store.sendText(chat.id, body, this.store.replyingTo()?.msgId);
    this.store.setReplyingTo(null);
    this.text.set('');
  }

  handleEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) return;
    keyboardEvent.preventDefault();
    this.send();
  }

  // ---- Adjuntar archivo ----
  openFilePicker(): void {
    this.attachError.set(null);
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // permitir re-seleccionar el mismo archivo
    const chat = this.chat();
    if (!file || !chat?.id || !this.canSend()) return;

    if (file.size > MAX_MEDIA_BYTES) {
      this.attachError.set(`El archivo supera el límite de ${Math.round(MAX_MEDIA_BYTES / 1024 / 1024)} MB.`);
      return;
    }

    // Sube por multipart y envía la ref (el back guarda el binario en disco).
    this.store.sendMediaFile(chat.id, file, this.text().trim() || undefined);
    this.text.set('');
  }

  // ---- Grabar audio ----
  async startRecording(): Promise<void> {
    if (this.recording() || !this.canSend()) return;
    this.attachError.set(null);
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      this.attachError.set('No se pudo acceder al micrófono.');
      return;
    }
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.audioStream);
    this.mediaRecorder.ondataavailable = (e) => { if (e.data.size) this.audioChunks.push(e.data); };
    this.mediaRecorder.start();
    this.recording.set(true);
    this.recordingSeconds.set(0);
    this.recordTimer = setInterval(() => this.recordingSeconds.update((s) => s + 1), 1000);
  }

  stopRecording(sendIt: boolean): void {
    if (!this.recording()) return;
    const recorder = this.mediaRecorder;
    const chat = this.chat();
    this.clearRecordTimer();
    this.recording.set(false);

    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = () => {
        this.releaseStream();
        if (!sendIt || !chat?.id || !this.audioChunks.length) return;
        const type = this.audioChunks[0]?.type || 'audio/webm';
        const ext = type.includes('ogg') ? 'ogg' : 'webm';
        const file = new File([new Blob(this.audioChunks, { type })], `audio-${Date.now()}.${ext}`, { type });
        this.store.sendMediaFile(chat.id, file, this.text().trim() || undefined);
        this.text.set('');
      };
      recorder.stop();
    } else {
      this.releaseStream();
    }
  }

  formatSeconds(): string {
    const s = this.recordingSeconds();
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  private clearRecordTimer(): void {
    if (this.recordTimer) {
      clearInterval(this.recordTimer);
      this.recordTimer = undefined;
    }
  }

  private releaseStream(): void {
    this.audioStream?.getTracks().forEach((t) => t.stop());
    this.audioStream = undefined;
    this.mediaRecorder = undefined;
  }

  private canSendToChat(chat: Chat | null): boolean {
    if (!chat?.id || chat.blocked) return false;
    if (!chat.windowExpiresAt) return true;
    return new Date(chat.windowExpiresAt).getTime() > Date.now();
  }

  private getWindowWarning(chat: Chat | null): string {
    if (!chat) return '';
    if (chat.blocked) return '24 h expirado.';
    if (chat.windowExpiresAt && new Date(chat.windowExpiresAt).getTime() <= Date.now()) return '24 h expirado.';
    return '';
  }
}
