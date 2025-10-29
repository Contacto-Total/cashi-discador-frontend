import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CallService } from '../../../core/services/call.service';
import { ContactService } from '../../../core/services/contact.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { WebrtcService, CallState } from '../../../core/services/webrtc.service';
import { AgentService } from '../../../core/services/agent.service';
import { Contact } from '../../../core/models/contact.model';
import { Call, CallEvent, CallEventType, CallStatus, MakeCallRequest } from '../../../core/models/call.model';
import { AgentState } from '../../../core/models/agent-status.model';
import { SoftphoneComponent } from '../softphone/softphone.component';
import { ContactCardComponent } from '../contact-card/contact-card.component';
import { CallNotesComponent } from '../call-notes/call-notes.component';
import { CallHistoryComponent } from '../call-history/call-history.component';

@Component({
  selector: 'app-dialer-main',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    SoftphoneComponent,
    ContactCardComponent,
    CallNotesComponent,
    CallHistoryComponent
  ],
  templateUrl: './dialer-main.component.html',
  styleUrls: ['./dialer-main.component.css']
})
export class DialerMainComponent implements OnInit, OnDestroy {
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  currentContact: Contact | null = null;
  currentCall: Call | null = null;
  agentStatus: AgentState = AgentState.DISPONIBLE;
  campaignId: number | null = null;

  callState: CallState = CallState.IDLE;
  callDuration = 0;
  callTimer: any = null;

  loading = false;
  showNotesForm = false;

  private subscriptions: Subscription[] = [];
  public agentId: number;

  constructor(
      public  authService: AuthService,
    private callService: CallService,
    private contactService: ContactService,
    private websocketService: WebsocketService,
    private webrtcService: WebrtcService,
    private agentService: AgentService
  ) {
    this.agentId = this.authService.getCurrentUserId() || 0;
  }

  ngOnInit(): void {
    this.initializeDialer();
    this.subscribeToWebSocket();
    this.subscribeToWebRTC();
    this.loadNextContact();
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

  hangupCall(): void {
    if (!this.currentCall) {
      return;
    }

    // Hangup via WebRTC
    this.webrtcService.hangupCall();

    // Hangup via backend
    this.callService.hangupCall(this.currentCall.callId).subscribe({
      next: () => {
        console.log('Call hung up successfully');
      },
      error: (error) => {
        console.error('Error hanging up call:', error);
      }
    });

    this.stopCallTimer();
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

  canMakeCall(): boolean {
    return this.callState === CallState.IDLE && this.currentContact !== null && !this.loading;
  }

  isInCall(): boolean {
    return this.callState === CallState.ACTIVE || this.callState === CallState.CONNECTING || this.callState === CallState.RINGING;
  }
}
