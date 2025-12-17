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
      <div class="dialog-header">
        <div class="success-badge">
          <mat-icon>check</mat-icon>
        </div>
        <h2>Promesa Registrada</h2>
        <p class="subtitle">La promesa de pago se ha guardado correctamente</p>
      </div>

      <mat-dialog-content>
        <div class="card-preview">
          <mat-icon class="card-icon">description</mat-icon>
          <div class="card-info">
            <span class="card-title">Carta de Acuerdo</span>
            <span class="card-desc">Documento PDF con los términos del acuerdo</span>
          </div>
        </div>
        <p class="question">¿Desea generar la Carta de Acuerdo ahora?</p>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-stroked-button (click)="onNoClick()" class="btn-secondary">
          Más tarde
        </button>
        <button mat-flat-button color="primary" (click)="onGenerateClick()" class="btn-primary">
          <mat-icon>download</mat-icon>
          Generar y Descargar
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 8px;
    }

    .dialog-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .success-badge {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4caf50, #66bb6a);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }

    .success-badge mat-icon {
      color: white;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    h2 {
      margin: 0 0 8px 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--mat-dialog-headline-color, inherit);
    }

    .subtitle {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.7;
    }

    mat-dialog-content {
      padding: 0 8px;
    }

    .card-preview {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 12px;
      background: var(--mat-sidenav-content-background-color, rgba(0,0,0,0.04));
      margin-bottom: 20px;
    }

    :host-context(.dark-theme) .card-preview,
    :host-context([class*="dark"]) .card-preview {
      background: rgba(255, 255, 255, 0.05);
    }

    .card-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #1976d2;
    }

    :host-context(.dark-theme) .card-icon,
    :host-context([class*="dark"]) .card-icon {
      color: #64b5f6;
    }

    .card-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .card-title {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .card-desc {
      font-size: 0.8rem;
      opacity: 0.6;
    }

    .question {
      text-align: center;
      font-weight: 500;
      margin: 0;
      font-size: 0.9rem;
    }

    mat-dialog-actions {
      display: flex;
      gap: 12px;
      padding: 16px 8px 8px;
      justify-content: flex-end;
    }

    .btn-secondary {
      flex: 1;
    }

    .btn-primary {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
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
