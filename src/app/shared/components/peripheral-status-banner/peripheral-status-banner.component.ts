import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { PeripheralHealthService, PeripheralProblem } from '../../../core/services/peripheral-health.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-peripheral-status-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="peripheral-banner" *ngIf="problems.length > 0 && isAgent" [class.error]="hasError" [class.warning]="!hasError">
      <div class="banner-content">
        <div class="banner-icon">
          <lucide-angular [name]="hasError ? 'alert-triangle' : 'info'" [size]="20"></lucide-angular>
        </div>
        <div class="banner-messages">
          <div class="banner-problem" *ngFor="let problem of problems">
            <span class="problem-message">{{ problem.message }}</span>
            <span class="problem-solution">{{ problem.solution }}</span>
          </div>
        </div>
        <button class="banner-verify-btn" (click)="verify()" [disabled]="checking">
          <lucide-angular [name]="checking ? 'loader' : 'refresh-cw'" [size]="16" [class.spin]="checking"></lucide-angular>
          {{ checking ? 'Verificando...' : 'Verificar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .peripheral-banner {
      padding: 8px 16px;
      font-size: 13px;
      border-bottom: 1px solid;
      animation: slideDown 0.3s ease-out;
    }
    @keyframes slideDown {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .peripheral-banner.error {
      background: #fef2f2;
      border-color: #fecaca;
      color: #991b1b;
    }
    .peripheral-banner.warning {
      background: #fffbeb;
      border-color: #fde68a;
      color: #92400e;
    }
    .banner-content {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .banner-icon { flex-shrink: 0; }
    .banner-messages { flex: 1; }
    .banner-problem {
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex-wrap: wrap;
    }
    .banner-problem + .banner-problem { margin-top: 2px; }
    .problem-message { font-weight: 600; }
    .problem-solution { font-weight: 400; opacity: 0.8; }
    .banner-verify-btn {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border: 1px solid currentColor;
      border-radius: 6px;
      background: transparent;
      color: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      opacity: 0.9;
      transition: opacity 0.2s;
    }
    .banner-verify-btn:hover:not(:disabled) { opacity: 1; background: rgba(0,0,0,0.05); }
    .banner-verify-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    :host-context(.dark) .peripheral-banner.error {
      background: #450a0a;
      border-color: #7f1d1d;
      color: #fca5a5;
    }
    :host-context(.dark) .peripheral-banner.warning {
      background: #451a03;
      border-color: #78350f;
      color: #fcd34d;
    }
  `]
})
export class PeripheralStatusBannerComponent implements OnInit, OnDestroy {
  problems: PeripheralProblem[] = [];
  checking = false;
  isAgent = false;

  private problemsSub?: Subscription;
  private checkingSub?: Subscription;

  get hasError(): boolean {
    return this.problems.some(p => p.severity === 'error');
  }

  constructor(
    private peripheralHealthService: PeripheralHealthService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const agentRoles = ['AGENT', 'ASESOR'];
    this.isAgent = user ? agentRoles.includes(user.role) : false;

    this.problemsSub = this.peripheralHealthService.getProblems().subscribe(p => this.problems = p);
    this.checkingSub = this.peripheralHealthService.isChecking().subscribe(c => this.checking = c);
  }

  ngOnDestroy(): void {
    this.problemsSub?.unsubscribe();
    this.checkingSub?.unsubscribe();
  }

  verify(): void {
    this.peripheralHealthService.runCheck();
  }
}
