import { Component } from '@angular/core';
import { ChatListWidgetComponent } from '../../widgets/chat-list-widget/chat-list-widget.component';

@Component({
  selector: 'app-whatsapp-page',
  standalone: true,
  imports: [ChatListWidgetComponent],
  template: `
    <main class="h-screen overflow-hidden bg-slate-950 p-4 text-slate-100 md:p-6">
      <section class="mx-auto grid h-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">
        <app-whatsapp-chat-list-widget />

        <div class="hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl lg:flex lg:flex-col lg:items-center lg:justify-center">
          <p class="text-sm uppercase tracking-[0.3em] text-emerald-300">WhatsApp v2</p>
          <h1 class="mt-3 text-3xl font-semibold">Selecciona una conversación</h1>
          <p class="mt-4 max-w-md text-center text-slate-400">
            El widget del chat se conectará aquí en el siguiente paso.
          </p>
        </div>
      </section>
    </main>
  `
})
export class WhatsappPageComponent {}
