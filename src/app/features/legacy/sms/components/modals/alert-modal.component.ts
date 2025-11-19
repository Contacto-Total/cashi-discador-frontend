import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AlertModalData {
  title?: string;
  message: string;
}

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="close()">
      <div class="modal-content alert-modal" (click)="$event.stopPropagation()">
        <h2 class="modal-title">{{ data?.title || 'Aviso' }}</h2>
        <div class="modal-body">
          <p class="modal-message">{{ data?.message }}</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary" (click)="close()">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .alert-modal {
      min-width: 420px;
      max-width: 500px;
    }

    .modal-title {
      padding: 20px 24px;
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      border-bottom: 1px solid #e5e7eb;
      color: #2c3e50;
    }

    .modal-body {
      padding: 24px;
    }

    .modal-message {
      margin: 0;
      white-space: pre-wrap;
      color: #374151;
      line-height: 1.6;
    }

    .modal-actions {
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    }

    @media (max-width: 600px) {
      .alert-modal {
        min-width: 90vw;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertModalComponent {
  @Input() isOpen = false;
  @Input() data: AlertModalData | null = null;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
