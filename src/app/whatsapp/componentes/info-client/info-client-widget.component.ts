import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { WhatsappMessageStoreService } from '../../services';
import { ClientInfoAclService, DynamicClient, GlobalSearchResult } from './client-info-acl.service';

// NOTA DE MANTENIMIENTO: estos servicios se reutilizan desde collection-management.
// Si cambia su contrato, endpoint, validaciones o modelo de respuesta, actualizar tambien
// este flujo de WhatsApp y su preparacion de adjuntos antes de modificarlo.
import { CartaCesionService } from '../../../core/services/carta-cesion.service';
import { CartaAcuerdoService } from '../../../core/services/carta-acuerdo.service';
import { AuthService } from '../../../core/services/auth.service';
import { ManagementService, PaymentScheduleRequest } from '../../../collection-management/services/management.service';
import { PaymentScheduleConfig } from '../../../maintenance/models/typification-v2.model';

type SearchMode = 'telefono' | 'documento';

interface OfferDisplay {
  field: string;
  label: string;
  value: number;
}

interface InstallmentEditor {
  numeroCuota: number;
  monto: number;
  fechaPago: string;
}

interface StoredOfferDraft {
  chatKey: string;
  documento: string;
  subPortfolioId: number;
  offerField: string;
  discount: number;
  transferFee: number;
  installmentCount: number;
  installments: InstallmentEditor[];
  expiresAt: number;
}

