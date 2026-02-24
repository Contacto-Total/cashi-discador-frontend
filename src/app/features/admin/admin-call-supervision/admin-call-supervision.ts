import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { LucideAngularModule } from 'lucide-angular';
import { AdminMonitoringService } from '../../../core/services/admin-monitoring.service';
import { AuthService } from '../../../core/services/auth.service';
import { SipService } from '../../../core/services/sip.service';
import { SupervisionService, SupervisionMode } from '../../../core/services/supervision.service';
import { Subscription, interval } from 'rxjs';

interface ActiveCall {
  callUuid: string;
  agentName: string;
  agentExtension: string;
  clientNumber: string;
  duration: number;
  callState: string;
  campaignName?: string;
}

// SupervisionMode type is imported from supervision.service

@Component({
  selector: 'app-admin-call-supervision',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    LucideAngularModule
  ],
  templateUrl: './admin-call-supervision.html',
  styleUrl: './admin-call-supervision.css'
})
export class AdminCallSupervision implements OnInit, OnDestroy {
  call: ActiveCall | null = null;
  isConnecting = false;
  isMuted = false;
  callDuration = 0;

  private callUuid: string = '';
  private timerSubscription?: Subscription;
  private sipRegistered = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminMonitoringService,
    private authService: AuthService,
    private sipService: SipService,
    public supervisionService: SupervisionService
  ) {}

  // Use the service's mode so it stays in sync with the floating panel
  get currentMode(): SupervisionMode {
    return this.supervisionService.currentMode();
  }

  ngOnInit(): void {
    // Get call UUID from route params
    this.callUuid = this.route.snapshot.paramMap.get('callUuid') || '';

    if (!this.callUuid) {
      console.error('No call UUID provided');
      this.router.navigate(['/admin/monitoring']);
      return;
    }

    // Load call details
    this.loadCallDetails();

    // Initialize SIP for admin (extension 1000) - will auto-answer incoming calls
    this.initializeAdminSip();

    // Start call duration timer
    this.startDurationTimer();
  }

  ngOnDestroy(): void {
    // Stop timer (panel flotante tiene su propio timer)
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    // NO limpiar la supervisión aquí - el panel flotante sigue activo
    // La supervisión solo se limpia cuando el usuario hace click en "Desconectar"
    // en el panel flotante (SupervisionPanelComponent)

    // NO desregistrar SIP ni deshabilitar auto-answer
    // El panel flotante sigue necesitando la conexión SIP activa
  }

  private loadCallDetails(): void {
    this.adminService.getActiveCall(this.callUuid).subscribe({
      next: (call) => {
        this.call = call;
        this.callDuration = call.duration;
      },
      error: (error) => {
        console.error('Error loading call details:', error);
        this.router.navigate(['/admin/monitoring']);
      }
    });
  }

  private initializeAdminSip(): void {
    const currentUser = this.authService.getCurrentUser();
    const adminConfig = {
      extension: currentUser?.sipExtension || '1000',
      password: currentUser?.sipPassword || 'admin1234',
      wsUrl: 'cobranza.contactototal.com.pe:7443',
      domain: 'cobranza.contactototal.com.pe'
    };

    console.log('🔧 Initializing admin SIP with extension 1000');

    // Enable auto-answer mode BEFORE registering (no ringtone, instant answer)
    this.sipService.enableAutoAnswer();

    // Register SIP silently
    this.sipService.register(
      adminConfig.extension,
      adminConfig.password,
      adminConfig.wsUrl,
      adminConfig.domain
    ).then(() => {
      console.log('✅ Admin SIP registered successfully with auto-answer enabled');
      this.sipRegistered = true;
    }).catch((error: any) => {
      console.error('❌ Admin SIP registration failed:', error);
    });
  }

  private startDurationTimer(): void {
    // Update call duration every second
    this.timerSubscription = interval(1000).subscribe(() => {
      this.callDuration++;
    });
  }

  // Select or change to a supervision mode
  selectMode(mode: SupervisionMode): void {
    if (this.currentMode === mode) return; // Already in this mode
    if (this.isConnecting) return;

    // If already in a mode, change to the new mode
    if (this.currentMode !== 'none') {
      this.changeToMode(mode);
      return;
    }

    // Start fresh supervision
    this.startMode(mode);
  }

  // Start a new supervision session
  private startMode(mode: SupervisionMode): void {
    this.isConnecting = true;
    console.log(`🎯 Starting ${mode.toUpperCase()} mode for call:`, this.callUuid);

    const serviceCall = mode === 'spy' ? this.adminService.spyCall(this.callUuid)
                      : mode === 'whisper' ? this.adminService.whisperCall(this.callUuid)
                      : this.adminService.bargeCall(this.callUuid);

    serviceCall.subscribe({
      next: () => {
        console.log(`✅ ${mode.toUpperCase()} mode activated`);
        this.isConnecting = false;

        // Update SupervisionService state - this sets the mode globally
        if (this.call) {
          this.supervisionService.startSupervision(this.callUuid, mode, {
            agentName: this.call.agentName,
            agentExtension: this.call.agentExtension,
            clientNumber: this.call.clientNumber
          });
        }
      },
      error: (error) => {
        console.error(`❌ Error starting ${mode} mode:`, error);
        this.isConnecting = false;
        const modeLabels: Record<string, string> = { spy: 'Vigía', whisper: 'Susurro', barge: 'Tripartita' };
        alert(`Error al iniciar modo ${modeLabels[mode] || mode}`);
      }
    });
  }

  // Change from one mode to another
  private changeToMode(newMode: SupervisionMode): void {
    this.isConnecting = true;
    console.log(`🔄 Changing mode from ${this.currentMode} to ${newMode}`);

    this.supervisionService.changeMode(newMode).subscribe({
      next: () => {
        console.log(`✅ Mode changed to ${newMode.toUpperCase()}`);
        this.supervisionService.updateMode(newMode);
        this.isConnecting = false;
      },
      error: (error) => {
        console.error('❌ Error changing mode:', error);
        this.isConnecting = false;
        alert('Error al cambiar modo de supervisión');
      }
    });
  }

  // Disconnect from supervision
  disconnectSupervision(): void {
    console.log('🔌 Disconnecting from supervision');

    // Hangup admin's call
    this.sipService.hangup();

    // Clear global supervision state (this resets the mode to 'none')
    this.supervisionService.stopSupervision();

    this.isMuted = false;
  }

  // Toggle mute/unmute
  toggleMute(): void {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.sipService.mute();
    } else {
      this.sipService.unmute();
    }

    console.log(this.isMuted ? '🔇 Muted' : '🔊 Unmuted');
  }

  // Go back to monitoring list
  goBack(): void {
    this.router.navigate(['/admin/monitoring']);
  }

  // Format duration as MM:SS
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Get mode label in Spanish
  getModeLabel(): string {
    switch (this.currentMode) {
      case 'spy': return 'Modo Vigía';
      case 'whisper': return 'Modo Susurro';
      case 'barge': return 'Modo Tripartita';
      default: return 'Sin conexión';
    }
  }

  // Get mode description
  getModeDescription(): string {
    switch (this.currentMode) {
      case 'spy': return 'Escuchando la llamada en silencio';
      case 'whisper': return 'Hablando solo con el agente';
      case 'barge': return 'Conectado con todos los participantes';
      default: return 'Selecciona un modo para comenzar';
    }
  }

  // Get mode icon
  getModeIcon(): string {
    switch (this.currentMode) {
      case 'spy': return 'eye';
      case 'whisper': return 'ear';
      case 'barge': return 'users';
      default: return 'radio';
    }
  }

  // Get mode color
  getModeColor(): string {
    switch (this.currentMode) {
      case 'spy': return 'accent';
      case 'whisper': return 'primary';
      case 'barge': return 'warn';
      default: return '';
    }
  }

  /**
   * Format phone number from FreeSWITCH format to readable format
   * Input: 215251913254120 -> Output: +51 913 254 120
   */
  formatPhoneNumber(rawNumber: string): string {
    if (!rawNumber) return '';

    // Remove any non-digit characters
    const digits = rawNumber.replace(/\D/g, '');

    // Get the last 9 digits (phone number)
    if (digits.length >= 11) {
      const phoneNumber = digits.slice(-9);
      // Get country code (2 digits before the phone number)
      const countryCode = digits.slice(-11, -9);

      // Format: +51 913 254 120
      return `+${countryCode} ${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`;
    }

    // If number is shorter, just return last 9 digits formatted
    if (digits.length >= 9) {
      const phoneNumber = digits.slice(-9);
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`;
    }

    // Return as-is if too short
    return rawNumber;
  }
}
