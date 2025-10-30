import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SipService, CallState } from '../../../core/services/sip.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-active-call-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="active-call-modal">
      <h2 mat-dialog-title>
        <mat-icon class="call-icon">phone_in_talk</mat-icon>
        En Llamada
      </h2>
      <mat-dialog-content>
        <p class="caller-info">Con: <strong>{{ data.from }}</strong></p>
        <p class="duration">{{ callDuration }}</p>
        <p class="status">{{ callStatus }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-raised-button [color]="isMuted ? 'accent' : 'primary'" (click)="toggleMute()">
          <mat-icon>{{ isMuted ? 'mic_off' : 'mic' }}</mat-icon>
          {{ isMuted ? 'Activar Mic' : 'Silenciar' }}
        </button>
        <button mat-raised-button color="warn" (click)="hangup()">
          <mat-icon>call_end</mat-icon>
          Colgar
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .active-call-modal {
      text-align: center;
      padding: 20px;
      min-width: 350px;
    }

    h2 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #4CAF50;
    }

    .call-icon {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .caller-info {
      font-size: 18px;
      margin: 15px 0;
    }

    .duration {
      font-size: 24px;
      font-weight: bold;
      color: #4CAF50;
      margin: 10px 0;
    }

    .status {
      font-size: 14px;
      color: #666;
      font-style: italic;
    }

    mat-dialog-actions {
      gap: 10px;
      padding: 20px 0;
      flex-wrap: wrap;
    }

    button {
      min-width: 100px;
    }
  `]
})
export class ActiveCallModalComponent implements OnInit, OnDestroy {
  callDuration: string = '00:00';
  callStatus: string = 'Conectado';
  isMuted: boolean = false;

  private startTime: Date = new Date();
  private timerSubscription?: Subscription;
  private callStateSubscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<ActiveCallModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { from: string },
    private sipService: SipService
  ) {}

  ngOnInit(): void {
    // Start call duration timer
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateCallDuration();
    });

    // Subscribe to call state changes
    this.callStateSubscription = this.sipService.onCallStatus.subscribe(state => {
      if (state === CallState.ENDED) {
        this.callStatus = 'Llamada finalizada';
        setTimeout(() => {
          this.dialogRef.close();
        }, 1000);
      } else if (state === CallState.ACTIVE) {
        this.callStatus = 'Conectado';
      }
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.callStateSubscription?.unsubscribe();
  }

  private updateCallDuration(): void {
    const now = new Date();
    const diff = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    this.callDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  toggleMute(): void {
    if (this.isMuted) {
      this.sipService.unmute();
      this.isMuted = false;
      this.callStatus = 'Conectado';
    } else {
      this.sipService.mute();
      this.isMuted = true;
      this.callStatus = 'Micrófono silenciado';
    }
  }

  hangup(): void {
    this.sipService.hangup();
    this.dialogRef.close();
  }
}
