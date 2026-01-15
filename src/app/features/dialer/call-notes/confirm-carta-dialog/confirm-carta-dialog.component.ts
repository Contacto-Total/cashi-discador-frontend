import { Component, Inject, OnInit, OnDestroy, signal, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="carta-dialog" [class.dark-mode]="isDarkMode()">
      <div class="carta-header">
        <div class="carta-success-badge">
          <mat-icon>check_circle</mat-icon>
        </div>
        <h2 class="carta-title">Promesa Registrada</h2>
        <p class="carta-subtitle">La promesa de pago se ha guardado correctamente</p>
      </div>

      <div class="carta-body">
        <div class="carta-preview">
          <div class="carta-icon-wrapper">
            <mat-icon class="carta-icon">description</mat-icon>
          </div>
          <div class="carta-info">
            <span class="carta-info-title">Carta de Acuerdo</span>
            <span class="carta-info-desc">Documento PDF con los términos del acuerdo</span>
          </div>
        </div>
        <p class="carta-question">¿Desea generar la Carta de Acuerdo ahora?</p>
      </div>

      <div class="carta-actions">
        <button mat-button class="carta-btn-secondary" (click)="onNoClick()">
          Más tarde
        </button>
        <button mat-flat-button class="carta-btn-primary" (click)="onGenerateClick()">
          <mat-icon>download</mat-icon>
          <span>Generar y Descargar</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos del panel del diálogo (contenedor externo de Material) */
    .carta-dialog-panel {
      background: transparent !important;
    }
    .carta-dialog-panel .mat-mdc-dialog-container {
      background: transparent !important;
      box-shadow: none !important;
    }
    .carta-dialog-panel .mat-mdc-dialog-surface {
      background: transparent !important;
      box-shadow: none !important;
      overflow: visible !important;
    }

    .carta-dialog {
      padding: 28px;
      min-width: 400px;
      max-width: 460px;
      background: #ffffff !important;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    .carta-dialog.dark-mode {
      background: #1e293b !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }

    .carta-header {
      text-align: center;
      margin-bottom: 24px;
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
    }

    .carta-success-badge {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
    }
    .carta-success-badge mat-icon {
      color: white !important;
      font-size: 2.25rem;
      width: 36px;
      height: 36px;
    }

    .carta-title {
      margin: 0 0 8px 0 !important;
      font-size: 1.35rem !important;
      font-weight: 600 !important;
      color: #1e293b !important;
    }
    .dark-mode .carta-title {
      color: #f1f5f9 !important;
    }

    .carta-subtitle {
      margin: 0 !important;
      font-size: 0.875rem !important;
      color: #64748b !important;
    }
    .dark-mode .carta-subtitle {
      color: #94a3b8 !important;
    }

    .carta-body {
      margin-bottom: 24px;
    }

    .carta-preview {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 12px;
      background: #f8fafc !important;
      border: 1px solid #e2e8f0 !important;
      margin-bottom: 20px;
    }
    .dark-mode .carta-preview {
      background: #0f172a !important;
      border-color: #334155 !important;
    }

    .carta-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .dark-mode .carta-icon-wrapper {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.3) 100%);
    }

    .carta-icon {
      font-size: 1.625rem;
      width: 26px;
      height: 26px;
      color: #2563eb !important;
    }
    .dark-mode .carta-icon {
      color: #60a5fa !important;
    }

    .carta-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .carta-info-title {
      font-weight: 600;
      font-size: 0.95rem;
      color: #1e293b !important;
    }
    .dark-mode .carta-info-title {
      color: #f1f5f9 !important;
    }

    .carta-info-desc {
      font-size: 0.8rem;
      color: #64748b !important;
    }
    .dark-mode .carta-info-desc {
      color: #94a3b8 !important;
    }

    .carta-question {
      text-align: center;
      font-weight: 500;
      margin: 0 !important;
      font-size: 0.95rem;
      color: #475569 !important;
    }
    .dark-mode .carta-question {
      color: #cbd5e1 !important;
    }

    .carta-actions {
      display: flex;
      gap: 12px;
      justify-content: stretch;
    }

    .carta-btn-secondary {
      flex: 1;
      padding: 14px 24px !important;
      border-radius: 10px !important;
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      color: #64748b !important;
      background: #f1f5f9 !important;
      border: 1px solid #e2e8f0 !important;
      transition: all 0.2s;
      line-height: 1.2 !important;
      min-height: 48px;
    }
    .dark-mode .carta-btn-secondary {
      color: #94a3b8 !important;
      background: #0f172a !important;
      border-color: #334155 !important;
    }
    .carta-btn-secondary:hover {
      background: #e2e8f0 !important;
      border-color: #cbd5e1 !important;
    }
    .dark-mode .carta-btn-secondary:hover {
      background: #334155 !important;
      border-color: #475569 !important;
    }

    .carta-btn-primary {
      flex: 1;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px !important;
      border-radius: 10px !important;
      font-size: 0.875rem !important;
      font-weight: 600 !important;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
      transition: all 0.2s;
      white-space: nowrap;
      line-height: 1.2 !important;
      min-height: 48px;
    }
    .carta-btn-primary:hover {
      box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
      transform: translateY(-1px);
    }

    .carta-btn-primary mat-icon {
      font-size: 1.25rem;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      margin-right: 2px;
    }

    .carta-btn-primary span {
      flex-shrink: 0;
    }
  `]
})
export class ConfirmCartaDialogComponent implements OnInit, OnDestroy {
  isDarkMode = signal<boolean>(false);
  private darkModeObserver?: MutationObserver;

  constructor(
    public dialogRef: MatDialogRef<ConfirmCartaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmCartaDialogData
  ) {}

  ngOnInit(): void {
    this.isDarkMode.set(document.documentElement.classList.contains('dark'));

    this.darkModeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.isDarkMode.set(document.documentElement.classList.contains('dark'));
        }
      });
    });

    this.darkModeObserver.observe(document.documentElement, { attributes: true });
  }

  ngOnDestroy(): void {
    this.darkModeObserver?.disconnect();
  }

  onNoClick(): void {
    this.dialogRef.close('cancel');
  }

  onGenerateClick(): void {
    this.dialogRef.close('generate');
  }
}
