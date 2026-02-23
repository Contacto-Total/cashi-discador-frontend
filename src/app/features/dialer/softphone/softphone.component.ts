import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
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
  @Output() callClicked = new EventEmitter<string>();

  CallState = CallState;
  dialedNumber = '';

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
    if (this.callState === CallState.IDLE) {
      // En modo idle, agregar al número marcado
      this.dialedNumber += digit;
    } else {
      // En llamada, enviar DTMF
      this.dtmfClicked.emit(digit);
    }
  }

  onCall(): void {
    if (this.dialedNumber.trim()) {
      this.callClicked.emit(this.dialedNumber);
    }
  }

  onBackspace(): void {
    if (this.dialedNumber.length > 0) {
      this.dialedNumber = this.dialedNumber.slice(0, -1);
    }
  }

  onClear(): void {
    this.dialedNumber = '';
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

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.callState !== CallState.IDLE) return;

    const tag = (event.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const key = event.key;

    if (/^[0-9*#]$/.test(key)) {
      event.preventDefault();
      this.dialedNumber += key;
    } else if (key === 'Backspace') {
      event.preventDefault();
      this.onBackspace();
    } else if (key === 'Enter' && this.dialedNumber) {
      event.preventDefault();
      this.onCall();
    }
  }

  @HostListener('window:paste', ['$event'])
  handlePaste(event: ClipboardEvent): void {
    if (this.callState !== CallState.IDLE) return;

    const tag = (event.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') || '';
    const cleaned = pasted.replace(/[^0-9*#]/g, '');
    this.dialedNumber += cleaned;
  }
}