const PROMISE_TIPIFICATION_ID = 5;

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
           @if (!showOffers()) {
           <!-- ¿Tiene carta? -->
           <div class="mb-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
            <span class="text-sm font-medium text-slate-700">¿Tiene carta?</span>
            <span
              class="rounded-full px-2.5 py-0.5 text-xs font-bold"
              [class]="hasCarta() ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'"
            >{{ hasCarta() ? 'Sí' : 'No' }}</span>
            </div>
           }

           @if (cartaLoading()) {
             <p class="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">Buscando carta de cesión…</p>
           }
           @if (cartaError()) {
             <p class="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">{{ cartaError() }}</p>
           }
           @if (agreementLoading()) {
             <p class="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">Generando compromiso de pago…</p>
           }
           @if (agreementError()) {
             <p class="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">{{ agreementError() }}</p>
           }

            @if (!showOffers()) {
            <!-- Opciones del cliente -->
            <div class="space-y-2">
            @for (opt of options; track opt.key) {
              <button
                 type="button"
                 class="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                 [disabled]="cartaLoading() || agreementLoading()"
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
            } @else {
              <div class="mb-3 flex items-center gap-2">
                <button type="button" class="grid size-7 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Volver a opciones" (click)="backToOptions()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                </button>
                <span class="text-sm font-semibold text-slate-800">Deuda y ofertas</span>
              </div>
            }

            @if (showOffers()) {
             <section class="mt-4 border-t border-slate-200 pt-3">
               @if (!promiseInProcess()) {
               <div class="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-center text-rose-700 ring-1 ring-rose-100">
                 <p class="text-[10px] font-bold uppercase tracking-wide">Capital</p>
                 <p class="text-lg font-black">{{ formatCurrency(capitalValue()) }}</p>
                 <p class="text-xs font-semibold">{{ daysOverdue() }} días mora</p>
               </div>
               }
               @if (promiseInProcess()) {
                  <div class="rounded-lg bg-amber-50 px-3 py-3 text-center text-amber-800 ring-1 ring-amber-200">
                    <p class="text-sm font-bold">Promesa en proceso</p>
                    <p class="mt-1 text-xs">El cliente tiene una promesa pendiente o parcial.</p>
                    <button type="button" class="mt-3 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50" [disabled]="agreementLoading()" (click)="prepareAgreement()">Obtener compromiso de pago</button>
                  </div>
                } @else if (offersLoading()) {
                 <p class="py-4 text-center text-xs text-slate-500">Cargando ofertas…</p>
               } @else if (offersError()) {
                 <p class="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">{{ offersError() }}</p>
                } @else if (!offers().length) {
                  <p class="py-4 text-center text-xs text-slate-500">No hay ofertas configuradas para este cliente.</p>
                }
                @if (offers().length && !promiseInProcess()) {
                  <div class="mt-4 space-y-2">
                    <p class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Ofertas disponibles</p>
                    @for (offer of offers(); track offer.field) {
                      <button type="button" class="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition" [class]="selectedOffer()?.field === offer.field ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300'" (click)="selectOffer(offer)">
                        <span class="truncate font-medium">{{ offer.label }}</span>
                        <span class="shrink-0 font-bold">{{ formatCurrency(offer.value) }}</span>
                      </button>
                    }
                  </div>
                   @if (selectedOffer(); as offer) {
                     @if (!offerSent()) {
                       <div class="mt-4 px-1">
                       <p class="text-base font-bold text-slate-800">{{ offer.label }} · {{ formatCurrency(offer.value) }}</p>
                       <div class="mt-2 space-y-1.5">
                         <div class="flex items-center justify-between gap-3">
                           <label class="text-xs font-semibold text-slate-500">Descuento %</label>
                           <input type="number" min="0" max="100" step="1" class="w-20 rounded border border-slate-300 px-2 py-1.5 text-center text-sm font-bold" [ngModel]="discountPercent()" (ngModelChange)="setDiscount($event)" />
                         </div>
                         <div class="flex items-center justify-between gap-3">
                           <label class="text-xs font-semibold text-slate-500">Transferencia S/</label>
                           <input type="number" min="0" max="20" step="0.01" class="w-20 rounded border border-slate-300 px-2 py-1.5 text-center text-sm font-bold" [ngModel]="transferFee()" (ngModelChange)="setTransferFee($event)" />
                         </div>
                       </div>
                       <p class="mt-3 text-right text-base font-black text-emerald-700">Total: {{ formatCurrency(calculatedPromiseAmount()) }}</p>
                       <div class="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                         <span class="text-sm font-semibold text-slate-600">Número de cuotas</span>
                         <div class="flex items-center gap-1">
                           <button type="button" class="grid size-7 place-items-center rounded border border-slate-300 text-sm" [disabled]="installmentCount() <= 1" (click)="changeInstallmentCount(-1)">−</button>
                           <input type="number" min="1" max="20" class="w-14 rounded border border-slate-300 px-1 py-1 text-center text-sm font-bold" [ngModel]="installmentCount()" (ngModelChange)="setInstallmentCount($event)" />
                           <button type="button" class="grid size-7 place-items-center rounded border border-slate-300 text-sm" [disabled]="installmentCount() >= 20" (click)="changeInstallmentCount(1)">+</button>
                         </div>
                       </div>
                       <div class="mt-2 space-y-1.5">
                         @for (installment of installments(); track installment.numeroCuota) {
                           <div class="rounded bg-slate-50 px-2 py-2">
                             <div class="mb-1 text-xs font-bold text-slate-500">Cuota {{ installment.numeroCuota }}</div>
                             <div class="flex items-center gap-2">
                               <label class="w-12 text-xs text-slate-500">Monto</label>
                               <input type="number" min="0" step="0.01" class="min-w-0 flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm" [ngModel]="installment.monto" (ngModelChange)="updateInstallment(installment.numeroCuota, 'monto', $event)" />
                             </div>
                             <div class="mt-1.5 flex items-center gap-2">
                               <label class="w-12 text-xs text-slate-500">Fecha</label>
                               <input type="date" class="min-w-0 flex-1 rounded border border-slate-300 px-1 py-1.5 text-sm" [ngModel]="installment.fechaPago" (ngModelChange)="updateInstallment(installment.numeroCuota, 'fechaPago', $event)" />
                            </div>
                          </div>
                        }
                      </div>
                      @if (scheduleConfig()) {
                         <button type="button" class="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300" [disabled]="offering()" (click)="sendOffer()">{{ offering() ? 'Enviando oferta...' : 'Ofertar' }}</button>
                       }
                     </div>
                     } @else {
                       <div class="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                         <p class="text-xs font-bold text-emerald-800">Oferta enviada al cliente</p>
                         <p class="mt-1 text-xs text-emerald-700">{{ formatCurrency(calculatedPromiseAmount()) }} en {{ installmentCount() }} cuota{{ installmentCount() === 1 ? '' : 's' }}.</p>
                         <div class="mt-3 grid grid-cols-2 gap-2">
                           <button type="button" class="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50" (click)="editSentOffer()">Cambiar</button>
                           <button type="button" class="rounded-lg border border-rose-200 bg-white px-2 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50" (click)="cancelSentOffer()">Cancelar</button>
                         </div>
                         <button type="button" class="mt-2 w-full rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300" [disabled]="creatingPromise()" (click)="createPromise()">{{ creatingPromise() ? 'Generando...' : 'Generar promesa' }}</button>
                       </div>
                     }
                   }
                }
              </section>
           }
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
  readonly cartaLoading = signal(false);
  readonly cartaError = signal<string | null>(null);
  readonly agreementLoading = signal(false);
  readonly agreementError = signal<string | null>(null);
  readonly showOffers = signal(false);
  readonly offersLoading = signal(false);
  readonly offersError = signal<string | null>(null);
  readonly offers = signal<OfferDisplay[]>([]);
  readonly promiseInProcess = signal(false);
  readonly customAmount = signal(false);
  readonly scheduleConfig = signal<PaymentScheduleConfig | null>(null);
  readonly creatingPromise = signal(false);
  readonly offering = signal(false);
  readonly offerSent = signal(false);
  readonly selectedOffer = signal<OfferDisplay | null>(null);
  readonly discountPercent = signal<number>(0);
  readonly transferFee = signal<number>(0);
  readonly installmentCount = signal(1);
  readonly installments = signal<InstallmentEditor[]>([]);

  readonly modes: { value: SearchMode; label: string }[] = [
    { value: 'telefono', label: 'Número' },
    { value: 'documento', label: 'Documento' }
  ];

  /** Opciones del cliente. Sin función aún (lógica futura). */
  readonly options: { key: string; label: string }[] = [
    { key: 'compromiso-pago', label: 'Obtener compromiso de pago' },
    { key: 'carta-cesion', label: 'Obtener carta de cesión' },
    { key: 'deuda-ofertas', label: 'Ver deuda y ofertas' }
  ];

  readonly placeholder = computed(() =>
    this.mode() === 'documento' ? 'DNI / documento' : 'Número de teléfono');

  private lastChatKey?: string | number;
  private readonly offerStorageKey = 'whatsapp-offer-draft-v1';

  constructor(
    private readonly store: WhatsappMessageStoreService,
    private readonly acl: ClientInfoAclService,
    private readonly cartaCesion: CartaCesionService,
    private readonly cartaAcuerdo: CartaAcuerdoService,
    private readonly management: ManagementService,
    private readonly auth: AuthService
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
      this.showOffers.set(false);
      this.offers.set([]);
      this.offersError.set(null);
      this.promiseInProcess.set(false);
      this.scheduleConfig.set(null);
      this.selectedOffer.set(null);
      this.installments.set([]);
      this.offerSent.set(false);
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
    this.showOffers.set(false);
    this.offers.set([]);
    this.offersError.set(null);
    this.promiseInProcess.set(false);
    this.scheduleConfig.set(null);
    this.selectedOffer.set(null);
    this.installments.set([]);
    this.offerSent.set(false);
  }

  closeInfo(): void {
    this.selectedClient.set(null);
  }

  backToOptions(): void {
    this.showOffers.set(false);
    this.promiseInProcess.set(false);
    this.scheduleConfig.set(null);
    this.customAmount.set(false);
    this.selectedOffer.set(null);
    this.installments.set([]);
    this.offerSent.set(false);
  }

  runOption(key: string): void {
    if (key === 'compromiso-pago') {
      this.prepareAgreement();
      return;
    }
    if (key === 'deuda-ofertas') {
      this.loadOffers();
      return;
    }
    if (key !== 'carta-cesion') return;
    const result = this.selectedClient();
    const dni = result?.clientData.documento?.trim();
    if (!dni) return;

    this.cartaLoading.set(true);
    this.cartaError.set(null);
    this.cartaCesion.searchByDni(dni).subscribe({
      next: (response) => {
        this.hasCarta.set(true);
        this.cartaCesion.downloadPdf(response.filename).pipe(finalize(() => this.cartaLoading.set(false))).subscribe({
          next: (blob) => this.store.setPendingAttachment(new File([blob], response.filename, { type: 'application/pdf' })),
          error: () => this.cartaError.set('No se pudo cargar el PDF de la carta de cesión.')
        });
      },
      error: (error) => {
        this.cartaLoading.set(false);
        this.hasCarta.set(false);
        this.cartaError.set(error.status === 404 ? 'Este cliente no tiene carta de cesión.' : 'No se pudo buscar la carta de cesión.');
      }
    });
  }

  private loadOffers(): void {
    const result = this.selectedClient();
    if (!result?.subPortfolioId) {
      this.showOffers.set(true);
      this.offersError.set('El cliente no tiene subcartera configurada para consultar ofertas.');
      return;
    }

    this.showOffers.set(true);
    this.offersLoading.set(true);
    this.offersError.set(null);
    this.offers.set([]);
    this.promiseInProcess.set(false);
    this.scheduleConfig.set(null);
    this.customAmount.set(false);
    const documento = result.clientData.documento?.trim();
    this.management.getActiveSchedulesByDocumento(documento).subscribe({
      next: (schedules) => {
        const active = (schedules || []).some((schedule: any) => schedule.installments?.some((item: any) =>
          item.status === 'PENDIENTE' || item.status === 'PARCIAL'));
        if (active) {
          this.promiseInProcess.set(true);
          this.offersLoading.set(false);
          return;
        }
        this.loadConfiguredOffers(result);
      },
      error: () => this.loadConfiguredOffers(result)
    });
  }

  private loadConfiguredOffers(result: GlobalSearchResult): void {
    this.management.getMontoCabeceras(result.subPortfolioId!).pipe(finalize(() => this.offersLoading.set(false))).subscribe({
      next: (headers) => {
        const raw = result.clientData;
        const offers = (headers || [])
          .filter((header: any) =>
            (header.esVisibleMonto === 1 || header.esVisibleMonto === undefined || header.esVisibleMonto === null) &&
            !this.isOfferExcluded(header.codigo))
          .map((header: any) => {
            const key = Object.keys(raw).find(rawKey => rawKey.toLowerCase() === String(header.codigo).toLowerCase());
            const value = key ? Number(raw[key]) : Number.NaN;
            return { field: String(header.codigo), label: header.nombre || this.formatFieldLabel(header.codigo), value };
          })
          .filter((offer: OfferDisplay) => Number.isFinite(offer.value) && offer.value > 0);
    this.offers.set(offers);
        this.restoreOfferDraft(result);
      },
      error: () => this.offersError.set('No se pudieron consultar las ofertas del cliente.')
    });
  }

  selectOffer(offer: OfferDisplay): void {
    this.selectedOffer.set(offer);
    this.discountPercent.set(0);
    this.transferFee.set(0);
    this.customAmount.set(false);
    this.installmentCount.set(1);
    this.rebuildInstallments();
    this.persistOfferDraft();
  }

  setDiscount(value: number | string): void {
    const numeric = Number(value);
    this.discountPercent.set(Number.isFinite(numeric) && numeric >= 0 ? Math.min(100, numeric) : 0);
    this.customAmount.set(this.discountPercent() > 0 || this.transferFee() > 0);
    this.rebuildInstallments();
    this.persistOfferDraft();
  }

  setTransferFee(value: number | string): void {
    const numeric = Number(value);
    this.transferFee.set(Number.isFinite(numeric) && numeric >= 0 ? Math.min(20, numeric) : 0);
    this.customAmount.set(this.discountPercent() > 0 || this.transferFee() > 0);
    this.rebuildInstallments();
    this.persistOfferDraft();
  }

  calculatedPromiseAmount(): number {
    const offer = this.selectedOffer();
    const discount = this.discountPercent();
    if (!offer) return 0;
    return Math.round((offer.value * (1 - discount / 100) + this.transferFee()) * 100) / 100;
  }

  setInstallmentCount(value: number | string): void {
    const count = Math.max(1, Math.min(20, Math.floor(Number(value) || 1)));
    this.installmentCount.set(count);
    this.rebuildInstallments();
    this.persistOfferDraft();
  }

  changeInstallmentCount(delta: number): void {
    this.setInstallmentCount(this.installmentCount() + delta);
  }

  updateInstallment(numeroCuota: number, field: 'monto' | 'fechaPago', value: number | string): void {
    this.installments.update(items => items.map(item => item.numeroCuota === numeroCuota
      ? { ...item, [field]: field === 'monto' ? Number(value) || 0 : String(value) }
      : item));
    this.refreshScheduleConfig();
    this.persistOfferDraft();
  }

  private rebuildInstallments(): void {
    const count = this.installmentCount();
    const amount = this.calculatedPromiseAmount();
    const perInstallment = Math.round((amount / count) * 100) / 100;
    const today = new Date();
    this.installments.set(Array.from({ length: count }, (_, index) => {
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + ((index + 1) * 30));
      return {
        numeroCuota: index + 1,
        monto: index === count - 1 ? Math.round((amount - (perInstallment * (count - 1))) * 100) / 100 : perInstallment,
        fechaPago: dueDate.toISOString().slice(0, 10)
      };
    }));
    this.refreshScheduleConfig();
  }

  private refreshScheduleConfig(): void {
    const offer = this.selectedOffer();
    if (!offer || !this.installments().length) {
      this.scheduleConfig.set(null);
      return;
    }
    this.scheduleConfig.set({
      montoTotal: this.installments().reduce((sum, item) => sum + item.monto, 0),
      numeroCuotas: this.installments().length,
      cuotas: this.installments(),
      campoMontoOrigen: offer.field,
      montoBase: offer.value,
      generaCartaAcuerdo: !this.customAmount()
    });
  }

  sendOffer(): void {
    const chat = this.chat();
    const result = this.selectedClient();
    const config = this.scheduleConfig();
    if (!chat?.id || !result || !config || this.offering()) return;

    this.offering.set(true);
    this.store.sendText(chat.id, this.buildOfferSummary(config));
    this.offerSent.set(true);
    this.persistOfferDraft();
    this.offering.set(false);
  }

  editSentOffer(): void {
    this.offerSent.set(false);
    this.persistOfferDraft();
  }

  cancelSentOffer(): void {
    this.offerSent.set(false);
    this.selectedOffer.set(null);
    this.scheduleConfig.set(null);
    this.installments.set([]);
    this.discountPercent.set(0);
    this.transferFee.set(0);
    this.customAmount.set(false);
    this.clearStoredOfferDraft();
  }

  private buildOfferSummary(config: PaymentScheduleConfig): string {
    const rows = config.cuotas.map(cuota => `Cuota ${cuota.numeroCuota}: ${this.formatCurrency(cuota.monto)} - ${cuota.fechaPago}`).join('\n');
    return `Oferta de pago\nTotal: ${this.formatCurrency(config.montoTotal)}\n${rows}\n\n¿Está de acuerdo? Responda SI o NO.`;
  }

  private persistOfferDraft(): void {
    const chat = this.chat();
    const result = this.selectedClient();
    const offer = this.selectedOffer();
    if (!chat || !result || !offer || !this.installments().length) return;
    const draft: StoredOfferDraft = {
      chatKey: String(chat.id ?? chat.jid),
      documento: result.clientData.documento,
      subPortfolioId: result.subPortfolioId,
      offerField: offer.field,
      discount: this.discountPercent(),
      transferFee: this.transferFee(),
      installmentCount: this.installmentCount(),
      installments: this.installments(),
      expiresAt: Date.now() + 10 * 60 * 1000
    };
    localStorage.setItem(this.offerStorageKey, JSON.stringify(draft));
  }

  private restoreOfferDraft(result: GlobalSearchResult): void {
    try {
      const raw = localStorage.getItem(this.offerStorageKey);
      if (!raw) return;
      const draft = JSON.parse(raw) as StoredOfferDraft;
      const chat = this.chat();
      const matches = chat && draft.chatKey === String(chat.id ?? chat.jid)
        && draft.documento === result.clientData.documento
        && draft.subPortfolioId === result.subPortfolioId
        && draft.expiresAt > Date.now();
      if (!matches) {
        if (draft.expiresAt <= Date.now()) this.clearStoredOfferDraft();
        return;
      }
      const offer = this.offers().find(item => item.field === draft.offerField);
      if (!offer) return;
      this.selectedOffer.set(offer);
      this.discountPercent.set(draft.discount);
      this.transferFee.set(draft.transferFee);
      this.installmentCount.set(Math.max(1, Math.min(20, draft.installmentCount)));
      this.installments.set(draft.installments);
      this.customAmount.set(draft.discount > 0 || draft.transferFee > 0);
      this.refreshScheduleConfig();
      this.offerSent.set(true);
    } catch {
      this.clearStoredOfferDraft();
    }
  }

  private clearStoredOfferDraft(): void {
    localStorage.removeItem(this.offerStorageKey);
  }

  createPromise(): void {
    const result = this.selectedClient();
    const config = this.scheduleConfig();
    const chat = this.chat();
    const user = this.auth.getCurrentUser();
    const clientId = Number(result?.clientData.id);
    if (!result || !config || !chat?.id || !clientId || !user?.id) {
      this.agreementError.set('Faltan datos para generar la promesa de pago.');
      return;
    }

    this.creatingPromise.set(true);
    this.agreementError.set(null);
    const request: PaymentScheduleRequest = {
      idCliente: clientId,
      nombreCliente: this.clientName(result.clientData),
      documentoCliente: result.clientData.documento,
      idAgente: Number(user.id),
      idTenant: result.tenantId,
      idCartera: result.portfolioId,
      idSubcartera: result.subPortfolioId,
      // PP / PROMESA DE PAGO. El backend calcula las rutas de tipificación.
      idTipificacion: PROMISE_TIPIFICATION_ID,
      metodoContacto: 'GESTION_MANUAL',
      canalContacto: 'WHATSAPP',
      campoMontoOrigen: config.campoMontoOrigen,
      montoBase: config.montoBase,
      porcentajeAutoAprobacion: config.porcentajeAutoAprobacion,
      porcentajeAutoAprobacionAumento: config.porcentajeAutoAprobacionAumento,
      porcentajeMaximoPromesa: config.porcentajeMaximoPromesa,
      observaciones: this.customAmount() ? 'Excepción generada desde WhatsApp; requiere aprobación.' : 'Promesa generada desde WhatsApp.',
      schedule: {
        montoTotal: config.montoTotal,
        numeroCuotas: config.numeroCuotas,
        cuotas: config.cuotas,
        generaCartaAcuerdo: !this.customAmount(),
        porcentajeAutoAprobacion: config.porcentajeAutoAprobacion,
        porcentajeAutoAprobacionAumento: config.porcentajeAutoAprobacionAumento,
        porcentajeMaximoPromesa: config.porcentajeMaximoPromesa
      }
    };

    this.management.createPaymentSchedule(request).pipe(finalize(() => this.creatingPromise.set(false))).subscribe({
      next: (created: any) => {
        this.clearStoredOfferDraft();
        this.offerSent.set(false);
        if (this.customAmount()) {
          this.agreementError.set('Promesa creada y enviada a evaluación. Espera la aprobación antes de enviar el compromiso.');
          return;
        }

        const managementId = Number(created?.id || created?.managementId || created?.data?.id);
        if (!managementId) {
          this.agreementError.set('La promesa se creó, pero no se pudo generar el acuerdo automáticamente.');
          return;
        }
        this.agreementLoading.set(true);
        this.cartaAcuerdo.generarCarta(managementId, Number(user.id)).pipe(finalize(() => this.agreementLoading.set(false))).subscribe({
          next: (blob) => this.store.setPendingAttachment(new File([blob], `CARTA_ACUERDO_${result.clientData.documento}.pdf`, { type: 'application/pdf' })),
          error: () => this.agreementError.set('La promesa se creó, pero no se pudo generar el acuerdo.')
        });
      },
      error: () => this.agreementError.set('No se pudo crear la promesa de pago.')
    });
  }

  private buildPromiseSummary(config: PaymentScheduleConfig, exception: boolean): string {
    const rows = config.cuotas.map(cuota => `Cuota ${cuota.numeroCuota}: ${this.formatCurrency(cuota.monto)} - ${cuota.fechaPago}`).join('\n');
    return `${exception ? 'Solicitud de promesa de pago' : 'Resumen de promesa de pago'}\nTotal: ${this.formatCurrency(config.montoTotal)}\n${rows}\n\n${exception ? 'La solicitud queda pendiente de aprobación.' : '¿Está de acuerdo? Responda SI o NO.'}`;
  }

  capitalValue(): number {
    return this.rawNumber(['capital', 'sld_capital_asig', 'sld_capital', 'saldo_capital']);
  }

  daysOverdue(): number {
    return this.rawNumber(['dias_mora', 'dias_mora_asig']);
  }

  formatCurrency(value: number): string {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private rawNumber(keys: string[]): number {
    const raw: Record<string, any> = this.selectedClient()?.clientData || {};
    const key = Object.keys(raw).find(rawKey => keys.includes(rawKey.toLowerCase()));
    const value = key ? Number(raw[key]) : 0;
    return Number.isFinite(value) ? value : 0;
  }

  private isOfferExcluded(field: string): boolean {
    return new Set([
      'documento', 'identity_code', 'num_cuenta_ori', 'num_cuenta', 'numero_cuenta', 'num_cuenta_pmcp',
      'dias_mora', 'dias_mora_asig', 'periodo_castigo', 'rango_mora', 'rango_mora_asig', 'rango_mora_proy'
    ]).has(String(field).toLowerCase());
  }

  private formatFieldLabel(field: string): string {
    return String(field).replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
  }

  prepareAgreement(): void {
    const result = this.selectedClient();
    const documento = result?.clientData.documento?.trim();
    const user = this.auth.getCurrentUser();
    if (!documento) return;
    if (!user?.id) {
      this.agreementError.set('No se encontró el usuario autenticado.');
      return;
    }

    this.agreementLoading.set(true);
    this.agreementError.set(null);
    this.management.getActiveSchedulesByDocumento(documento).subscribe({
      next: (schedules) => {
        const valid = (schedules || [])
          .filter((schedule: any) => schedule.installments?.some((item: any) =>
            item.status === 'PENDIENTE' || item.status === 'PARCIAL'))
          .sort((a: any, b: any) => Number(a.id) - Number(b.id));
        const schedule = valid[0];
        if (!schedule) {
          this.agreementLoading.set(false);
          this.agreementError.set('Este cliente no tiene un compromiso de pago activo.');
          return;
        }

        const subPortfolioId = result?.subPortfolioId;
        if (!subPortfolioId) {
          this.agreementLoading.set(false);
          this.agreementError.set('El cliente no tiene subcartera configurada para generar el acuerdo.');
          return;
        }

        this.cartaAcuerdo.tienePlantillaSubcartera(subPortfolioId).subscribe({
          next: (hasTemplate) => {
            if (!hasTemplate) {
              this.agreementLoading.set(false);
              this.agreementError.set('No hay una plantilla de acuerdo configurada para esta subcartera.');
              return;
            }
            this.cartaAcuerdo.generarCarta(Number(schedule.id), Number(user.id)).pipe(finalize(() => this.agreementLoading.set(false))).subscribe({
              next: (blob) => this.store.setPendingAttachment(new File([blob], `CARTA_ACUERDO_${documento}.pdf`, { type: 'application/pdf' })),
              error: () => this.agreementError.set('No se pudo generar el compromiso de pago.')
            });
          },
          error: () => {
            this.agreementLoading.set(false);
            this.agreementError.set('No se pudo validar la plantilla del acuerdo.');
          }
        });
      },
      error: () => {
        this.agreementLoading.set(false);
        this.agreementError.set('No se pudo consultar el compromiso de pago.');
      }
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

  clientName(c: DynamicClient): string {
    const completeName = c['nombre_completo'] || c['nombreCompleto'] || c['fullName'];
    if (typeof completeName === 'string' && completeName.trim()) return completeName.trim();
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
    this.cartaError.set(null);
    this.agreementError.set(null);
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
