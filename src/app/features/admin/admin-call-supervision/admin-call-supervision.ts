import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminMonitoringService } from '../../../core/services/admin-monitoring.service';
import { SipService } from '../../../core/services/sip.service';
import { Subscription, interval } from 'rxjs';

interface ActiveCall {
  callUuid: string;
  agentName: string;
  agentExtension: string;
  clientNumber: string;
  duration: number;
  callState: string;  // Changed from 'state' to 'callState' to match service
}

type SupervisionMode = 'none' | 'spy' | 'whisper' | 'barge';

@Component({
  selector: 'app-admin-call-supervision',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-call-supervision.html',
  styleUrl: './admin-call-supervision.css'
})
export class AdminCallSupervision implements OnInit, OnDestroy {
  call: ActiveCall | null = null;
  currentMode: SupervisionMode = 'none';
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
    private sipService: SipService
  ) {}

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
    // Stop timer
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    // Disconnect from call if connected
    if (this.currentMode !== 'none') {
      this.disconnectSupervision();
    }

    // Disable auto-answer mode
    this.sipService.disableAutoAnswer();

    // Unregister SIP
    if (this.sipRegistered) {
      this.sipService.unregister();
    }
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
    // Admin credentials (extension 1000)
    const adminConfig = {
      extension: '1000',
      password: 'admin1234',
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

  // Spy Mode (Vigía) - Admin listens only
  startSpyMode(): void {
    if (this.currentMode !== 'none') {
      alert('Ya estás en modo de supervisión. Desconecta primero.');
      return;
    }

    this.isConnecting = true;
    console.log('🕵️ Starting SPY mode for call:', this.callUuid);

    this.adminService.spyCall(this.callUuid).subscribe({
      next: () => {
        console.log('✅ SPY mode activated');
        this.currentMode = 'spy';
        this.isConnecting = false;
      },
      error: (error) => {
        console.error('❌ Error starting spy mode:', error);
        this.isConnecting = false;
        alert('Error al iniciar modo Vigía');
      }
    });
  }

  // Whisper Mode (Susurro) - Admin speaks to agent only
  startWhisperMode(): void {
    if (this.currentMode !== 'none') {
      alert('Ya estás en modo de supervisión. Desconecta primero.');
      return;
    }

    this.isConnecting = true;
    console.log('🗣️ Starting WHISPER mode for call:', this.callUuid);

    this.adminService.whisperCall(this.callUuid).subscribe({
      next: () => {
        console.log('✅ WHISPER mode activated');
        this.currentMode = 'whisper';
        this.isConnecting = false;
      },
      error: (error) => {
        console.error('❌ Error starting whisper mode:', error);
        this.isConnecting = false;
        alert('Error al iniciar modo Susurro');
      }
    });
  }

  // Barge Mode (Tripartita) - Admin joins as full participant
  startBargeMode(): void {
    if (this.currentMode !== 'none') {
      alert('Ya estás en modo de supervisión. Desconecta primero.');
      return;
    }

    this.isConnecting = true;
    console.log('📞 Starting BARGE mode for call:', this.callUuid);

    this.adminService.bargeCall(this.callUuid).subscribe({
      next: () => {
        console.log('✅ BARGE mode activated');
        this.currentMode = 'barge';
        this.isConnecting = false;
      },
      error: (error) => {
        console.error('❌ Error starting barge mode:', error);
        this.isConnecting = false;
        alert('Error al iniciar modo Tripartita');
      }
    });
  }

  // Disconnect from supervision
  disconnectSupervision(): void {
    console.log('🔌 Disconnecting from supervision');

    // Hangup admin's call
    this.sipService.hangup();

    this.currentMode = 'none';
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
      case 'spy': return 'Vigía';
      case 'whisper': return 'Susurro';
      case 'barge': return 'Tripartita';
      default: return 'Sin conexión';
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
}
