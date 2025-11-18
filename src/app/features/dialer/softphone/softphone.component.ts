import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule } from 'lucide-angular';
import { CallState } from '../../../core/services/webrtc.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-softphone',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, LucideAngularModule, MatTooltipModule],
  templateUrl: './softphone.component.html',
  styleUrls: ['./softphone.component.css']
})
export class SoftphoneComponent {
  @Input() callState: CallState = CallState.IDLE;
  @Input() duration = 0;
  @Input() isMuted = false;
  @Input() phoneNumber = '';
  @Input() canHangup = false;

  @Output() hangupClicked = new EventEmitter<void>();
  @Output() muteClicked = new EventEmitter<void>();
  @Output() holdClicked = new EventEmitter<void>();
  @Output() dtmfClicked = new EventEmitter<string>();

  CallState = CallState;

  getStatusText(): string {
    switch (this.callState) {
      case CallState.IDLE: return 'Ready to call';
      case CallState.CONNECTING: return 'Connecting...';
      case CallState.RINGING: return 'Ringing...';
      case CallState.ACTIVE: return 'In call';
      case CallState.HELD: return 'On hold';
      case CallState.ENDED: return 'Call ended';
      default: return 'Unknown';
    }
  }

  getStatusColor(): string {
    switch (this.callState) {
      case CallState.IDLE: return '#999';
      case CallState.CONNECTING: return '#ff9800';
      case CallState.RINGING: return '#2196f3';
      case CallState.ACTIVE: return '#4caf50';
      case CallState.HELD: return '#ff9800';
      case CallState.ENDED: return '#f44336';
      default: return '#999';
    }
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onHangup(): void {
    this.hangupClicked.emit();
  }

  onMute(): void {
    this.muteClicked.emit();
  }

  onHold(): void {
    this.holdClicked.emit();
  }

  onDTMF(digit: string): void {
    this.dtmfClicked.emit(digit);
  }

  isActive(): boolean {
    return this.callState === CallState.ACTIVE || this.callState === CallState.HELD;
  }

  getLetters(key: string): string {
    const letters: { [key: string]: string } = {
      '2': 'ABC',
      '3': 'DEF',
      '4': 'GHI',
      '5': 'JKL',
      '6': 'MNO',
      '7': 'PQRS',
      '8': 'TUV',
      '9': 'WXYZ'
    };
    return letters[key] || '';
  }
}
