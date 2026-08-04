import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { interval, Subscription, startWith, switchMap } from 'rxjs';
import { WhatsappApiService } from '../../../services/whatsapp-api.service';
import { AccountStatusEvent, WhatsappAccount } from '../../../models';
import { WhatsappRealtimeService } from '../../../services/whatsapp-realtime.service';
import { TenantService } from '../../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../../maintenance/models/portfolio.model';
import { ChatListWidgetComponent } from '../../widgets/chat-list-widget/chat-list-widget.component';
import { ChatWidgetComponent } from '../../widgets/chat-widget/chat-widget.component';
import { WhatsappMessageStoreService } from '../../../services/whatsapp-message-store.service';

@Component({
  selector: 'app-whatsapp-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink, ChatListWidgetComponent, ChatWidgetComponent],
  templateUrl: './whatsapp-dashboard.component.html',
  styleUrls: ['./whatsapp-dashboard.component.css']
})
export class WhatsappDashboardComponent implements OnInit, OnDestroy {
  accounts: WhatsappAccount[] = [];
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];
  selectedId: number | null = null;
  loading = true;
  saving = false;
  activationSaving = false;
  changingNumber = false;
  loadingTenants = false;
  loadingPortfolios = false;
  loadingSubPortfolios = false;
  error = '';
  feedback = '';

  form = {
    tenantId: 0,
    carteraId: 0,
    subcarteraId: 0,
    active: false
  };

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly whatsappApi: WhatsappApiService,
    private readonly realtime: WhatsappRealtimeService,
    private readonly messageStore: WhatsappMessageStoreService,
    private readonly tenantService: TenantService,
    private readonly portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.loadTenants();
    this.messageStore.connectRealtime();

    this.subscriptions.add(
      interval(15000).pipe(
        startWith(0),
        switchMap(() => this.whatsappApi.getWhatsappAccounts())
      ).subscribe({
         next: accounts => {
           this.accounts = this.currentAccounts(accounts);
           accounts = this.accounts;
          this.loading = false;
          this.error = '';
            if (this.selectedId === null && accounts.length > 0) {
              this.selectAccount(accounts[0]);
            } else if (this.selectedId !== null) {
              const current = accounts.find(account => account.id === this.selectedId);
              if (current) this.syncForm(current);
              else if (accounts.length > 0) this.selectAccount(accounts[0]);
              else this.selectedId = null;
          }
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudieron cargar los servicios de WhatsApp.';
        }
      })
    );

    this.subscriptions.add(
      this.realtime.connect().subscribe(event => {
        if (event.type === 'STATUS') this.applyStatusEvent(event.payload as AccountStatusEvent);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.messageStore.stopViewingCurrentChat();
    this.messageStore.disconnectRealtime();
    this.realtime.disconnect();
  }

  get selectedAccount(): WhatsappAccount | undefined {
    return this.accounts.find(account => account.id === this.selectedId);
  }

  get linkedAccounts(): number {
    return this.accounts.filter(account => this.isLinked(account)).length;
  }

  get activeAccounts(): number {
    return this.accounts.filter(account => account.active === true).length;
  }

  get connectedAccounts(): number {
    return this.accounts.filter(account => account.status === 'CONNECTED').length;
  }

  get waitingQrAccounts(): number {
    return this.accounts.filter(account => account.status === 'WAITING_QR').length;
  }

  selectAccount(account: WhatsappAccount): void {
    this.selectedId = account.id;
    this.syncForm(account);
    this.messageStore.setAccountFilter(account.id, false);
    this.feedback = '';
  }

  onTenantChange(tenantId: number): void {
    this.form.tenantId = Number(tenantId) || 0;
    this.form.carteraId = 0;
    this.form.subcarteraId = 0;
    this.portfolios = [];
    this.subPortfolios = [];
    this.feedback = '';
    if (this.form.tenantId > 0) this.loadPortfolios(this.form.tenantId);
  }

  onPortfolioChange(portfolioId: number): void {
    this.form.carteraId = Number(portfolioId) || 0;
    this.form.subcarteraId = 0;
    this.subPortfolios = [];
    this.feedback = '';
    if (this.form.carteraId > 0) this.loadSubPortfolios(this.form.carteraId);
  }

  onSubPortfolioChange(subPortfolioId: number): void {
    this.form.subcarteraId = Number(subPortfolioId) || 0;
    this.feedback = '';
  }

  isLinked(account: WhatsappAccount): boolean {
    if (account.status === 'WAITING_QR' || account.status === 'LOGGED_OUT') return false;
    return account.hasLinkedNumber === true || !!account.phoneNumber;
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      CONNECTED: 'Conectado',
      WAITING_QR: 'Esperando QR',
      DISCONNECTED: 'Desconectado',
      LOGGED_OUT: 'Sesión cerrada',
      BANNED: 'Bloqueado',
      UNREACHABLE: 'Sin respuesta'
    };
    return labels[status] || status || 'Sin estado';
  }

  statusClass(status: string): string {
    return status.toLowerCase().replace(/_/g, '-');
  }

  qrSource(account: WhatsappAccount): string {
    return account.qrData ? `data:image/png;base64,${account.qrData}` : '';
  }

  tenantLabel(account: WhatsappAccount): string {
    const tenantId = Number(account.tenantId) || 0;
    const tenant = this.tenants.find(item => item.id === tenantId);
    return tenant ? `${tenant.tenantCode} - ${tenant.tenantName}` : (account.tenantId?.toString() || 'Sin tenant');
  }

  carteraLabel(account: WhatsappAccount): string {
    const carteraId = Number(account.carteraId) || 0;
    const portfolio = this.portfolios.find(item => item.id === carteraId);
    return portfolio ? `${portfolio.portfolioCode} - ${portfolio.portfolioName}` : (account.carteraId?.toString() || 'Sin cartera');
  }

  subcarteraLabel(account: WhatsappAccount): string {
    const subcarteraId = Number(account.subcarteraId) || 0;
    const subPortfolio = this.subPortfolios.find(item => item.id === subcarteraId);
    return subPortfolio ? `${subPortfolio.subPortfolioCode} - ${subPortfolio.subPortfolioName}` : (account.subcarteraId?.toString() || 'Sin subcartera');
  }

  saveBinding(): void {
    const account = this.selectedAccount;
    if (!account || this.form.tenantId <= 0 || this.form.carteraId <= 0 || this.form.subcarteraId <= 0) {
      this.feedback = 'Completa tenant, cartera y subcartera para guardar el enlace.';
      return;
    }

    this.saving = true;
    this.feedback = '';
    this.subscriptions.add(
      this.whatsappApi.bindWhatsappAccount(account.id, {
         tenantId: this.form.tenantId,
         carteraId: this.form.carteraId,
         subcarteraId: this.form.subcarteraId,
        active: this.form.active
      }).subscribe({
        next: updated => {
          this.accounts = this.accounts.map(item => item.id === updated.id ? updated : item);
          this.syncForm(updated);
          this.feedback = 'Servicio enlazado correctamente.';
          this.saving = false;
        },
        error: () => {
          this.feedback = 'No se pudo guardar el enlace del servicio.';
          this.saving = false;
        }
      })
    );
  }

  onActiveChange(active: boolean): void {
    const account = this.selectedAccount;
    if (!account || this.form.tenantId <= 0 || this.form.carteraId <= 0 || this.form.subcarteraId <= 0) {
      this.form.active = false;
      this.feedback = 'Primero guarda tenant, cartera y subcartera.';
      return;
    }

    this.activationSaving = true;
    this.whatsappApi.setWhatsappAccountActive(account.id, active).subscribe({
      next: updated => {
        this.accounts = this.accounts.map(item => item.id === updated.id ? updated : item);
        this.form.active = updated.active === true;
        this.feedback = updated.active ? 'Servicio habilitado.' : 'Servicio deshabilitado.';
        this.activationSaving = false;
      },
      error: () => {
        this.form.active = !active;
        this.feedback = 'No se pudo cambiar la habilitación del servicio.';
        this.activationSaving = false;
      }
    });
  }

  changeNumber(): void {
    const account = this.selectedAccount;
    if (!account || account.currentAccount === false || this.changingNumber) return;

    const confirmed = window.confirm(
      'Se eliminará la sesión de WhatsApp de este servicio y sus datos locales de Go. ' +
      'Los historiales guardados en Spring no se borrarán. ¿Deseas continuar para vincular otro número?'
    );
    if (!confirmed) return;

    this.changingNumber = true;
    this.feedback = '';
    this.subscriptions.add(
      this.whatsappApi.cleanupWhatsappAccount(account.id).subscribe({
        next: updated => {
          this.changingNumber = false;
          this.feedback = 'Sesión eliminada. El servicio se reiniciará y quedará esperando un nuevo QR.';
          this.selectedId = updated.id;
          this.refreshAccounts();
        },
        error: () => {
          this.changingNumber = false;
          this.feedback = 'No se pudo eliminar la sesión del servicio.';
        }
      })
    );
  }

  private syncForm(account: WhatsappAccount): void {
    const tenantId = Number(account.tenantId) || 0;
    const carteraId = Number(account.carteraId) || 0;
    const subcarteraId = Number(account.subcarteraId) || 0;

    this.form = {
      tenantId,
      carteraId,
      subcarteraId,
      active: account.active === true
    };

    if (tenantId > 0) this.loadPortfolios(tenantId, carteraId, subcarteraId);
  }

  private loadTenants(): void {
    this.loadingTenants = true;
    this.subscriptions.add(
      this.tenantService.getAllTenants().subscribe({
        next: tenants => {
          this.tenants = tenants;
          this.loadingTenants = false;
        },
        error: () => {
          this.loadingTenants = false;
          this.feedback = 'No se pudieron cargar los tenants.';
        }
      })
    );
  }

  private loadPortfolios(tenantId: number, carteraId = 0, subcarteraId = 0): void {
    if (this.loadingPortfolios) return;
    this.loadingPortfolios = true;
    this.subscriptions.add(
      this.portfolioService.getPortfoliosByTenant(tenantId).subscribe({
        next: portfolios => {
          this.portfolios = portfolios;
          this.loadingPortfolios = false;
          if (carteraId > 0) this.loadSubPortfolios(carteraId, subcarteraId);
        },
        error: () => {
          this.loadingPortfolios = false;
          this.feedback = 'No se pudieron cargar las carteras.';
        }
      })
    );
  }

  private loadSubPortfolios(portfolioId: number, subcarteraId = 0): void {
    if (this.loadingSubPortfolios) return;
    this.loadingSubPortfolios = true;
    this.subscriptions.add(
      this.portfolioService.getSubPortfoliosByPortfolio(portfolioId).subscribe({
        next: subPortfolios => {
          this.subPortfolios = subPortfolios;
          this.loadingSubPortfolios = false;
          if (subcarteraId > 0) this.form.subcarteraId = subcarteraId;
        },
        error: () => {
          this.loadingSubPortfolios = false;
          this.feedback = 'No se pudieron cargar las subcarteras.';
        }
      })
    );
  }

  private applyStatusEvent(payload: AccountStatusEvent): void {
    if (payload.accountId && !this.accounts.some(account => account.id === payload.accountId)) {
      this.refreshAccounts();
      return;
    }

    const index = payload.accountId
      ? this.accounts.findIndex(account => account.id === payload.accountId)
      : this.accounts.findIndex(account => account.instanciaId === payload.instanciaId);
    if (index < 0) return;

    const current = this.accounts[index];
    const updated: WhatsappAccount = {
      ...current,
      status: payload.status,
      phoneNumber: payload.phoneNumber || (payload.status === 'WAITING_QR' || payload.status === 'LOGGED_OUT' ? undefined : current.phoneNumber),
      hasLinkedNumber: payload.hasLinkedNumber ?? current.hasLinkedNumber,
      active: payload.active ?? current.active,
      tenantId: payload.tenantId ?? current.tenantId,
      carteraId: payload.carteraId ?? current.carteraId,
      subcarteraId: payload.subcarteraId ?? current.subcarteraId,
      qrData: payload.qr || undefined
    };
    this.accounts = this.accounts.map(account => account.id === updated.id ? updated : account);
    if (this.selectedId === updated.id) this.syncForm(updated);
  }

  private refreshAccounts(): void {
    this.subscriptions.add(this.whatsappApi.getWhatsappAccounts().subscribe({
       next: accounts => {
         this.accounts = this.currentAccounts(accounts);
         accounts = this.accounts;
        this.loading = false;
        const selected = this.selectedId === null
          ? accounts[0]
          : accounts.find(account => account.id === this.selectedId) || accounts[0];
        if (selected) this.selectAccount(selected);
        else this.selectedId = null;
      },
      error: () => this.error = 'No se pudieron actualizar los servicios de WhatsApp.'
    }));
  }

  private currentAccounts(accounts: WhatsappAccount[]): WhatsappAccount[] {
    return accounts.filter(account => account.currentAccount !== false);
  }
}
