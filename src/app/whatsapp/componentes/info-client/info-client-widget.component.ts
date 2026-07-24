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
      } @else if (selectedClient(); as sel) {
        <!-- ===== Opciones del cliente ===== -->
        <div class="flex items-center gap-2 border-b border-slate-200 px-3 py-2.5">
          <button
            type="button"
            class="grid size-7 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Volver"
            (click)="closeInfo()"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </button>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-slate-900">{{ clientName(sel.clientData) }}</p>
            <p class="truncate text-xs text-slate-500">Doc: {{ sel.clientData.documento }}</p>
          </div>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto p-3">
          <!-- ¿Tiene carta? -->
          <div class="mb-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
            <span class="text-sm font-medium text-slate-700">¿Tiene carta?</span>
            <span
              class="rounded-full px-2.5 py-0.5 text-xs font-bold"
              [class]="hasCarta() ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'"
            >{{ hasCarta() ? 'Sí' : 'No' }}</span>
          </div>

          <!-- Opciones (sin función por ahora) -->
          <div class="space-y-2">
            @for (opt of options; track opt.key) {
              <button
                type="button"
                class="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800"
                (click)="runOption(opt.key)"
              >
                <span class="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500">
                  @switch (opt.key) {
                    @case ('compromiso-pago') {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                    }
                    @case ('deuda-ofertas') {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                    }
                    @default {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                    }
                  }
                </span>
                <span class="min-w-0 flex-1">{{ opt.label }}</span>
                <svg class="shrink-0 text-slate-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            }
          </div>
        </div>
      } @else {
        <!-- ===== Búsqueda + lista ===== -->
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
                type="search"
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

        <div class="min-h-0 flex-1 overflow-y-auto bg-white">
          @if (results().length) {
            <ul class="divide-y divide-slate-100">
              @for (r of results(); track trackResult(r)) {
                <li
                  class="cursor-pointer px-4 py-3 transition hover:bg-emerald-50/70"
                  role="button"
                  tabindex="0"
                  (click)="openInfo(r)"
                  (keyup.enter)="openInfo(r)"
                >
                  <p class="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-400">{{ r.nombreCartera }} · {{ r.nombreSubcartera }}</p>
                  <p class="mt-1 truncate text-sm font-bold leading-5 text-slate-950" [title]="clientName(r.clientData)">{{ clientName(r.clientData) }}</p>
                  <div class="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                    <span>Doc: {{ r.clientData.documento }}</span>
                    @if (r.clientData.dias_mora != null) {
                      <span class="text-slate-300">•</span>
                      <span>Mora: {{ r.clientData.dias_mora }} días</span>
                    }
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

  readonly selectedClient = signal<GlobalSearchResult | null>(null);
  readonly hasCarta = signal(false);

  readonly modes: { value: SearchMode; label: string }[] = [
    { value: 'telefono', label: 'Número' },
    { value: 'documento', label: 'Documento' }
  ];

  /** Opciones del cliente. Sin función aún (lógica futura). */
  readonly options: { key: string; label: string }[] = [
    { key: 'carta-no-adeudo', label: 'Obtener carta no adeudo' },
    { key: 'compromiso-pago', label: 'Obtener compromiso de pago' },
    { key: 'carta-cesion', label: 'Obtener carta de cesión' },
    { key: 'deuda-ofertas', label: 'Ver deuda y ofertas' }
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
      this.selectedClient.set(null);
      if (!chat) return;

      const phone = this.acl.phoneKey(chat.contactPhone);
      if (phone.length < 7) {
        this.manualOpen.set(true); // sin teléfono usable → búsqueda manual
        return;
      }
      this.autoSearchByPhone(phone, key);
    });
  }

  openInfo(result: GlobalSearchResult): void {
    this.selectedClient.set(result);
    this.refreshHasCarta(result);
  }

  closeInfo(): void {
    this.selectedClient.set(null);
  }

  /** Acción de cada opción. Sin función aún (lógica futura). */
  runOption(_key: string): void {
    // TODO: implementar carta no adeudo / compromiso de pago / carta de cesión / deuda y ofertas.
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

  /**
   * ¿El cliente tiene carta? Fallback: No. Cuando exista el endpoint, se consulta
   * aquí (por documento/contexto) y se hace this.hasCarta.set(...).
   */
  private refreshHasCarta(_result: GlobalSearchResult): void {
    this.hasCarta.set(false);
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
