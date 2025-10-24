import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Contact } from '../../../core/models/contact.model';

@Component({
  selector: 'app-contact-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent {
  @Input() contact: Contact | null = null;
  @Input() loading = false;
  @Input() canCall = false;

  @Output() callClicked = new EventEmitter<void>();
  @Output() skipClicked = new EventEmitter<void>();

  onCall(): void {
    this.callClicked.emit();
  }

  onSkip(): void {
    this.skipClicked.emit();
  }

  getFullName(): string {
    if (!this.contact) return '';
    return `${this.contact.firstName} ${this.contact.lastName}`;
  }

  getContactInitials(): string {
    if (!this.contact) return '?';
    const first = this.contact.firstName.charAt(0).toUpperCase();
    const last = this.contact.lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  }
}
