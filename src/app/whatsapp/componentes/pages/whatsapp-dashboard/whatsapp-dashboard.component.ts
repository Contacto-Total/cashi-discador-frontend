import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { interval, Subscription, startWith, switchMap } from 'rxjs';
import { WhatsappApiService } from '../../../services/whatsapp-api.service';
import { AccountStatusEvent, WhatsappAccount } from '../../../models';
import { WhatsappRealtimeService } from '../../../services/whatsapp-realtime.service';

@Component({
  selector: 'app-whatsapp-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './whatsapp-dashboard.component.html',
  styleUrls: ['./whatsapp-dashboard.component.css']
})
export class WhatsappDashboardComponent implements OnInit, OnDestroy {
  accounts: WhatsappAccount[] = [];
  selectedId: number | null = null;
  loading = true;
  saving = false;
  error = '';
  feedback = '';

  form = {
    tenantId: '',
    cartera: '',
    subcartera: '',
    active: false
  };

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly whatsappApi: WhatsappApiService,
    private readonly realtime: WhatsappRealtimeService
  ) {}

  ngOnInit(): void {
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

  saveBinding(): void {
    const account = this.selectedAccount;
    if (!account || !this.form.tenantId.trim() || !this.form.cartera.trim() || !this.form.subcartera.trim()) {
      this.feedback = 'Completa tenant, cartera y subcartera para guardar el enlace.';
      return;
    }

    this.saving = true;
    this.feedback = '';
    this.subscriptions.add(
      this.whatsappApi.bindWhatsappAccount(account.id, {
        tenantId: this.form.tenantId.trim(),
        cartera: this.form.cartera.trim(),
        subcartera: this.form.subcartera.trim(),
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
    this.form = {
      tenantId: account.tenantId || '',
      cartera: account.cartera || '',
      subcartera: account.subcartera || '',
      active: account.active === true
    };
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
