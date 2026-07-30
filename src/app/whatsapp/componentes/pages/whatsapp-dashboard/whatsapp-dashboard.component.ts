import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { interval, Subscription, startWith, switchMap } from 'rxjs';
import { WhatsappApiService } from '../../../services/whatsapp-api.service';
import { AccountStatusEvent, WhatsappAccount } from '../../../models';
import { WhatsappRealtimeService } from '../../../services/whatsapp-realtime.service';
import { TenantService } from '../../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../../maintenance/models/portfolio.model';

@Component({
  selector: 'app-whatsapp-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
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
    private readonly tenantService: TenantService,
    private readonly portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.loadTenants();

    this.subscriptions.add(
      interval(15000).pipe(
        startWith(0),
        switchMap(() => this.whatsappApi.getWhatsappAccounts())
      ).subscribe({
        next: accounts => {
          this.accounts = accounts;
          this.loading = false;
          this.error = '';
          if (this.selectedId === null && accounts.length > 0) {
            this.selectAccount(accounts[0]);
          } else if (this.selectedId !== null) {
            const current = accounts.find(account => account.id === this.selectedId);
            if (current) this.syncForm(current);
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
    return tenant ? `${tenant.tenantCode} - ${tenant.tenantName}` : (account.tenantId || 'Sin tenant');
  }

  carteraLabel(account: WhatsappAccount): string {
    const carteraId = Number(account.cartera) || 0;
    const portfolio = this.portfolios.find(item => item.id === carteraId);
    return portfolio ? `${portfolio.portfolioCode} - ${portfolio.portfolioName}` : (account.cartera || 'Sin cartera');
  }

  subcarteraLabel(account: WhatsappAccount): string {
    const subcarteraId = Number(account.subcartera) || 0;
    const subPortfolio = this.subPortfolios.find(item => item.id === subcarteraId);
    return subPortfolio ? `${subPortfolio.subPortfolioCode} - ${subPortfolio.subPortfolioName}` : (account.subcartera || 'Sin subcartera');
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
        tenantId: String(this.form.tenantId),
        cartera: String(this.form.carteraId),
        subcartera: String(this.form.subcarteraId),
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

  private syncForm(account: WhatsappAccount): void {
    const tenantId = Number(account.tenantId) || 0;
    const carteraId = Number(account.cartera) || 0;
    const subcarteraId = Number(account.subcartera) || 0;

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
    const index = this.accounts.findIndex(account => account.instanciaId === payload.instanciaId);
    if (index < 0) return;

    const current = this.accounts[index];
    const updated: WhatsappAccount = {
      ...current,
      status: payload.status,
      phoneNumber: payload.phoneNumber || current.phoneNumber,
      hasLinkedNumber: payload.hasLinkedNumber ?? current.hasLinkedNumber,
      active: payload.active ?? current.active,
      tenantId: payload.tenantId ?? current.tenantId,
      cartera: payload.cartera ?? current.cartera,
      subcartera: payload.subcartera ?? current.subcartera,
      qrData: payload.qr || undefined
    };
    this.accounts = this.accounts.map(account => account.id === updated.id ? updated : account);
    if (this.selectedId === updated.id) this.syncForm(updated);
  }
}
