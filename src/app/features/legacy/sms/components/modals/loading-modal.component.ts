import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LoadingModalData {
  title?: string;
  subtitle?: string;
}

@Component({
  selector: 'app-loading-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="onBackdropClick($event)">
      <div class="modal-content loading-modal" (click)="$event.stopPropagation()">
        <div class="ldg-container">
          <div class="loader-wrapper" aria-label="loading animation">
            <ng-container *ngFor="let ch of letters; let i = index">
              <span class="loader-letter">{{ ch }}</span>
            </ng-container>
            <div class="loader"></div>
          </div>

          <h2 class="ldg-title">{{ data?.title || 'Generando…' }}</h2>
          <p class="ldg-subtitle" *ngIf="data?.subtitle">{{ data?.subtitle }}</p>
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

    .loading-modal {
      padding: 32px;
      min-width: 320px;
    }

    /* Loading Dialog Styles */
    .ldg-container {
      display: grid;
      justify-items: center;
      align-items: center;
      gap: 10px;
      padding: 6px;
      text-align: center;
      min-width: 220px;
    }

    .ldg-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .ldg-subtitle {
      margin: 0;
      font-size: 14px;
      opacity: 0.8;
    }

    .loader-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180px;
      height: 180px;
      font-family: "Inter", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      font-size: 1.2em;
      font-weight: 300;
      color: white;
      border-radius: 50%;
      background-color: transparent;
      user-select: none;
    }

    .loader {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      background-color: transparent;
      animation: loader-rotate 2s linear infinite;
      z-index: 0;
    }

    @keyframes loader-rotate {
      0% {
        transform: rotate(90deg);
        box-shadow:
          0 10px 20px 0 #fff inset,
          0 20px 30px 0 #ad5fff inset,
          0 60px 60px 0 #471eec inset;
      }
      50% {
        transform: rotate(270deg);
        box-shadow:
          0 10px 20px 0 #fff inset,
          0 20px 10px 0 #d60a47 inset,
          0 40px 60px 0 #311e80 inset;
      }
      100% {
        transform: rotate(450deg);
        box-shadow:
          0 10px 20px 0 #fff inset,
          0 20px 30px 0 #ad5fff inset,
          0 60px 60px 0 #471eec inset;
      }
    }

    .loader-letter {
      color: #111;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
      display: inline-block;
      opacity: 0.4;
      transform: translateY(0);
      animation: loader-letter-anim 2s infinite;
      z-index: 1;
      border-radius: 50ch;
      border: none;
    }

    .loader-letter:nth-child(1)  { animation-delay: 0s;   }
    .loader-letter:nth-child(2)  { animation-delay: 0.1s; }
    .loader-letter:nth-child(3)  { animation-delay: 0.2s; }
    .loader-letter:nth-child(4)  { animation-delay: 0.3s; }
    .loader-letter:nth-child(5)  { animation-delay: 0.4s; }
    .loader-letter:nth-child(6)  { animation-delay: 0.5s; }
    .loader-letter:nth-child(7)  { animation-delay: 0.6s; }
    .loader-letter:nth-child(8)  { animation-delay: 0.7s; }
    .loader-letter:nth-child(9)  { animation-delay: 0.8s; }
    .loader-letter:nth-child(10) { animation-delay: 0.9s; }

    @keyframes loader-letter-anim {
      0%, 100% {
        opacity: 0.4;
        transform: translateY(0);
      }
      20% {
        opacity: 1;
        transform: scale(1.15);
      }
      40% {
        opacity: 0.7;
        transform: translateY(0);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingModalComponent {
  @Input() isOpen = false;
  @Input() data: LoadingModalData | null = null;
  @Output() closed = new EventEmitter<void>();

  letters = Array.from('Generando');

  onBackdropClick(event: MouseEvent) {
    // Loading modal no se cierra con backdrop click
    event.stopPropagation();
  }
}
