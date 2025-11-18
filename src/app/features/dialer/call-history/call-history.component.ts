import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { LucideAngularModule } from 'lucide-angular';
import { CallService } from '../../../core/services/call.service';
import { Call } from '../../../core/models/call.model';

@Component({
  selector: 'app-call-history',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, LucideAngularModule],
  templateUrl: './call-history.component.html',
  styleUrls: ['./call-history.component.css']
})
export class CallHistoryComponent implements OnChanges {
  @Input() agentId!: number;
  @Input() refreshTrigger: any;

  calls: Call[] = [];
  loading = false;
  displayedColumns: string[] = ['time', 'contact', 'duration', 'status'];

  constructor(private callService: CallService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshTrigger']) {
      this.loadCallHistory();
    }
  }

  loadCallHistory(): void {
    if (!this.agentId) return;

    this.loading = true;
    this.callService.getCallHistory({ agentId: this.agentId, size: 10 }).subscribe({
      next: (calls) => {
        this.calls = calls;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading call history:', error);
        this.loading = false;
      }
    });
  }

  formatDuration(seconds?: number): string {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'check_circle';
      case 'FAILED': return 'error';
      case 'ABANDONED': return 'block';
      default: return 'help';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED': return '#4caf50';
      case 'FAILED': return '#f44336';
      case 'ABANDONED': return '#ff9800';
      default: return '#999';
    }
  }
}
