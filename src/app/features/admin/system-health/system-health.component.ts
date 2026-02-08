import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { SystemHealthService, SystemHealth } from '../../../core/services/system-health.service';

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './system-health.component.html',
  styleUrls: ['./system-health.component.css']
})
export class SystemHealthComponent implements OnInit, OnDestroy {
  health: SystemHealth | null = null;
  loading = true;
  error: string | null = null;
  lastUpdated: Date | null = null;

  private pollSubscription?: Subscription;

  constructor(private healthService: SystemHealthService) {}

  ngOnInit(): void {
    this.pollSubscription = interval(10000).pipe(
      startWith(0),
      switchMap(() => this.healthService.getSystemHealth())
    ).subscribe({
      next: (data) => {
        this.health = data;
        this.loading = false;
        this.error = null;
        this.lastUpdated = new Date();
      },
      error: (err) => {
        this.error = 'Error al obtener datos del sistema';
        this.loading = false;
        console.error('System health error:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.pollSubscription?.unsubscribe();
  }

  getStatusColor(percent: number): string {
    if (percent >= 85) return 'critical';
    if (percent >= 70) return 'warning';
    return 'ok';
  }

  getBarWidth(percent: number): string {
    return Math.min(100, Math.max(0, percent)) + '%';
  }

  formatUptime(minutes: number): string {
    if (minutes < 60) return minutes + 'm';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours < 24) return hours + 'h ' + mins + 'm';
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return days + 'd ' + remainingHours + 'h';
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return 'alert-critical';
      case 'WARNING': return 'alert-warning';
      default: return 'alert-info';
    }
  }

  getPoolUsagePercent(): number {
    if (!this.health?.database?.pool?.maxPoolSize) return 0;
    return (this.health.database.pool.activeConnections / this.health.database.pool.maxPoolSize) * 100;
  }

  truncateQuery(info: string | null): string {
    if (!info) return '-';
    return info.length > 80 ? info.substring(0, 80) + '...' : info;
  }
}
