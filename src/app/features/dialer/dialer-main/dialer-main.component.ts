import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule } from 'lucide-angular';
import { MatChipsModule } from '@angular/material/chips';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CallService } from '../../../core/services/call.service';
import { ContactService } from '../../../core/services/contact.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { WebrtcService, CallState } from '../../../core/services/webrtc.service';
import { AgentService } from '../../../core/services/agent.service';
import { SipService } from '../../../core/services/sip.service';
import { ErrorModalService } from '../../../shared/services/error-modal.service';
import { Contact } from '../../../core/models/contact.model';
import { Call, CallEvent, CallEventType, CallStatus, MakeCallRequest } from '../../../core/models/call.model';
import { AgentState } from '../../../core/models/agent-status.model';
import { SoftphoneComponent } from '../softphone/softphone.component';

@Component({
  selector: 'app-dialer-main',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    LucideAngularModule,
    MatChipsModule,
    SoftphoneComponent
  ],
  templateUrl: './dialer-main.component.html',
  styleUrls: ['./dialer-main.component.css']
})
export class DialerMainComponent implements OnInit, OnDestroy {
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  currentContact: Contact | null = null;
  currentCall: Call | null = null;
  agentStatus: AgentState = AgentState.DISPONIBLE;
  campaignId: number | null = null; // No campaign required for manual dialing

  callState: CallState = CallState.IDLE;
  callDuration = 0;
  callTimer: any = null;

  loading = false;
  showNotesForm = false;

  private subscriptions: Subscription[] = [];
  public agentId: number = 0;

  constructor(
      public  authService: AuthService,
    private callService: CallService,
    private contactService: ContactService,
    private websocketService: WebsocketService,
    private webrtcService: WebrtcService,
    private agentService: AgentService,
    private sipService: SipService,
    private errorModalService: ErrorModalService
  ) {}

