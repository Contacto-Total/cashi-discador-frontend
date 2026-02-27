import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule } from 'lucide-angular';

export interface ErrorModalData {
  title?: string;
  message: string;
  details?: string;
}

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    LucideAngularModule
  ],
  template: `
    <div class="modal-container">
      <!-- Icon -->
      <div class="icon-wrapper">
        <div class="icon-bg">
          <lucide-angular
            [name]="isCallError ? 'phone-off' : 'alert-circle'"
            [size]="32"
            class="icon">
          </lucide-angular>
        </div>
      </div>

      <!-- Title -->
      <h2 class="title">{{ data.title || 'Error' }}</h2>

      <!-- Message -->
      <p class="message">{{ data.message }}</p>

      <!-- Details -->
      <div *ngIf="data.details" class="details">
        <p>{{ data.details }}</p>
      </div>

      <!-- Button -->
      <button class="btn" (click)="close()">
        Entendido
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .modal-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 28px 24px;
      text-align: center;
      min-width: 320px;
    }

    .icon-wrapper {
      margin-bottom: 20px;
    }

    .icon-bg {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon {
      color: #dc2626;
    }

    .title {
      margin: 0 0 8px;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      letter-spacing: -0.025em;
    }

    .message {
      margin: 0 0 24px;
      font-size: 0.938rem;
      color: #6b7280;
      line-height: 1.5;
      max-width: 340px;
    }

    .details {
      width: 100%;
      margin-bottom: 24px;
      padding: 10px 14px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .details p {
      margin: 0;
      font-size: 0.813rem;
      color: #9ca3af;
      font-family: 'SF Mono', 'Fira Code', monospace;
      word-break: break-word;
    }

    .btn {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: #111827;
      color: white;
      font-size: 0.938rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }

    .btn:hover {
      background: #1f2937;
    }

    .btn:active {
      transform: scale(0.98);
    }
  `]
})
export class ErrorModalComponent {
  isCallError = false;

  constructor(
    public dialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorModalData
  ) {
    this.isCallError = (data.title || '').toLowerCase().includes('llamada');
  }

  close(): void {
    this.dialogRef.close();
  }
}
