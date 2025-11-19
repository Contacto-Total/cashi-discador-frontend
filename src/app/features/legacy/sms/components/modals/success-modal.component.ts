import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SuccessModalData {
  title?: string;
  message?: string;
  autoCloseMs?: number; // default 1800
}

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="close()">
      <div class="modal-content success-modal" (click)="$event.stopPropagation()">
        <div class="wrap">
          <div class="icon">
            <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
              <circle cx="12" cy="12" r="10" class="ring"></circle>
              <path d="M7 12.5l3 3 7-7" class="tick"></path>
            </svg>
          </div>
          <h3 class="title">{{ data?.title || 'Listo' }}</h3>
          <p class="msg" *ngIf="data?.message">{{ data?.message }}</p>
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

    .success-modal {
      min-width: 300px;
    }

    .wrap {
      padding: 28px 24px 24px;
      text-align: center;
      min-width: 260px;
    }

    .icon {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
    }

    .ring {
      fill: #e8f5ef;
      stroke: #2ea56a;
      stroke-width: 0.5;
    }

    .tick {
      fill: none;
      stroke: #2ea56a;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .title {
      margin: 8px 0 4px;
      font-weight: 700;
      color: #2c3e50;
    }

    .msg {
      margin: 0;
      color: #555;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() data: SuccessModalData | null = null;
  @Output() closed = new EventEmitter<void>();

  private timeoutId?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    if (this.isOpen) {
      this.startAutoClose();
    }
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.startAutoClose();
    }
  }

  private startAutoClose() {
    const ms = this.data?.autoCloseMs ?? 1800;
    this.timeoutId = setTimeout(() => {
      this.close();
    }, ms);
  }

  close() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.closed.emit();
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
