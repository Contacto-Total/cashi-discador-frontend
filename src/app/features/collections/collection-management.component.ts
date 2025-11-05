import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { ContactService } from '../../core/services/contact.service';
import { ClienteDetalle } from '../../core/models/cliente-detalle.model';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-collection-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="collection-container">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <div class="app-icon">
            <mat-icon>account_balance</mat-icon>
          </div>
          <div class="header-info">
            <h1>Gestión de Cobranza</h1>
            <p class="subtitle">📞 Cartera Vencida Q1 2025</p>
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
            <span class="status-value" [class.available]="isAvailable">
              ⚪ {{ isAvailable ? 'DISPONIBLE' : 'OCUPADO' }}
            </span>
          </div>

          <div class="timer">
            <span class="time">{{ formatTime(elapsedTime) }}</span>
          </div>
        </div>
      </header>

      <!-- Client Info Bar -->
      <div class="client-info-bar" *ngIf="clienteDetalle">
        <div class="client-data">
          <span class="label">✦ CLIENTE</span>
          <span class="value">{{ clienteDetalle.nombreCompleto || 'Sin datos' }}</span>
        </div>
        <div class="client-data">
          <span class="label">Documento</span>
          <span class="value">{{ clienteDetalle.tipoDocumento || 'DNI' }}: {{ clienteDetalle.documento }}</span>
        </div>
        <div class="client-data">
          <span class="label">ID Cliente</span>
          <span class="value">CLI-{{ clienteDetalle.idCliente }}</span>
        </div>
        <div class="client-data">
          <span class="label">Cuenta</span>
          <span class="value">{{ clienteDetalle.cuenta || 'N/A' }}</span>
        </div>
        <div class="financial-info">
          <div class="debt">
            <span class="label">$ Deuda</span>
            <span class="amount">S/ {{ clienteDetalle.deudaTotal || 0 | number:'1.2-2' }}</span>
          </div>
          <div class="mora">
            <span class="label">⏰ Mora</span>
            <span class="days">{{ clienteDetalle.diasMora || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Loading/Error states -->
      <div class="client-info-bar" *ngIf="!clienteDetalle && loading">
        <div class="client-data">
          <span class="label">⏳ Cargando datos del cliente...</span>
        </div>
      </div>

      <div class="client-info-bar" *ngIf="!clienteDetalle && error">
        <div class="client-data">
          <span class="label">❌ {{ error }}</span>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Left Panel - Client Details -->
        <aside class="left-panel">
          <mat-tab-group class="detail-tabs">
            <mat-tab label="👤 Cliente">
              <div class="tab-content" *ngIf="clienteDetalle">
                <div class="section">
                  <h3 class="section-title">👤 Datos Personales</h3>
                  <div class="field" *ngIf="clienteDetalle.edad">
                    <label>Edad:</label>
                    <span>{{ clienteDetalle.edad }} años</span>
                  </div>
                  <div class="field" *ngIf="clienteDetalle.fechaNacimiento">
                    <label>F. Nac:</label>
                    <span>{{ clienteDetalle.fechaNacimiento | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <div class="field" *ngIf="clienteDetalle.estadoCivil">
                    <label>Estado Civil:</label>
                    <span>{{ clienteDetalle.estadoCivil }}</span>
                  </div>
                  <div class="field" *ngIf="clienteDetalle.ocupacion">
                    <label>Ocupación:</label>
                    <span>{{ clienteDetalle.ocupacion }}</span>
                  </div>
                </div>

                <div class="section">
                  <h3 class="section-title">📞 Contacto</h3>
                  <div class="field" *ngIf="clienteDetalle.telefonoPrincipal">
                    <label>Tel. Principal</label>
                    <span class="phone">{{ clienteDetalle.telefonoPrincipal }}</span>
                  </div>
                  <div class="field" *ngIf="clienteDetalle.telefonoSecundario">
                    <label>Tel. Secundario</label>
                    <span class="phone">{{ clienteDetalle.telefonoSecundario }}</span>
                  </div>
                  <div class="field" *ngIf="clienteDetalle.telefonoTrabajo">
                    <label>Tel. Trabajo</label>
                    <span class="phone">{{ clienteDetalle.telefonoTrabajo }}</span>
                  </div>
                  <div class="field" *ngIf="clienteDetalle.telefonoReferencia1">
                    <label>Tel. Referencia 1</label>
                    <span class="phone">{{ clienteDetalle.telefonoReferencia1 }}</span>
                  </div>
                  <div class="field" *ngIf="clienteDetalle.telefonoReferencia2">
                    <label>Tel. Referencia 2</label>
                    <span class="phone">{{ clienteDetalle.telefonoReferencia2 }}</span>
                  </div>
                  <div class="field" *ngIf="clienteDetalle.email">
                    <label>Email</label>
                    <span class="email">{{ clienteDetalle.email }}</span>
                  </div>
                  <div class="field" *ngIf="clienteDetalle.direccion">
                    <label>Dirección</label>
                    <span class="address">{{ clienteDetalle.direccion }}</span>
                  </div>
                  <div class="field" *ngIf="clienteDetalle.distrito || clienteDetalle.provincia || clienteDetalle.departamento">
                    <label>Ubicación</label>
                    <span>{{ clienteDetalle.distrito }}, {{ clienteDetalle.provincia }}, {{ clienteDetalle.departamento }}</span>
                  </div>
                </div>
              </div>
              <div class="tab-content" *ngIf="!clienteDetalle">
                <p>Cargando información del cliente...</p>
              </div>
            </mat-tab>

            <mat-tab label="💳 Cuenta">
              <div class="tab-content">
                <p>Información de cuenta...</p>
              </div>
            </mat-tab>

            <mat-tab label="📋 Historial">
              <div class="tab-content">
                <p>Historial de gestiones...</p>
              </div>
            </mat-tab>
          </mat-tab-group>
        </aside>

        <!-- Right Panel - Call Management -->
        <main class="right-panel">
          <!-- Call Controls -->
          <div class="control-section">
            <div class="section-header">
              <mat-icon>phone_in_talk</mat-icon>
              <h3>Control de Llamada</h3>
            </div>

            <div class="call-buttons">
              <button
                mat-raised-button
                class="btn-iniciar"
                [disabled]="callInProgress">
                <mat-icon>call</mat-icon>
                Iniciar
              </button>
              <button
                mat-raised-button
                class="btn-finalizar"
                [disabled]="!callInProgress">
                <mat-icon>call_end</mat-icon>
                Finalizar
              </button>
            </div>
          </div>

          <!-- Contact Result -->
          <div class="form-section">
            <label class="form-label required">Resultado de Contacto</label>
            <mat-form-field appearance="outline">
              <mat-select placeholder="-- Seleccionar resultado --">
                <mat-option value="contacted">Contactado</mat-option>
                <mat-option value="not-contacted">No Contactado</mat-option>
                <mat-option value="promise-payment">Promesa de Pago</mat-option>
                <mat-option value="payment-made">Pago Realizado</mat-option>
                <mat-option value="refused">Rechazó Pagar</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Observations -->
          <div class="form-section">
            <label class="form-label">💬 Observaciones</label>
            <mat-form-field appearance="outline">
              <textarea
                matInput
                placeholder="Detalles de la conversación..."
                rows="3"></textarea>
            </mat-form-field>
          </div>

          <!-- Private Notes -->
          <div class="form-section">
            <label class="form-label">📝 Notas Privadas</label>
            <mat-form-field appearance="outline">
              <textarea
                matInput
                placeholder="Notas internas..."
                rows="3"></textarea>
            </mat-form-field>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button mat-raised-button class="btn-save">
              <mat-icon>save</mat-icon>
              Guardar Gestión
            </button>
            <button mat-stroked-button class="btn-cancel">
              <mat-icon>close</mat-icon>
              Cancelar
            </button>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .collection-container {
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
      color: #4caf50;
    }

    .timer {
      font-family: 'Courier New', monospace;
      font-size: 24px;
      font-weight: 600;
      padding: 8px 16px;
      background-color: rgba(0,0,0,0.2);
      border-radius: 4px;
    }

    /* Client Info Bar */
    .client-info-bar {
      background-color: var(--primary-bg);
      border-bottom: 1px solid var(--border-color);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 32px;
      box-shadow: var(--shadow);
    }

    .client-data {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .client-data .label {
      font-size: 11px;
      color: var(--text-secondary);
      text-transform: uppercase;
    }

    .client-data .value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .financial-info {
      margin-left: auto;
      display: flex;
      gap: 24px;
    }

    .debt, .mora {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .debt .label, .mora .label {
      font-size: 11px;
      color: var(--text-secondary);
    }

    .debt .amount {
      font-size: 20px;
      font-weight: 700;
      color: var(--accent-danger);
    }

    .mora .days {
      font-size: 20px;
      font-weight: 700;
      color: var(--accent-warning);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 0;
      min-height: 0;
    }

    /* Left Panel */
    .left-panel {
      background-color: var(--panel-bg);
      border-right: 1px solid var(--border-color);
      overflow-y: auto;
    }

    .detail-tabs {
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

    .field {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }

    .field label {
      font-size: 11px;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }

    .field span {
      font-size: 13px;
      color: var(--text-primary);
    }

    .field .phone,
    .field .email,
    .field .address {
      font-weight: 500;
    }

    /* Right Panel */
    .right-panel {
      padding: 24px;
      overflow-y: auto;
      background-color: var(--primary-bg);
    }

    .control-section {
      background-color: var(--secondary-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .section-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .section-header mat-icon {
      color: var(--accent-info);
    }

    .call-buttons {
      display: flex;
      gap: 12px;
    }

    .btn-iniciar {
      flex: 1;
      background-color: var(--button-primary) !important;
      color: white !important;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
    }

    .btn-finalizar {
      flex: 1;
      background-color: var(--button-secondary) !important;
      color: white !important;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
    }

    .form-section {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .form-label.required::before {
      content: '● ';
      color: var(--accent-danger);
    }

    mat-form-field {
      width: 100%;
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      gap: 12px;
      margin-top: 32px;
    }

    .btn-save {
      flex: 1;
      background-color: var(--button-secondary) !important;
      color: white !important;
      height: 56px;
      font-size: 16px;
      font-weight: 600;
    }

    .btn-cancel {
      background-color: transparent !important;
      color: var(--text-secondary) !important;
      height: 56px;
      font-size: 16px;
      border: 2px solid var(--border-color) !important;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .main-content {
        grid-template-columns: 1fr;
      }

      .left-panel {
        max-height: 400px;
      }
    }
  `]
})
export class CollectionManagementComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  isDarkTheme = false;
  isAvailable = true;
  callInProgress = false;
  elapsedTime = 0;

  // Datos del cliente (reemplaza los datos hardcoded)
  clienteDetalle: ClienteDetalle | null = null;
  loading = false;
  error: string | null = null;

  private themeSubscription?: Subscription;
  private timerSubscription?: Subscription;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private contactService: ContactService
  ) {}

  async ngOnInit() {
    // Load current user
    this.currentUser = await this.authService.getCurrentUser();

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });

    // Start timer
    this.timerSubscription = interval(1000).subscribe(() => {
      this.elapsedTime++;
    });

    // TODO: Cargar datos del cliente cuando haya una llamada activa
    // Por ahora cargamos el contacto de prueba (ID: 446)
    this.loadClienteDetalle(446);
  }

  /**
   * Carga los datos completos del cliente
   */
  loadClienteDetalle(contactId: number): void {
    this.loading = true;
    this.error = null;

    this.contactService.getClienteDetalle(contactId).subscribe({
      next: (data) => {
        this.clienteDetalle = data;
        this.loading = false;
        console.log('📋 Cliente cargado:', data);
      },
      error: (err) => {
        console.error('❌ Error cargando cliente:', err);
        this.error = 'Error al cargar datos del cliente';
        this.loading = false;
      }
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
}
