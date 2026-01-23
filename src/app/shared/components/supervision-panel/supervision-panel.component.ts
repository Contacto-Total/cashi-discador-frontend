import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SupervisionService, SupervisionMode } from '../../../core/services/supervision.service';
import { SipService } from '../../../core/services/sip.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-supervision-panel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (supervisionService.isSupervisionActive()) {
      <div class="supervision-panel" [class.minimized]="isMinimized()">
        <!-- Header -->
        <div class="panel-header" (click)="toggleMinimize()">
          <div class="header-left">
            <lucide-angular
              [name]="supervisionService.getModeIcon(supervisionService.currentMode())"
              [size]="18"
              [style.color]="supervisionService.getModeColor(supervisionService.currentMode())">
            </lucide-angular>
            <span class="mode-label">{{ supervisionService.getModeLabel(supervisionService.currentMode()) }}</span>
          </div>
          <div class="header-right">
            <span class="duration">{{ formatDuration(duration()) }}</span>
            <lucide-angular
              [name]="isMinimized() ? 'chevron-up' : 'chevron-down'"
              [size]="16">
            </lucide-angular>
          </div>
        </div>

        <!-- Body (collapsible) -->
        @if (!isMinimized()) {
          <div class="panel-body">
            <!-- Call Info -->
            <div class="call-info">
              <div class="info-row">
                <lucide-angular name="user" [size]="14"></lucide-angular>
                <span>{{ supervisionService.state().agentName }}</span>
              </div>
              <div class="info-row">
                <lucide-angular name="phone" [size]="14"></lucide-angular>
                <span>{{ supervisionService.state().clientNumber }}</span>
              </div>
            </div>

            <!-- Mode Buttons -->
            <div class="mode-buttons">
              <button
                class="mode-btn"
                [class.active]="supervisionService.currentMode() === 'spy'"
                [disabled]="changingMode()"
                (click)="changeMode('spy')"
                title="Vigía - Solo escuchar">
                <lucide-angular name="eye" [size]="16"></lucide-angular>
              </button>
              <button
                class="mode-btn"
                [class.active]="supervisionService.currentMode() === 'whisper'"
                [disabled]="changingMode()"
                (click)="changeMode('whisper')"
                title="Susurro - Hablar al agente">
                <lucide-angular name="mic" [size]="16"></lucide-angular>
              </button>
              <button
                class="mode-btn"
                [class.active]="supervisionService.currentMode() === 'barge'"
                [disabled]="changingMode()"
                (click)="changeMode('barge')"
                title="Tripartita - Todos escuchan">
                <lucide-angular name="users" [size]="16"></lucide-angular>
              </button>
            </div>

            <!-- Control Buttons -->
            <div class="control-buttons">
              <button
                class="control-btn"
                [class.muted]="isMuted()"
                (click)="toggleMute()"
                [title]="isMuted() ? 'Activar micrófono' : 'Silenciar'">
                <lucide-angular [name]="isMuted() ? 'mic-off' : 'mic'" [size]="16"></lucide-angular>
              </button>
              <button
                class="control-btn disconnect"
                (click)="disconnect()"
                title="Desconectar">
                <lucide-angular name="phone-off" [size]="16"></lucide-angular>
              </button>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .supervision-panel {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 280px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid #334155;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      z-index: 9999;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .supervision-panel.minimized {
      width: 200px;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: rgba(59, 130, 246, 0.1);
      border-bottom: 1px solid #334155;
      cursor: pointer;
      user-select: none;
    }

    .panel-header:hover {
      background: rgba(59, 130, 246, 0.15);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mode-label {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #94a3b8;
    }

    .duration {
      font-size: 13px;
      font-family: monospace;
    }

    .panel-body {
      padding: 12px;
    }

    .call-info {
      margin-bottom: 12px;
      padding: 8px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #94a3b8;
      font-size: 12px;
      padding: 4px 0;
    }

    .mode-buttons {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .mode-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .mode-btn:hover:not(:disabled) {
      background: #334155;
      color: #fff;
    }

    .mode-btn.active {
      background: #3b82f6;
      border-color: #3b82f6;
      color: #fff;
    }

    .mode-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .control-buttons {
      display: flex;
      gap: 8px;
    }

    .control-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .control-btn:hover {
      background: #334155;
      color: #fff;
    }

    .control-btn.muted {
      background: #f59e0b;
      border-color: #f59e0b;
      color: #fff;
    }

    .control-btn.disconnect {
      background: #dc2626;
      border-color: #dc2626;
      color: #fff;
    }

    .control-btn.disconnect:hover {
      background: #ef4444;
    }
  `]
})
export class SupervisionPanelComponent implements OnInit, OnDestroy {
  supervisionService = inject(SupervisionService);
  private sipService = inject(SipService);
  private router = inject(Router);

  isMinimized = signal(false);
  isMuted = signal(false);
  changingMode = signal(false);
  duration = signal(0);

  private timerSubscription?: Subscription;

  ngOnInit(): void {
    // Start duration timer
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.supervisionService.isSupervisionActive()) {
        this.duration.update(d => d + 1);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  toggleMinimize(): void {
    this.isMinimized.update(v => !v);
  }

  changeMode(newMode: SupervisionMode): void {
    if (this.supervisionService.currentMode() === newMode) return;

    this.changingMode.set(true);

    this.supervisionService.changeMode(newMode).subscribe({
      next: () => {
        this.supervisionService.updateMode(newMode);
        this.changingMode.set(false);
      },
      error: (error) => {
        console.error('Error changing supervision mode:', error);
        this.changingMode.set(false);
        alert('Error al cambiar modo de supervisión');
      }
    });
  }

  toggleMute(): void {
    this.isMuted.update(v => !v);
    if (this.isMuted()) {
      this.sipService.mute();
    } else {
      this.sipService.unmute();
    }
  }

  disconnect(): void {
    // Hangup SIP call
    this.sipService.hangup();

    // Disable auto-answer mode
    this.sipService.disableAutoAnswer();

    // Unregister SIP
    this.sipService.unregister();

    // Clear supervision state
    this.supervisionService.stopSupervision();

    // Reset duration
    this.duration.set(0);

    // Navigate back to monitoring
    this.router.navigate(['/admin/monitoring']);
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
