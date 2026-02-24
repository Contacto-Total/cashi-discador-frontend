import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { SipService, CallState } from '../../../core/services/sip.service';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { environment } from '../../../../environments/environment';
import { Subscription, interval } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-test-softphone',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    LucideAngularModule
  ],
  template: `
    <div class="softphone-container">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <div class="app-icon">
            <lucide-angular name="landmark" [size]="28"></lucide-angular>
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
            <lucide-angular [name]="isDarkTheme ? 'sun' : 'moon'" [size]="20"></lucide-angular>
            {{ isDarkTheme ? 'OSCURO' : 'CLARO' }}
          </button>

          <div class="status-section">
            <span class="status-label">Estado</span>
            <span class="status-value" [class.available]="sipRegistered">
              {{ sipRegistered ? '⚪ DISPONIBLE' : '🔴 DESCONECTADO' }}
            </span>
          </div>

          <div class="timer">
            <span class="time">{{ formatTime(elapsedTime) }}</span>
          </div>
        </div>
      </header>

      <!-- Client Info Bar -->
      <div class="client-info-bar">
        <div class="client-data">
          <span class="label">✦ CLIENTE</span>
          <span class="value">{{ currentClientName }}</span>
        </div>
        <div class="client-data">
          <span class="label">Documento</span>
          <span class="value">{{ currentClientDoc }}</span>
        </div>
        <div class="client-data">
          <span class="label">ID Cliente</span>
          <span class="value">{{ currentClientId }}</span>
        </div>
        <div class="client-data">
          <span class="label">Cuenta</span>
          <span class="value">{{ currentClientAccount }}</span>
        </div>
        <div class="financial-info">
          <div class="debt">
            <span class="label">$ Deuda</span>
            <span class="amount">{{ currentClientDebt }}</span>
          </div>
          <div class="mora">
            <span class="label">⏰ Mora</span>
            <span class="days">{{ currentClientMora }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Left Panel - Client Details -->
        <aside class="left-panel">
          <mat-tab-group class="detail-tabs">
            <mat-tab label="👤 Cliente">
              <div class="tab-content">
                <div class="section">
                  <h3 class="section-title">👤 Datos Personales</h3>
                  <div class="field">
                    <label>Edad:</label>
                    <span>40 años</span>
                  </div>
                  <div class="field">
                    <label>F. Nac:</label>
                    <span>15/03/1985</span>
                  </div>
                </div>

                <div class="section">
                  <h3 class="section-title">📞 Contacto</h3>
                  <div class="field">
                    <label>Tel. Principal</label>
                    <span class="phone">+51 987 654 321</span>
                  </div>
                  <div class="field">
                    <label>Tel. Alt.</label>
                    <span class="phone">+51 945 123 456</span>
                  </div>
                  <div class="field">
                    <label>Email</label>
                    <span class="email">carmen.garcia@email.com</span>
                  </div>
                  <div class="field">
                    <label>Dirección</label>
                    <span class="address">Av. Los Alamos 458, Dpto 302, San Borja, Lima</span>
                  </div>
                </div>

                <div class="section">
                  <h3 class="section-title">📡 Estado SIP</h3>
                  <div class="field">
                    <label>FreeSWITCH:</label>
                    <span [style.color]="sipRegistered ? '#10b981' : '#dc3545'">
                      {{ sipRegistered ? '✓ Registrado' : '✗ Desconectado' }}
                    </span>
                  </div>
                  <div class="field">
                    <label>Extensión:</label>
                    <span>{{ currentUser?.sipExtension || 'N/A' }}</span>
                  </div>
                  <div class="field">
                    <label>Estado Llamada:</label>
                    <span [style.color]="getStatusColor()">{{ getStatusText() }}</span>
                  </div>
                </div>
              </div>
            </mat-tab>

            <mat-tab label="💳 Cuenta">
              <div class="tab-content">
                <div class="section">
                  <h3 class="section-title">💳 Información de Cuenta</h3>
                  <div class="field">
                    <label>Producto:</label>
                    <span>Préstamo Personal</span>
                  </div>
                  <div class="field">
                    <label>N° Cuenta:</label>
                    <span>****5678</span>
                  </div>
                  <div class="field">
                    <label>Deuda Total:</label>
                    <span style="color: #dc3545; font-weight: 700;">S/ 9,561.78</span>
                  </div>
                  <div class="field">
                    <label>Días Mora:</label>
                    <span style="color: #ff9800; font-weight: 700;">45 días</span>
                  </div>
                </div>
              </div>
            </mat-tab>

            <mat-tab label="📋 Historial">
              <div class="tab-content">
                <div class="section">
                  <h3 class="section-title">📋 Historial de Gestiones</h3>
                  <p class="info-text">No hay gestiones previas registradas.</p>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </aside>

        <!-- Right Panel - Softphone -->
        <main class="right-panel">
          <!-- Incoming Call Alert -->
          <div class="incoming-call-alert" *ngIf="hasIncomingCall">
            <div class="alert-content">
              <lucide-angular name="phone-call" class="phone-icon" [size]="48"></lucide-angular>
              <div class="alert-text">
                <h3>📞 Llamada Entrante</h3>
                <p class="incoming-number">De: {{ incomingCallNumber }}</p>
              </div>
            </div>
            <div class="alert-actions">
              <button mat-raised-button class="btn-answer" (click)="answerCall()">
                <lucide-angular name="phone" [size]="20"></lucide-angular>
                Contestar
              </button>
              <button mat-raised-button class="btn-reject" (click)="rejectCall()">
                <lucide-angular name="phone-off" [size]="20"></lucide-angular>
                Rechazar
              </button>
            </div>
          </div>

          <!-- Softphone Controls -->
          <div class="control-section">
            <div class="section-header">
              <lucide-angular name="phone-call" [size]="20"></lucide-angular>
              <h3>Control de Llamada</h3>
            </div>

            <div class="softphone-content">
              <!-- Phone Number Display -->
              <div class="phone-display">
                <input
                  type="text"
                  [(ngModel)]="phoneNumber"
                  placeholder="Ingresa número..."
                  [disabled]="isInCall()"
                  class="phone-input-display">
                <button
                  mat-icon-button
                  (click)="deleteLastDigit()"
                  *ngIf="phoneNumber.length > 0 && !isInCall()"
                  class="backspace-btn">
                  <lucide-angular name="delete" [size]="20"></lucide-angular>
                </button>
              </div>

              <!-- Dialpad Grid -->
              <div class="dialpad-grid">
                <button
                  mat-raised-button
                  *ngFor="let btn of dialpadButtons"
                  class="dialpad-btn"
                  (click)="pressDialpadButton(btn.digit)">
                  <span class="digit">{{ btn.digit }}</span>
                  <span class="letters" *ngIf="btn.letters">{{ btn.letters }}</span>
                </button>
              </div>

              <!-- Call Duration Display -->
              <div class="call-duration" *ngIf="callDuration > 0">
                <lucide-angular name="timer" [size]="20"></lucide-angular>
                <span>{{ formatDuration(callDuration) }}</span>
              </div>

              <!-- Call Status -->
              <div class="call-status-display">
                <div class="status-indicator" [style.background-color]="getStatusColor()"></div>
                <span class="status-text">{{ getStatusText() }}</span>
              </div>

              <!-- Call Action Buttons -->
              <div class="call-actions">
                <button
                  mat-fab
                  class="btn-call"
                  *ngIf="!isInCall()"
                  (click)="makeCall()"
                  [disabled]="!canMakeCall()">
                  <lucide-angular name="phone" [size]="32"></lucide-angular>
                </button>

                <button
                  mat-fab
                  class="btn-hangup"
                  *ngIf="isInCall()"
                  (click)="hangupCall()">
                  <lucide-angular name="phone-off" [size]="32"></lucide-angular>
                </button>

                <button
                  mat-fab
                  class="btn-mute"
                  *ngIf="isInCall()"
                  [class.muted]="isMuted"
                  (click)="toggleMute()">
                  <lucide-angular [name]="isMuted ? 'mic-off' : 'mic'" [size]="32"></lucide-angular>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .softphone-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a);
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

    .app-icon lucide-angular {
      color: white;
    }

    .header-info h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .header-info .subtitle {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.9;
    }

    .advisor-info {
      display: flex;
      flex-direction: column;
      padding-left: 20px;
      border-left: 1px solid rgba(255,255,255,0.2);
    }

    .advisor-info .label {
      font-size: 0.6875rem;
      opacity: 0.8;
    }

    .advisor-info .name {
      font-size: 0.875rem;
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

    .theme-toggle lucide-angular {
      margin-right: 8px;
    }

    .status-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .status-label {
      font-size: 0.6875rem;
      opacity: 0.8;
    }

    .status-value {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .status-value.available {
      color: #10b981;
    }

    .timer {
      font-family: 'Courier New', monospace;
      font-size: 1.5rem;
      font-weight: 600;
      padding: 8px 16px;
      background-color: rgba(0,0,0,0.2);
      border-radius: 4px;
    }

    /* Client Info Bar */
    .client-info-bar {
      background-color: var(--client-bar-bg);
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
      font-size: 0.6875rem;
      color: var(--text-secondary);
      text-transform: uppercase;
    }

    .client-data .value {
      font-size: 0.875rem;
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
      font-size: 0.6875rem;
      color: var(--text-secondary);
    }

    .debt .amount {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--accent-danger);
    }

    .mora .days {
      font-size: 1.25rem;
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
      font-size: 0.875rem;
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
      font-size: 0.6875rem;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }

    .field span {
      font-size: 0.8125rem;
      color: var(--text-primary);
    }

    .field .phone,
    .field .email,
    .field .address {
      font-weight: 500;
    }

    .info-text {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      font-style: italic;
    }

    /* Right Panel */
    .right-panel {
      padding: 24px;
      overflow-y: auto;
      background-color: var(--primary-bg);
    }

    /* Incoming Call Alert */
    .incoming-call-alert {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }

    .alert-content {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .phone-icon {
      font-size: 3rem;
      width: 48px;
      height: 48px;
    }

    .alert-text h3 {
      margin: 0 0 8px 0;
      font-size: 1.125rem;
    }

    .incoming-number {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .alert-actions {
      display: flex;
      gap: 12px;
    }

    .btn-answer {
      flex: 1;
      background-color: white !important;
      color: #10b981 !important;
      height: 48px;
      font-weight: 600;
    }

    .btn-reject {
      background-color: rgba(255,255,255,0.2) !important;
      color: white !important;
      height: 48px;
      font-weight: 600;
    }

    /* Control Section */
    .control-section {
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
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .section-header lucide-angular {
      color: var(--accent-info);
    }

    .softphone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 360px;
      margin: 0 auto;
    }

    /* Phone Display */
    .phone-display {
      width: 100%;
      display: flex;
      align-items: center;
      background-color: var(--input-bg);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 20px;
    }

    .phone-input-display {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      text-align: center;
      font-family: 'Courier New', monospace;
    }

    .backspace-btn {
      color: var(--text-secondary);
    }

    /* Dialpad Grid */
    .dialpad-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }

    .dialpad-btn {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--primary-bg) !important;
      color: var(--text-primary) !important;
      border: 2px solid var(--border-color) !important;
      border-radius: 50% !important;
      font-size: 1.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      padding: 0 !important;
      min-width: 0 !important;
    }

    .dialpad-btn:hover:not(:disabled) {
      background-color: var(--accent-info) !important;
      color: white !important;
      border-color: var(--accent-info) !important;
      transform: scale(1.05);
    }

    .dialpad-btn:active:not(:disabled) {
      transform: scale(0.95);
    }

    .dialpad-btn .digit {
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1;
    }

    .dialpad-btn .letters {
      font-size: 0.625rem;
      font-weight: 500;
      opacity: 0.6;
      margin-top: 2px;
    }

    /* Call Duration */
    .call-duration {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--accent-info);
      font-family: 'Courier New', monospace;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 16px;
      padding: 8px 16px;
      background-color: var(--secondary-bg);
      border-radius: 8px;
    }

    /* Call Status Display */
    .call-status-display {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding: 12px 20px;
      background-color: var(--secondary-bg);
      border-radius: 8px;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      animation: blink 1.5s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .status-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Call Actions */
    .call-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    .btn-call {
      background-color: var(--button-primary) !important;
      color: white !important;
      width: 64px;
      height: 64px;
    }

    .btn-call:disabled {
      background-color: var(--border-color) !important;
      opacity: 0.5;
    }

    .btn-hangup {
      background-color: var(--button-danger) !important;
      color: white !important;
      width: 64px;
      height: 64px;
    }

    .btn-mute {
      background-color: var(--button-secondary) !important;
      color: white !important;
      width: 64px;
      height: 64px;
    }

    .btn-mute.muted {
      background-color: var(--accent-warning) !important;
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
export class TestSoftphoneComponent implements OnInit, OnDestroy {
  phoneNumber = '';
  callState: CallState = CallState.IDLE;
  callDuration = 0;
  isMuted = false;
  sipRegistered = false;
  hasIncomingCall = false;
  incomingCallNumber = '';

  currentUser: any = null;
  isDarkTheme = false;
  elapsedTime = 0;

  // Mock client data
  currentClientName = 'GARCÍA RODRIGUEZ, CARMEN ROSA';
  currentClientDoc = 'DNI: 45621378';
  currentClientId = 'CLI-2025-0087453';
  currentClientAccount = '****5678';
  currentClientDebt = 'S/ 9,561.78';
  currentClientMora = '45';

  // Dialpad configuration
  dialpadButtons = [
    { digit: '1', letters: '' },
    { digit: '2', letters: 'ABC' },
    { digit: '3', letters: 'DEF' },
    { digit: '4', letters: 'GHI' },
    { digit: '5', letters: 'JKL' },
    { digit: '6', letters: 'MNO' },
    { digit: '7', letters: 'PQRS' },
    { digit: '8', letters: 'TUV' },
    { digit: '9', letters: 'WXYZ' },
    { digit: '*', letters: '' },
    { digit: '0', letters: '+' },
    { digit: '#', letters: '' }
  ];

  CallState = CallState;

  private callTimer: any = null;
  private themeSubscription?: Subscription;

  constructor(
    private sipService: SipService,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUser();

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });

    if (!this.currentUser || !this.currentUser.sipExtension) {
      alert('No tienes una extensión SIP asignada. Contacta al administrador.');
      return;
    }

    // Subscribe to registration status
    this.sipService.onRegistered.subscribe((registered: boolean) => {
      this.sipRegistered = registered;
      console.log('SIP Registration status:', registered);
    });

    // Subscribe to call state changes
    this.sipService.onCallStatus.subscribe((state: CallState) => {
      this.callState = state;
      console.log('Call state changed:', state);

      if (state === CallState.ACTIVE) {
        this.startCallTimer();
        this.hasIncomingCall = false;
      } else if (state === CallState.ENDED || state === CallState.IDLE) {
        this.stopCallTimer();
        this.hasIncomingCall = false;
      }
    });

    // Subscribe to incoming calls
    this.sipService.onIncomingCall.subscribe((data: { from: string }) => {
      console.log('📲 Incoming call from:', data.from);
      this.hasIncomingCall = true;
      this.incomingCallNumber = data.from;
    });

    // Subscribe to errors
    this.sipService.onError.subscribe((error: string) => {
      console.error('SIP error:', error);
      alert('Error SIP: ' + error);
    });

    // Register to FreeSWITCH
    try {
      console.log('🔌 Attempting to register to FreeSWITCH...');

      await this.sipService.register(
        this.currentUser.sipExtension,
        this.currentUser.sipPassword || '1234',
        environment.freeswitchWsUrl,
        environment.freeswitchDomain
      );

      // Success! Registration completed (this will only execute if the Promise resolves)
      console.log('✅ Registration to FreeSWITCH completed successfully');
      // The UI will update via the onRegistered subscription

    } catch (error: any) {
      console.error('❌ Failed to register to FreeSWITCH:', error);
      alert('No se pudo conectar a FreeSWITCH:\n\n' +
            (error.message || 'Error desconocido') +
            '\n\nVerifique que FreeSWITCH esté accesible en: ' + environment.freeswitchWsUrl);
    }
  }

  ngOnDestroy() {
    this.stopCallTimer();
    this.themeSubscription?.unsubscribe();
    // ❌ NO unregister here! SIP debe mantenerse activo durante toda la sesión
    // El unregister solo debe ocurrir en logout (app.component.ts:232)
    // this.sipService.unregister();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  pressDialpadButton(digit: string) {
    // Add digit to phone number
    this.phoneNumber += digit;

    // If in a call, send DTMF tone
    if (this.isInCall() && this.currentSession) {
      console.log('Sending DTMF:', digit);
      // TODO: Implement DTMF sending via SIP service
      // this.sipService.sendDTMF(digit);
    }
  }

  deleteLastDigit() {
    this.phoneNumber = this.phoneNumber.slice(0, -1);
  }

  get currentSession() {
    return (this.sipService as any).currentSession;
  }

  async makeCall() {
    if (!this.phoneNumber) {
      alert('Ingresa una extensión o número');
      return;
    }

    try {
      await this.sipService.call(this.phoneNumber);
      console.log('📞 Call initiated to:', this.phoneNumber);
    } catch (error) {
      console.error('Failed to make call:', error);
      alert('Error al hacer la llamada: ' + error);
    }
  }

  hangupCall() {
    this.sipService.hangup();
  }

  answerCall() {
    this.sipService.answer();
    this.hasIncomingCall = false;
  }

  rejectCall() {
    this.sipService.hangup();
    this.hasIncomingCall = false;
  }

  toggleMute() {
    if (this.isMuted) {
      this.sipService.unmute();
      this.isMuted = false;
    } else {
      this.sipService.mute();
      this.isMuted = true;
    }
  }

  canMakeCall(): boolean {
    return this.sipRegistered &&
           this.phoneNumber.length > 0 &&
           this.callState === CallState.IDLE;
  }

  isInCall(): boolean {
    return this.callState === CallState.ACTIVE ||
           this.callState === CallState.CONNECTING ||
           this.callState === CallState.RINGING;
  }

  getStatusText(): string {
    switch (this.callState) {
      case CallState.IDLE: return 'LISTO';
      case CallState.CONNECTING: return 'CONECTANDO...';
      case CallState.RINGING: return 'TIMBRANDO...';
      case CallState.ACTIVE: return 'EN LLAMADA';
      case CallState.HELD: return 'EN ESPERA';
      case CallState.ENDED: return 'FINALIZADA';
      default: return 'DESCONOCIDO';
    }
  }

  getStatusColor(): string {
    switch (this.callState) {
      case CallState.IDLE: return '#6c757d';
      case CallState.CONNECTING: return '#fbbf24';
      case CallState.RINGING: return '#60a5fa';
      case CallState.ACTIVE: return '#10b981';
      case CallState.HELD: return '#fbbf24';
      case CallState.ENDED: return '#dc3545';
      default: return '#6c757d';
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private startCallTimer() {
    this.callDuration = 0;
    this.elapsedTime = 0;
    this.callTimer = setInterval(() => {
      this.callDuration++;
      this.elapsedTime++;
    }, 1000);
  }

  private stopCallTimer() {
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
    this.callDuration = 0;
    this.elapsedTime = 0;
  }
}