  ngOnInit(): void {
    // Get agentId from currentUser$ Observable
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.agentId = user.id;
        console.log('Agent ID loaded:', this.agentId);
      }
    });

    this.initializeDialer();
    this.subscribeToWebSocket();
    this.subscribeToWebRTC();
    // Don't load next contact in manual dialer - user enters number manually
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.stopCallTimer();
    this.webrtcService.cleanup();
  }

  async initializeDialer(): Promise<void> {
    try {
      await this.webrtcService.initialize();
      console.log('WebRTC initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
    }
  }

  subscribeToWebSocket(): void {
    // Subscribe to call events for this agent
    const callsSub = this.websocketService.subscribe('/user/queue/calls').subscribe({
      next: (event: CallEvent) => {
        this.handleCallEvent(event);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      }
    });

    this.subscriptions.push(callsSub);
  }

  subscribeToWebRTC(): void {
    // Subscribe to WebRTC call state changes
    this.webrtcService.onCallStatus.subscribe((state: CallState) => {
      this.callState = state;
      console.log('Call state changed:', state);
    });

    // Subscribe to remote audio stream
    this.webrtcService.onRemoteStream.subscribe((stream: MediaStream) => {
      if (this.audioElement && this.audioElement.nativeElement) {
        this.audioElement.nativeElement.srcObject = stream;
        this.audioElement.nativeElement.play();
      }
    });

    // Subscribe to errors
    this.webrtcService.onError.subscribe((error: string) => {
      console.error('WebRTC error:', error);
      alert(error);
    });

    // Subscribe to SIP call status changes
    this.sipService.onCallStatus.subscribe((state: CallState) => {
      console.log('SIP call state changed:', state);

      // If call ended and timer never started, client never answered
      if (state === CallState.ENDED && this.currentCall !== null && this.callTimer === null) {
        const cause = this.sipService.lastHangupCause;
        const message = this.translateSipError(cause);
        console.log('SIP call ended without client answering - cause:', cause);
        this.errorModalService.showError(message, 'Llamada No Conectada');
        this.callState = CallState.IDLE;
        this.loading = false;
        this.currentCall = null;
        return;
      }

      this.callState = state;
    });

    // Subscribe to SIP errors (call failed, rejected, etc.)
    this.sipService.onError.subscribe((error: string) => {
      console.error('SIP error:', error);
      const message = this.translateSipError(error);
      this.errorModalService.showError(message, 'Llamada No Conectada');
      this.callState = CallState.IDLE;
      this.loading = false;
      this.stopCallTimer();
    });
  }

  handleCallEvent(event: CallEvent): void {
    console.log('Received call event:', event);

    switch (event.type) {
      case CallEventType.CALL_RINGING:
        this.callState = CallState.RINGING;
        break;

      case CallEventType.CALL_CONNECTED:
        this.callState = CallState.ACTIVE;
        this.startCallTimer();
        break;

      case CallEventType.CALL_ENDED:
        this.onCallEnded();
        break;

      case CallEventType.NEW_CONTACT_ASSIGNED:
        if (event.data && event.data.contact) {
          this.currentContact = event.data.contact;
        }
        break;
    }
  }

  loadNextContact(): void {
    if (!this.campaignId) {
      console.log('No campaign selected');
      return;
    }

    this.loading = true;
    this.contactService.getNextContact(this.campaignId, this.agentId).subscribe({
      next: (contact) => {
        this.currentContact = contact;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading next contact:', error);
        this.loading = false;
      }
    });
  }

  async makeCall(): Promise<void> {
    if (!this.currentContact) {
      alert('No contact available');
      return;
    }

    this.loading = true;

    const request: MakeCallRequest = {
      agentId: this.agentId,
      phoneNumber: this.currentContact.phoneNumber,
      contactId: this.currentContact.id,
      campaignId: this.campaignId || undefined
    };

    try {
      // Make call via backend
      this.callService.makeCall(request).subscribe({
        next: (call) => {
          this.currentCall = call;
          this.callState = CallState.CONNECTING;

          // Initiate WebRTC call
          this.webrtcService.makeCall(this.currentContact!.phoneNumber).then(() => {
            console.log('WebRTC call initiated');
            this.loading = false;
          }).catch((error) => {
            console.error('WebRTC call failed:', error);
            this.loading = false;
          });
        },
        error: (error) => {
          console.error('Error making call:', error);
          alert('Failed to make call: ' + (error.error?.message || 'Unknown error'));
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error in makeCall:', error);
      this.loading = false;
    }
  }

  async makeCallWithNumber(phoneNumber: string): Promise<void> {
    // Validar longitud: solo 7 (fijo) o 9 (celular) dígitos
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length !== 7 && digits.length !== 9) {
      this.errorModalService.showError(
        'El número debe tener 7 dígitos (fijo) o 9 dígitos (celular)',
        'Número Inválido'
      );
      return;
    }

    this.loading = true;

    // Guardar el número de destino ANTES de iniciar la llamada
    // para que collection-management pueda cargar datos del cliente
    this.sipService.setCurrentOutgoingNumber(phoneNumber);

    const request: MakeCallRequest = {
      agentId: this.agentId,
      phoneNumber: phoneNumber,
      contactId: undefined,
      campaignId: this.campaignId || undefined
    };

    try {
      // Make call via backend
      this.callService.makeCall(request).subscribe({
        next: (call) => {
          this.currentCall = call;
          this.callState = CallState.CONNECTING;

          // Create a temporary contact for display
          this.currentContact = {
            id: 0,
            phoneNumber: phoneNumber,
            firstName: '',
            lastName: '',
            campaignId: 0,
            status: 'PENDING'
          } as Contact;

          // Initiate WebRTC call
          this.webrtcService.makeCall(phoneNumber).then(() => {
            console.log('WebRTC call initiated');
            this.loading = false;
          }).catch((error) => {
            console.error('WebRTC call failed:', error);
            this.loading = false;
          });
        },
        error: (error) => {
          console.error('Error making call:', error);
          alert('Failed to make call: ' + (error.error?.message || 'Unknown error'));
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error in makeCall:', error);
      this.loading = false;
    }
  }

  hangupCall(): void {
    // Hangup via SIP (terminates FreeSWITCH leg)
    this.sipService.hangup();

    // Hangup via WebRTC
    this.webrtcService.hangupCall();

    // Hangup via backend
    if (this.currentCall) {
      this.callService.hangupCall(this.currentCall.callId).subscribe({
        next: () => {
          console.log('Call hung up successfully');
        },
        error: (error) => {
          console.error('Error hanging up call:', error);
        }
      });
    }

    this.stopCallTimer();
    this.callState = CallState.IDLE;
    this.loading = false;
    this.currentCall = null;
  }

  onCallEnded(): void {
    this.callState = CallState.ENDED;
    this.stopCallTimer();
    this.showNotesForm = true;
  }

  onNotesComplete(): void {
    this.showNotesForm = false;
    this.currentCall = null;
    this.currentContact = null;
    this.callDuration = 0;
    this.callState = CallState.IDLE;

    // Load next contact
    this.loadNextContact();
  }

  skipContact(): void {
    if (confirm('Are you sure you want to skip this contact?')) {
      this.loadNextContact();
    }
  }

  startCallTimer(): void {
    this.callDuration = 0;
    this.callTimer = setInterval(() => {
      this.callDuration++;
    }, 1000);
  }

  stopCallTimer(): void {
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
  }

  formatTimer(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getAgentStatusLabel(): string {
    return this.agentStatus;
  }

  getAgentStatusColor(): string {
    switch (this.agentStatus) {
      case AgentState.DISPONIBLE: return '#4caf50';
      case AgentState.EN_LLAMADA: return '#f44336';
      case AgentState.REFRIGERIO: return '#ff9800';
      default: return '#999';
    }
  }

  toggleMute(): void {
    const isMuted = this.webrtcService.toggleMute();
    console.log('Mute toggled:', isMuted);
  }

  isMuted(): boolean {
    return this.webrtcService.isMicMuted();
  }

  get displayCallState(): CallState {
    // SIP ACTIVE = agent connected to FreeSWITCH, but client may not have answered
    // Show RINGING until client actually answers (callTimer starts)
    if (this.callState === CallState.ACTIVE && this.callTimer === null) {
      return CallState.RINGING;
    }
    return this.callState;
  }

  canMakeCall(): boolean {
    return this.callState === CallState.IDLE && this.currentContact !== null && !this.loading;
  }

  isInCall(): boolean {
    return this.callState === CallState.ACTIVE || this.callState === CallState.CONNECTING || this.callState === CallState.RINGING;
  }

  private translateSipError(error: string): string {
    if (!error) return 'El cliente no contestó la llamada';
    const normalized = error.toLowerCase().replace(/_/g, ' ');
    // JsSIP generic causes - in this context (callTimer null) means client didn't answer
    if (normalized === 'terminated' || normalized === 'bye') return 'El cliente no contestó la llamada';
    // FreeSWITCH Q.850 causes
    if (normalized.includes('normal clearing')) return 'El cliente no contestó la llamada';
    if (normalized.includes('no answer')) return 'El cliente no contestó la llamada';
    if (normalized.includes('no user response')) return 'El cliente no contestó la llamada';
    if (normalized.includes('busy') || normalized.includes('user busy')) return 'La línea está ocupada';
    if (normalized.includes('rejected') || normalized.includes('decline') || normalized.includes('call rejected')) return 'La llamada fue rechazada';
    if (normalized.includes('not found') || normalized.includes('unallocated') || normalized.includes('invalid number')) return 'Número no válido o no existe';
    if (normalized.includes('unavailable') || normalized.includes('subscriber absent')) return 'El número no está disponible';
    if (normalized.includes('request timeout') || normalized.includes('recovery on timer')) return 'Tiempo de espera agotado';
    if (normalized.includes('originator cancel')) return 'La llamada fue cancelada';
    if (normalized.includes('network') || normalized.includes('congestion')) return 'Error de red, intente de nuevo';
    return 'El cliente no contestó la llamada';
  }
}
