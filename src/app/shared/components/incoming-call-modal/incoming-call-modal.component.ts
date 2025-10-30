import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incoming-call-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="incoming-call-modal">
      <h2 mat-dialog-title>
        <mat-icon>phone_in_talk</mat-icon>
        Llamada Entrante
      </h2>
      <mat-dialog-content>
        <p class="caller-info">De: <strong>{{ data.from }}</strong></p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-raised-button color="warn" (click)="reject()">
          <mat-icon>call_end</mat-icon>
          Rechazar
        </button>
        <button mat-raised-button color="primary" (click)="answer()">
          <mat-icon>call</mat-icon>
          Contestar
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .incoming-call-modal {
      text-align: center;
      padding: 20px;
    }

    h2 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #2196F3;
    }

    .caller-info {
      font-size: 18px;
      margin: 20px 0;
    }

    mat-dialog-actions {
      gap: 15px;
      padding: 20px 0;
    }

    button {
      min-width: 120px;
    }
  `]
})
export class IncomingCallModalComponent {
  constructor(
    public dialogRef: MatDialogRef<IncomingCallModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { from: string }
  ) {}

  answer(): void {
    this.dialogRef.close('answer');
  }

  reject(): void {
    this.dialogRef.close('reject');
  }
}
