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
    <div class="error-modal">
      <div class="error-header">
        <div class="error-icon-container">
          <lucide-angular name="alert-circle" [size]="48" class="error-icon"></lucide-angular>
        </div>
        <h2 mat-dialog-title>{{ data.title || 'Error' }}</h2>
      </div>

      <mat-dialog-content>
        <p class="error-message">{{ data.message }}</p>
        <p *ngIf="data.details" class="error-details">{{ data.details }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-raised-button color="primary" (click)="close()">
          <lucide-angular name="x" [size]="18"></lucide-angular>
          Cerrar
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .error-modal {
      min-width: 400px;
      max-width: 500px;
      padding: 24px;
      background: white;
      border-radius: 12px;
    }

    .error-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      text-align: center;
    }

    .error-icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
      }
    }

    .error-icon {
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

    .error-message {
      font-size: 1rem;
      color: #4b5563;
      line-height: 1.6;
      margin: 0 0 12px 0;
      text-align: center;
    }

    .error-details {
      font-size: 0.875rem;
      color: #6b7280;
      background: #f3f4f6;
      padding: 12px;
      border-radius: 8px;
      margin: 0;
      border-left: 3px solid #ef4444;
      font-family: 'Courier New', monospace;
      white-space: pre-wrap;
      word-break: break-word;
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
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class ErrorModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorModalData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
