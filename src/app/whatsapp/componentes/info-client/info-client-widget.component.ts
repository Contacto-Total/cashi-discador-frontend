import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { WhatsappMessageStoreService } from '../../services';
import { ClientInfoAclService, DynamicClient, GlobalSearchResult } from './client-info-acl.service';

type SearchMode = 'telefono' | 'documento';

@Component({
  selector: 'app-whatsapp-info-client-widget',
  standalone: true,
  imports: [FormsModule],
  template: `
    <aside class="flex h-full min-h-0 flex-col overflow-hidden border-l border-slate-200 bg-white text-slate-950">
      <header class="border-b border-slate-200 px-4 py-3">
        <h3 class="text-sm font-semibold text-slate-900">Información del cliente</h3>
        @if (chat(); as c) {
          <p class="truncate text-xs text-slate-500">{{ c.name }} · {{ c.contactPhone || '—' }}</p>
        } @else {
          <p class="text-xs text-slate-500">Selecciona un chat</p>
        }
      </header>

      @if (!chat()) {
        <p class="mt-8 text-center text-sm text-slate-400">Sin chat seleccionado.</p>
      } @else if (loading()) {
        <p class="mt-8 text-center text-sm text-slate-500">Buscando cliente…</p>
      } @else {
        <!-- Búsqueda arriba -->
        <div class="border-b border-slate-200 px-3 py-2.5">
          @if (manualOpen() || !results().length) {
            <div class="flex gap-1 rounded-full bg-slate-100 p-0.5 text-xs font-medium">
              @for (m of modes; track m.value) {
                <button
                  type="button"
                  class="flex-1 rounded-full px-2 py-1 transition"
                  [class]="mode() === m.value ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                  (click)="setMode(m.value)"
                >{{ m.label }}</button>
              }
            </div>
            <form class="mt-2 flex gap-2" (ngSubmit)="runManualSearch()">
              <input
                class="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                [type]="'search'"
                [placeholder]="placeholder()"
                [ngModel]="query()"
                name="clientQuery"
                (ngModelChange)="query.set($event)"
              />
              <button
                type="submit"
                class="shrink-0 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
                [disabled]="searching() || !query().trim()"
              >
                @if (searching()) { … } @else { Buscar }
              </button>
            </form>
            @if (error()) {
              <p class="mt-1.5 text-xs font-medium text-rose-600">{{ error() }}</p>
            }
          } @else {
            <button
              type="button"
              class="w-full rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700"
              (click)="manualOpen.set(true)"
            >Buscar otro cliente</button>
          }
        </div>

        <!-- Resultados compactos -->
        <div class="min-h-0 flex-1 overflow-y-auto">
          @if (results().length) {
            <ul class="divide-y divide-slate-100">
              @for (r of results(); track trackResult(r)) {
                <li class="px-3 py-2.5">
                  <div class="flex items-start justify-between gap-2">
                    <p class="min-w-0 truncate text-sm font-semibold text-slate-900">{{ clientName(r.clientData) }}</p>
                    <button
                      type="button"
                      class="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      (click)="openInfo(r)"
                    >Información</button>
                  </div>
                  <div class="mt-1 space-y-0.5 text-xs leading-tight">
                    <p class="text-slate-700"><span class="text-slate-400">Doc:</span> {{ r.clientData.documento }}</p>
                    @if (phones(r.clientData).length) {
                      <p class="text-slate-700"><span class="text-slate-400">Tel:</span> {{ phones(r.clientData).join(', ') }}</p>
                    }
                    @if (r.clientData.deuda_capital != null) {
                      <p class="text-slate-700"><span class="text-slate-400">Deuda:</span> {{ r.clientData.deuda_capital }}</p>
                    }
                    @if (r.clientData.dias_mora != null) {
                      <p class="text-slate-700"><span class="text-slate-400">Días mora:</span> {{ r.clientData.dias_mora }}</p>
                    }
                    <p class="truncate text-slate-400">{{ r.nombreCartera }} · {{ r.nombreSubcartera }}</p>
                  </div>
                </li>
              }
            </ul>
          } @else if (!manualOpen()) {
            <p class="mt-8 text-center text-sm text-slate-400">Sin coincidencias.</p>
          }
        </div>
      }
    </aside>
  `
})
export class InfoClientWidgetComponent {
  readonly chat = computed(() => this.store.currentChat());

