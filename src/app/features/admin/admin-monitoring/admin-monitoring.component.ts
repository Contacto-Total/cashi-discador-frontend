import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { Subscription, interval } from 'rxjs';
import { AdminMonitoringService, ActiveCall } from '../../../core/services/admin-monitoring.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './admin-monitoring.component.html',
  styleUrls: ['./admin-monitoring.component.css']
})
export class AdminMonitoringComponent implements OnInit, OnDestroy {
  activeCalls: ActiveCall[] = [];
  loading = true;
  currentUser: any = null;
  currentMonitoringCall: string | null = null;
  currentAdminCallUuid: string | null = null;

  displayedColumns: string[] = ['agent', 'client', 'duration', 'state', 'campaign', 'actions'];

  private subscriptions: Subscription[] = [];
  private refreshInterval: any;

  constructor(
    private adminMonitoringService: AdminMonitoringService,
    private websocketService: WebsocketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadActiveCalls();
    this.subscribeToWebSocket();

    // Refresh every 5 seconds
    this.refreshInterval = setInterval(() => {
      this.loadActiveCalls();
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadActiveCalls(): void {
    this.adminMonitoringService.getActiveCalls().subscribe({
      next: (calls) => {
        this.activeCalls = calls;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading active calls:', error);
        this.loading = false;
      }
    });
  }

  subscribeToWebSocket(): void {
    // Subscribe to admin calls topic for real-time updates
    const callsSub = this.websocketService.subscribe('/topic/admin/calls').subscribe({
      next: (event: any) => {
        console.log('Admin call event received:', event);
        this.handleCallEvent(event);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      }
    });

    // Subscribe to monitoring events
    const monitoringSub = this.websocketService.subscribe('/topic/admin/monitoring').subscribe({
      next: (event: any) => {
        console.log('Monitoring event received:', event);
        this.handleMonitoringEvent(event);
      },
      error: (error) => {
        console.error('WebSocket monitoring error:', error);
      }
    });

    this.subscriptions.push(callsSub, monitoringSub);
  }

  handleCallEvent(event: any): void {
    const callData = event.data || event;

    if (callData.callState === 'ENDED') {
      // Remove ended call
      this.activeCalls = this.activeCalls.filter(c => c.callUuid !== callData.callUuid);
    } else {
      // Update or add call
      const index = this.activeCalls.findIndex(c => c.callUuid === callData.callUuid);
      if (index >= 0) {
        this.activeCalls[index] = callData;
      } else {
        this.activeCalls.push(callData);
      }
    }
  }

  handleMonitoringEvent(event: any): void {
    console.log('Monitoring event:', event);
    // Could show notifications here
  }

  startSpyMode(call: ActiveCall): void {
    if (!this.currentUser || this.currentMonitoringCall) {
      return;
    }

    console.log('Starting SPY mode for call:', call.callUuid);

    this.adminMonitoringService.startSpyMode({
      callUuid: call.callUuid,
      adminExtension: '1003', // TODO: Get from current user
      adminUsername: this.currentUser.username
    }).subscribe({
      next: (response) => {
        console.log('SPY mode started:', response);
        this.currentMonitoringCall = call.callUuid;
        this.currentAdminCallUuid = response.adminCallUuid;
        alert(`Modo VIGÍA activado. Escucha la llamada sin ser oído.`);
      },
      error: (error) => {
        console.error('Error starting SPY mode:', error);
        alert('Error al activar modo VIGÍA');
      }
    });
  }

  startWhisperMode(call: ActiveCall): void {
    if (!this.currentUser || this.currentMonitoringCall) {
      return;
    }

    console.log('Starting WHISPER mode for call:', call.callUuid);

    this.adminMonitoringService.startWhisperMode({
      callUuid: call.callUuid,
      adminExtension: '1003', // TODO: Get from current user
      adminUsername: this.currentUser.username
    }).subscribe({
      next: (response) => {
        console.log('WHISPER mode started:', response);
        this.currentMonitoringCall = call.callUuid;
        this.currentAdminCallUuid = response.adminCallUuid;
        alert(`Modo SUSURRO activado. Solo el agente puede escucharte.`);
      },
      error: (error) => {
        console.error('Error starting WHISPER mode:', error);
        alert('Error al activar modo SUSURRO');
      }
    });
  }

  startBargeMode(call: ActiveCall): void {
    if (!this.currentUser || this.currentMonitoringCall) {
      return;
    }

    console.log('Starting BARGE mode for call:', call.callUuid);

    this.adminMonitoringService.startBargeMode({
      callUuid: call.callUuid,
      adminExtension: '1003', // TODO: Get from current user
      adminUsername: this.currentUser.username
    }).subscribe({
      next: (response) => {
        console.log('BARGE mode started:', response);
        this.currentMonitoringCall = call.callUuid;
        this.currentAdminCallUuid = response.adminCallUuid;
        alert(`Modo TRIPARTITA activado. Todos pueden escucharte.`);
      },
      error: (error) => {
        console.error('Error starting BARGE mode:', error);
        alert('Error al activar modo TRIPARTITA');
      }
    });
  }

  stopMonitoring(call: ActiveCall): void {
    if (!this.currentMonitoringCall || !this.currentAdminCallUuid) {
      return;
    }

    console.log('Stopping monitoring for call:', call.callUuid);

    this.adminMonitoringService.stopMonitoring(
      call.callUuid,
      this.currentAdminCallUuid,
      this.currentUser.username
    ).subscribe({
      next: (response) => {
        console.log('Monitoring stopped:', response);
        this.currentMonitoringCall = null;
        this.currentAdminCallUuid = null;
        alert('Monitoreo detenido');
      },
      error: (error) => {
        console.error('Error stopping monitoring:', error);
        alert('Error al detener monitoreo');
      }
    });
  }

  isMonitoring(call: ActiveCall): boolean {
    return this.currentMonitoringCall === call.callUuid;
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getStateIcon(state: string): string {
    switch (state) {
      case 'RINGING': return 'phone_in_talk';
      case 'ANSWERED': return 'call';
      case 'ACTIVE': return 'call';
      default: return 'phone';
    }
  }

  getStateColor(state: string): string {
    switch (state) {
      case 'RINGING': return 'accent';
      case 'ANSWERED': return 'primary';
      case 'ACTIVE': return 'primary';
      default: return '';
    }
  }

  /**
   * Navigate to supervision detail view
   */
  superviseCall(call: ActiveCall): void {
    this.router.navigate(['/admin/supervision', call.callUuid]);
  }
}
