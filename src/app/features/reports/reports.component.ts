import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { ReportService, DashboardStats, AgentPerformanceReport } from '../../core/services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, MatTableModule],
  template: `
    <div class="container">
      <h1>Reports & Analytics</h1>

      <mat-tab-group>
        <mat-tab label="Overview">
          <mat-card *ngIf="stats">
            <mat-card-content>
              <div class="stats-grid">
                <div class="stat-item">
                  <h3>{{ stats.totalCallsToday }}</h3>
                  <p>Total Calls Today</p>
                </div>
                <div class="stat-item">
                  <h3>{{ stats.answeredCallsToday }}</h3>
                  <p>Answered Calls</p>
                </div>
                <div class="stat-item">
                  <h3>{{ (stats.contactRate * 100).toFixed(1) }}%</h3>
                  <p>Contact Rate</p>
                </div>
                <div class="stat-item">
                  <h3>{{ stats.availableAgents }}</h3>
                  <p>Available Agents</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <mat-tab label="Agent Performance">
          <mat-card>
            <table mat-table [dataSource]="agentPerformance">
              <ng-container matColumnDef="agent">
                <th mat-header-cell *matHeaderCellDef>Agent</th>
                <td mat-cell *matCellDef="let agent">{{ agent.agentName }}</td>
              </ng-container>
              <ng-container matColumnDef="totalCalls">
                <th mat-header-cell *matHeaderCellDef>Total Calls</th>
                <td mat-cell *matCellDef="let agent">{{ agent.totalCalls }}</td>
              </ng-container>
              <ng-container matColumnDef="answeredCalls">
                <th mat-header-cell *matHeaderCellDef>Answered</th>
                <td mat-cell *matCellDef="let agent">{{ agent.answeredCalls }}</td>
              </ng-container>
              <ng-container matColumnDef="avgTalkTime">
                <th mat-header-cell *matHeaderCellDef>Avg Talk Time</th>
                <td mat-cell *matCellDef="let agent">{{ formatTime(agent.averageTalkTime) }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`.container { padding: 24px; } .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; } .stat-item { text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; } .stat-item h3 { margin: 0; font-size: 2rem; color: #333; } .stat-item p { margin: 8px 0 0; color: #666; }`]
})
export class ReportsComponent implements OnInit {
  stats: DashboardStats | null = null;
  agentPerformance: AgentPerformanceReport[] = [];
  displayedColumns = ['agent', 'totalCalls', 'answeredCalls', 'avgTalkTime'];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getDashboardStats().subscribe(stats => this.stats = stats);
    this.reportService.getAgentPerformance().subscribe(performance => this.agentPerformance = performance);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