  readonly loading = signal(false);
  readonly results = signal<GlobalSearchResult[]>([]);
  readonly manualOpen = signal(false);
  readonly mode = signal<SearchMode>('telefono');
  readonly query = signal('');
  readonly searching = signal(false);
  readonly error = signal<string | null>(null);

  readonly modes: { value: SearchMode; label: string }[] = [
    { value: 'telefono', label: 'Número' },
    { value: 'documento', label: 'Documento' }
  ];

  readonly placeholder = computed(() =>
    this.mode() === 'documento' ? 'DNI / documento' : 'Número de teléfono');

  private lastChatKey?: string | number;

  constructor(
    private readonly store: WhatsappMessageStoreService,
    private readonly acl: ClientInfoAclService
  ) {
    // Al entrar a un chat, buscamos por el número del chat (últimos 9 dígitos).
    effect(() => {
      const chat = this.chat();
      const key = chat ? (chat.id ?? chat.jid) : undefined;
      if (key === this.lastChatKey) return;
      this.lastChatKey = key;

      this.results.set([]);
      this.error.set(null);
      this.query.set('');
      this.manualOpen.set(false);
      this.mode.set('telefono');
      if (!chat) return;

      const phone = this.acl.phoneKey(chat.contactPhone);
      if (phone.length < 7) {
        this.manualOpen.set(true); // sin teléfono usable → búsqueda manual
        return;
      }
      this.autoSearchByPhone(phone, key);
    });
  }

  setMode(mode: SearchMode): void {
    this.mode.set(mode);
    this.query.set('');
    this.error.set(null);
  }

  runManualSearch(): void {
    const value = this.query().trim();
    if (!value) return;

    this.searching.set(true);
    this.error.set(null);

    const obs = this.mode() === 'documento'
      ? this.acl.searchByDocument(value)
      : this.acl.searchByPhone(this.acl.phoneKey(value));

    obs.pipe(finalize(() => this.searching.set(false))).subscribe({
      next: (list) => {
        const clean = this.clean(list);
        this.results.set(clean);
        if (!clean.length) this.error.set('Sin resultados.');
      },
      error: () => this.error.set('Error al buscar el cliente.')
    });
  }

  /** Botón "Información" por cliente. Sin función aún (lógica futura). */
  openInfo(_result: GlobalSearchResult): void {
    // TODO: acción de información del cliente.
  }

  clientName(c: DynamicClient): string {
    if (c.nombre?.trim()) return c.nombre;
    const parts = [c.nombres, c.apellidos].map((p) => p?.trim()).filter(Boolean);
    return parts.length ? parts.join(' ') : 'Sin nombre';
  }

  phones(c: DynamicClient): string[] {
    return [c.telefono, c.telefono_1, c.telefono_2, c.telefono_3]
      .map((t) => (t ? String(t).trim() : ''))
      .filter((t) => !!t);
  }

  trackResult(r: GlobalSearchResult): string {
    return `${r.clientData?.documento}-${r.subPortfolioId}`;
  }

  private autoSearchByPhone(phone: string, key: string | number | undefined): void {
    this.loading.set(true);
    this.acl.searchByPhone(phone)
      .pipe(finalize(() => { if (this.lastChatKey === key) this.loading.set(false); }))
      .subscribe({
        next: (list) => {
          if (this.lastChatKey !== key) return; // cambió de chat: descartar respuesta vieja
          const clean = this.clean(list);
          this.results.set(clean);
          this.manualOpen.set(clean.length === 0);
        },
        error: () => {
          if (this.lastChatKey !== key) return;
          this.results.set([]);
          this.manualOpen.set(true);
        }
      });
  }

  private clean(list: GlobalSearchResult[] | null): GlobalSearchResult[] {
    return (list || []).filter((r) => r && r.clientData && r.clientData.documento);
  }
}
