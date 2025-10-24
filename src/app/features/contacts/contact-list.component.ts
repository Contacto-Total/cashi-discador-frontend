import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { ContactService } from '../../core/services/contact.service';
import { Contact } from '../../core/models/contact.model';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatChipsModule
  ],
  template: `
    <div class="contacts-container">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <div class="app-icon">
            <mat-icon>contacts</mat-icon>
          </div>
          <div class="header-info">
            <h1>Gestión de Cobranza</h1>
            <p class="subtitle">📋 Gestión de Contactos</p>
          </div>
          <div class="advisor-info">
            <span class="label">Asesor</span>
            <span class="name">{{ currentUser?.username || 'Usuario' }}</span>
          </div>
        </div>

        <div class="header-right">
          <!-- Theme Toggle Button -->
          <button
            mat-raised-button
            class="theme-toggle"
            (click)="toggleTheme()">
            <mat-icon>{{ isDarkTheme ? 'wb_sunny' : 'nightlight' }}</mat-icon>
            {{ isDarkTheme ? 'OSCURO' : 'CLARO' }}
          </button>

          <div class="status-section">
            <span class="status-label">Estado</span>
            <span class="status-value available">
              ⚪ DISPONIBLE
            </span>
          </div>

          <div class="timer">
            <span class="time">{{ formatTime(elapsedTime) }}</span>
          </div>
        </div>
      </header>

      <!-- Info Bar -->
      <div class="info-bar">
        <div class="info-data">
          <span class="label">✦ TOTAL CONTACTOS</span>
          <span class="value">{{ contacts.length }}</span>
        </div>
        <div class="info-data">
          <span class="label">Nuevos</span>
          <span class="value">{{ getContactsByStatus('NEW') }}</span>
        </div>
        <div class="info-data">
          <span class="label">En Proceso</span>
          <span class="value">{{ getContactsByStatus('PENDING') }}</span>
        </div>
        <div class="info-data">
          <span class="label">Contactados</span>
          <span class="value">{{ getContactsByStatus('CONTACTED') }}</span>
        </div>
        <div class="action-buttons">
          <button mat-raised-button class="btn-add" routerLink="/contacts/new">
            <mat-icon>add</mat-icon>
            Nuevo Contacto
          </button>
          <button mat-raised-button class="btn-back" routerLink="/dialer">
            <mat-icon>arrow_back</mat-icon>
            Volver a Softphone
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Left Panel - Filters -->
        <aside class="left-panel">
          <mat-tab-group class="filter-tabs">
            <mat-tab label="🔍 Filtros">
              <div class="tab-content">
                <div class="section">
                  <h3 class="section-title">Estado</h3>
                  <div class="filter-option">
                    <label>Todos los estados</label>
                  </div>
                </div>

                <div class="section">
                  <h3 class="section-title">📊 Estadísticas</h3>
                  <div class="stat-item">
                    <span class="stat-label">Total:</span>
                    <span class="stat-value">{{ contacts.length }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Nuevos:</span>
                    <span class="stat-value">{{ getContactsByStatus('NEW') }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Pendientes:</span>
                    <span class="stat-value">{{ getContactsByStatus('PENDING') }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Contactados:</span>
                    <span class="stat-value">{{ getContactsByStatus('CONTACTED') }}</span>
                  </div>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </aside>

        <!-- Right Panel - Contact List -->
        <main class="right-panel">
          <div class="list-section">
            <div class="section-header">
              <mat-icon>list</mat-icon>
              <h3>Lista de Contactos</h3>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="contacts" class="contacts-table">
                <!-- Name Column -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Nombre</th>
                  <td mat-cell *matCellDef="let contact">
                    {{ contact.firstName }} {{ contact.lastName }}
                  </td>
                </ng-container>

                <!-- Phone Column -->
                <ng-container matColumnDef="phone">
                  <th mat-header-cell *matHeaderCellDef>Teléfono</th>
                  <td mat-cell *matCellDef="let contact">{{ contact.phoneNumber }}</td>
                </ng-container>

                <!-- Email Column -->
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let contact">{{ contact.email || 'N/A' }}</td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let contact">
                    <mat-chip [class]="'status-chip ' + getStatusClass(contact.status)">
                      {{ getStatusLabel(contact.status) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Attempts Column -->
                <ng-container matColumnDef="attempts">
                  <th mat-header-cell *matHeaderCellDef>Intentos</th>
                  <td mat-cell *matCellDef="let contact">{{ contact.attempts || 0 }}</td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let contact">
                    <button mat-icon-button [routerLink]="['/contacts', contact.id, 'edit']" class="action-btn">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="callContact(contact)" class="action-btn call-btn">
                      <mat-icon>call</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
              </table>

              <div class="no-data" *ngIf="contacts.length === 0">
                <mat-icon>contacts</mat-icon>
                <p>No hay contactos registrados</p>
                <button mat-raised-button color="primary" routerLink="/contacts/new">
                  <mat-icon>add</mat-icon>
                  Agregar Primer Contacto
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .contacts-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--secondary-bg);
    }

    /* Header */
    .header {
      background-color: var(--header-bg);
      color: var(--text-inverse);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .app-icon {
      background-color: #5da8e8;
      border-radius: 8px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .app-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .header-info h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .header-info .subtitle {
      margin: 0;
      font-size: 12px;
      opacity: 0.9;
    }

    .advisor-info {
      display: flex;
      flex-direction: column;
      padding-left: 20px;
      border-left: 1px solid rgba(255,255,255,0.2);
    }

    .advisor-info .label {
      font-size: 11px;
      opacity: 0.8;
    }

    .advisor-info .name {
      font-size: 14px;
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .theme-toggle {
      background-color: var(--theme-button-bg) !important;
      color: var(--theme-button-text) !important;
      font-weight: 600;
      padding: 0 20px;
      height: 36px;
    }

    .theme-toggle mat-icon {
      margin-right: 8px;
    }

    .status-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .status-label {
      font-size: 11px;
      opacity: 0.8;
    }

    .status-value {
      font-size: 14px;
      font-weight: 600;
    }

    .status-value.available {
      color: #10b981;
    }

    .timer {
      font-family: 'Courier New', monospace;
      font-size: 24px;
      font-weight: 600;
      padding: 8px 16px;
      background-color: rgba(0,0,0,0.2);
      border-radius: 4px;
    }

    /* Info Bar */
    .info-bar {
      background-color: var(--client-bar-bg);
      border-bottom: 1px solid var(--border-color);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 32px;
      box-shadow: var(--shadow);
    }

    .info-data {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-data .label {
      font-size: 11px;
      color: var(--text-secondary);
      text-transform: uppercase;
    }

    .info-data .value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .action-buttons {
      margin-left: auto;
      display: flex;
      gap: 12px;
    }

    .btn-add {
      background-color: var(--button-primary) !important;
      color: white !important;
      font-weight: 600;
    }

    .btn-back {
      background-color: var(--button-secondary) !important;
      color: white !important;
      font-weight: 600;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 0;
      min-height: 0;
    }

    /* Left Panel */
    .left-panel {
      background-color: var(--panel-bg);
      border-right: 1px solid var(--border-color);
      overflow-y: auto;
    }

    .filter-tabs {
      height: 100%;
    }

    .tab-content {
      padding: 20px;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--panel-text);
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-color);
    }

    .filter-option {
      padding: 8px 0;
    }

    .filter-option label {
      font-size: 13px;
      color: var(--text-primary);
      cursor: pointer;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .stat-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--panel-text);
    }

    /* Right Panel */
    .right-panel {
      padding: 24px;
      overflow-y: auto;
      background-color: var(--primary-bg);
    }

    .list-section {
      background-color: var(--secondary-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
    }

    .section-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .section-header mat-icon {
      color: var(--accent-info);
    }

    /* Table */
    .table-container {
      overflow-x: auto;
    }

    .contacts-table {
      width: 100%;
      background-color: transparent;
    }

    .contacts-table th {
      background-color: var(--secondary-bg);
      color: var(--text-primary);
      font-weight: 600;
      font-size: 13px;
      padding: 12px 16px;
      border-bottom: 2px solid var(--border-color);
    }

    .contacts-table td {
      color: var(--text-primary);
      font-size: 14px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .table-row {
      transition: background-color 0.2s;
    }

    .table-row:hover {
      background-color: var(--secondary-bg);
    }

    .status-chip {
      font-size: 11px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 12px;
    }

    .status-chip.new {
      background-color: #60a5fa;
      color: white;
    }

    .status-chip.pending {
      background-color: #fbbf24;
      color: #1a1a1a;
    }

    .status-chip.contacted {
      background-color: #10b981;
      color: white;
    }

    .status-chip.failed {
      background-color: #dc3545;
      color: white;
    }

    .action-btn {
      color: var(--text-secondary);
      transition: color 0.2s;
    }

    .action-btn:hover {
      color: var(--accent-info);
    }

    .call-btn:hover {
      color: var(--button-primary);
    }

    /* No Data */
    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-secondary);
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      opacity: 0.3;
      margin-bottom: 16px;
    }

    .no-data p {
      font-size: 16px;
      margin-bottom: 20px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .main-content {
        grid-template-columns: 1fr;
      }

      .left-panel {
        max-height: 300px;
      }
    }
  `]
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  displayedColumns = ['name', 'phone', 'email', 'status', 'attempts', 'actions'];
  currentUser: any = null;
  isDarkTheme = false;
  elapsedTime = 0;

  private themeSubscription?: Subscription;
  private timerSubscription?: Subscription;

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUser();

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });

    // Start elapsed timer
    this.timerSubscription = interval(1000).subscribe(() => {
      this.elapsedTime++;
    });

    // Load contacts
    this.contactService.getAllContacts().subscribe(contacts => {
      this.contacts = contacts;
    });
  }

  ngOnDestroy() {
    this.themeSubscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getContactsByStatus(status: string): number {
    return this.contacts.filter(c => c.status === status).length;
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'NEW': 'Nuevo',
      'PENDING': 'Pendiente',
      'CONTACTED': 'Contactado',
      'FAILED': 'Fallido'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  callContact(contact: Contact) {
    alert(`Iniciando llamada a ${contact.firstName} ${contact.lastName} (${contact.phoneNumber})`);
    // Aquí puedes integrar con el servicio SIP para hacer la llamada
  }
}
