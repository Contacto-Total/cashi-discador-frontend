import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule } from 'lucide-angular';

export interface SuccessModalData {
  title?: string;
  message: string;
  details?: string;
}

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    LucideAngularModule
  ],
  template: `
    <div class="success-modal">
      <div class="success-header">
        <div class="success-icon-container">
          <lucide-angular name="check-circle" [size]="48" class="success-icon"></lucide-angular>
        </div>
        <h2 mat-dialog-title>{{ data.title || 'Éxito' }}</h2>
      </div>

      <mat-dialog-content>
        <p class="success-message">{{ data.message }}</p>
        <p *ngIf="data.details" class="success-details">{{ data.details }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-raised-button color="primary" (click)="close()">
          <lucide-angular name="check" [size]="18"></lucide-angular>
          Entendido
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .success-modal {
      min-width: 400px;
      max-width: 500px;
      padding: 24px;
      background: white;
      border-radius: 12px;
    }

    .success-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      text-align: center;
    }

    .success-icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      animation: successPulse 1.5s ease-in-out;
    }

    @keyframes successPulse {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .success-icon {
      color: white;
      width: 48px;
      height: 48px;
    }

    h2 {
      margin: 0;
      color: #1f2937;
      font-size: 1.5rem;
      font-weight: 600;
    }

    mat-dialog-content {
      padding: 0 8px;
      margin-bottom: 24px;
    }

    .success-message {
      font-size: 1rem;
      color: #4b5563;
      line-height: 1.6;
      margin: 0 0 12px 0;
      text-align: center;
    }

    .success-details {
      font-size: 0.875rem;
      color: #6b7280;
      background: #f0fdf4;
      padding: 12px;
      border-radius: 8px;
      margin: 0;
      border-left: 3px solid #10b981;
      text-align: center;
    }

    mat-dialog-actions {
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
    }

    button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  `]
})
export class SuccessModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SuccessModalData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
