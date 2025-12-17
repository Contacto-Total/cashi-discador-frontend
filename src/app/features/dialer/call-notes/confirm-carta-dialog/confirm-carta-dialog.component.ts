import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmCartaDialogData {
  idGestion: number;
}

@Component({
  selector: 'app-confirm-carta-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-icon">
        <mat-icon class="success-icon">check_circle</mat-icon>
      </div>

      <h2 mat-dialog-title>Promesa Registrada</h2>

      <mat-dialog-content>
        <p>La promesa de pago se ha registrado exitosamente.</p>
        <p class="question">¿Desea generar la Carta de Acuerdo?</p>
      </mat-dialog-content>

      <mat-dialog-actions align="center">
        <button mat-button (click)="onNoClick()" class="btn-secondary">
          Ahora no
        </button>
        <button mat-raised-button color="primary" (click)="onGenerateClick()" class="btn-primary">
          <mat-icon>description</mat-icon>
          Generar Carta
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 16px;
      text-align: center;
    }

    .dialog-icon {
      margin-bottom: 16px;
    }

    .success-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #4caf50;
    }

    h2 {
      margin: 0 0 16px 0;
      font-weight: 500;
    }

    mat-dialog-content {
      margin-bottom: 24px;
    }

    .question {
      font-weight: 500;
      color: #333;
      margin-top: 16px;
    }

    mat-dialog-actions {
      gap: 16px;
      padding: 0;
    }

    .btn-primary mat-icon {
      margin-right: 8px;
    }

    .btn-secondary {
      color: #666;
    }
  `]
})
export class ConfirmCartaDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmCartaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmCartaDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close('cancel');
  }

  onGenerateClick(): void {
    this.dialogRef.close('generate');
  }
}
