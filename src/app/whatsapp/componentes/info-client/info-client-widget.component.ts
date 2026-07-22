import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, map } from 'rxjs';
import { WhatsappMessageStoreService } from '../../services';
import { ClientInfoAclService, DynamicClient, GlobalSearchResult } from './client-info-acl.service';

type SearchMode = 'telefono' | 'documento' | 'nombre';

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

      <div class="min-h-0 flex-1 overflow-y-auto p-3">
        @if (!chat()) {
          <p class="mt-8 text-center text-sm text-slate-400">Sin chat seleccionado.</p>
        } @else if (loading()) {
          <p class="mt-8 text-center text-sm text-slate-500">Buscando cliente…</p>
        } @else {
          @if (results().length) {
            <div class="space-y-3">
              @for (r of results(); track trackResult(r)) {
                <article class="rounded-lg border border-slate-200 p-3">
                  <div class="flex items-start justify-between gap-2">
                    <p class="text-sm font-semibold text-slate-900">{{ clientName(r.clientData) }}</p>
                    <span class="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{{ r.clientData.documento }}</span>
                  </div>
                  <p class="mt-0.5 truncate text-xs text-slate-500">{{ r.nombreCartera }} · {{ r.nombreSubcartera }}</p>
                  <dl class="mt-2 space-y-1 text-xs">
                    @if (phones(r.clientData).length) {
                      <div class="flex gap-2">
                        <dt class="w-20 shrink-0 text-slate-400">Teléfonos</dt>
                        <dd class="text-slate-700">{{ phones(r.clientData).join(', ') }}</dd>
                      </div>
                    }
                    @if (r.clientData.deuda_capital != null) {
                      <div class="flex gap-2">
                        <dt class="w-20 shrink-0 text-slate-400">Deuda</dt>
                        <dd class="text-slate-700">{{ r.clientData.deuda_capital }}</dd>
                      </div>
                    }
                    @if (r.clientData.dias_mora != null) {
                      <div class="flex gap-2">
                        <dt class="w-20 shrink-0 text-slate-400">Días mora</dt>
                        <dd class="text-slate-700">{{ r.clientData.dias_mora }}</dd>
                      </div>
                    }
                    @if (r.nombreInquilino) {
                      <div class="flex gap-2">
                        <dt class="w-20 shrink-0 text-slate-400">Inquilino</dt>
                        <dd class="truncate text-slate-700">{{ r.nombreInquilino }}</dd>
                      </div>
                    }
                  </dl>
                </article>
              }
            </div>
          }

          @if (manualOpen() || !results().length) {
            <div class="mt-3 rounded-lg border border-slate-200 p-3">
              @if (!results().length) {
                <p class="mb-2 text-xs text-slate-500">Sin coincidencias por el número del chat. Busca manualmente:</p>
              }
              <div class="flex gap-1 rounded-lg bg-slate-100 p-1 text-xs font-medium">
                @for (m of modes; track m.value) {
                  <button
                    type="button"
                    class="flex-1 rounded-md px-2 py-1 transition"
                    [class]="mode() === m.value ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                    (click)="setMode(m.value)"
                  >{{ m.label }}</button>
                }
              </div>
              <form class="mt-2 flex gap-2" (ngSubmit)="runManualSearch()">
                <input
                  class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  [type]="mode() === 'nombre' ? 'text' : 'search'"
                  [placeholder]="placeholder()"
                  [ngModel]="query()"
                  name="clientQuery"
                  (ngModelChange)="query.set($event)"
                />
                <button
                  type="submit"
                  class="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
                  [disabled]="searching() || !query().trim()"
                >
                  @if (searching()) { … } @else { Buscar }
                </button>
              </form>
              @if (error()) {
                <p class="mt-2 text-xs font-medium text-rose-600">{{ error() }}</p>
              }
            </div>
          } @else {
            <button
              type="button"
              class="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700"
              (click)="manualOpen.set(true)"
            >Buscar otro cliente</button>
          }
        }
      </div>
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
    { value: 'documento', label: 'Documento' },
    { value: 'nombre', label: 'Nombre' }
  ];

  readonly placeholder = computed(() =>
    this.mode() === 'documento' ? 'DNI / documento'
      : this.mode() === 'nombre' ? 'Nombre o apellido'
        : 'Número de teléfono');

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
    const mode = this.mode();

    this.searching.set(true);
    this.error.set(null);

    const obs = mode === 'documento'
      ? this.acl.searchByDocument(value)
      : mode === 'nombre'
        ? this.acl.searchByName(value).pipe(map((resp) => resp.data || []))
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
