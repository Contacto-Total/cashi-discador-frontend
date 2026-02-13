import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
import { SystemMetricsService, MetricsSnapshot, HttpErrorDetail } from '../../../core/services/system-metrics.service';

Chart.register(...registerables);

@Component({
  selector: 'app-system-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './system-monitoring.component.html',
  styleUrls: ['./system-monitoring.component.css']
})
export class SystemMonitoringComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('sessionsChart') sessionsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('freeswitchChart') freeswitchChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('amdChart') amdChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('amdDonutChart') amdDonutChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trafficChart') trafficChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('errorsChart') errorsChartRef!: ElementRef<HTMLCanvasElement>;

  private sessionsChart: Chart | null = null;
  private freeswitchChart: Chart | null = null;
  private amdChart: Chart | null = null;
  private amdDonutChart: Chart | null = null;
  private trafficChart: Chart | null = null;
  private errorsChart: Chart | null = null;

  private pollSubscription?: Subscription;
  private themeObserver?: MutationObserver;
  private lastTheme: boolean = true; // true = dark

  snapshots: MetricsSnapshot[] = [];
  loading = true;
  error: string | null = null;
  lastUpdated: Date | null = null;
  selectedMinutes = 30;

  // Latest snapshot values for summary cards
  latestWsSessions = 0;
  latestSipRegs = 0;
  latestChannels = 0;
  latestEsl = false;
  latestAmdMs = 0;
  latestRequests = 0;

  // Aggregated HTTP error details from all snapshots
  recentHttpErrors: HttpErrorDetail[] = [];

  constructor(private metricsService: SystemMetricsService) {}

  ngOnInit(): void {
    this.lastTheme = this.isDark();
    this.startPolling();
    this.watchThemeChanges();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.pollSubscription?.unsubscribe();
    this.themeObserver?.disconnect();
    this.destroyCharts();
  }

  private isDark(): boolean {
    return document.body.classList.contains('dark-theme');
  }

  /** Theme colors helper */
  private tc() {
    const dark = this.isDark();
    return {
      text: dark ? '#94a3b8' : '#475569',
      textMuted: dark ? '#64748b' : '#94a3b8',
      grid: dark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      legendText: dark ? '#94a3b8' : '#475569',
      donutBorder: dark ? '#1e293b' : '#ffffff',
    };
  }

  /** Watch for theme class changes on body to rebuild charts */
  private watchThemeChanges(): void {
    this.themeObserver = new MutationObserver(() => {
      const currentTheme = this.isDark();
      if (currentTheme !== this.lastTheme) {
        this.lastTheme = currentTheme;
        this.destroyCharts();
        if (this.snapshots.length > 0) {
          this.updateCharts();
        }
      }
    });
    this.themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  startPolling(): void {
    this.pollSubscription?.unsubscribe();
    this.pollSubscription = interval(10000).pipe(
      startWith(0),
      switchMap(() => this.metricsService.getMetrics(this.selectedMinutes))
    ).subscribe({
      next: (data) => {
        this.snapshots = data;
        this.loading = false;
        this.error = null;
        this.lastUpdated = new Date();
        this.updateSummary();
        this.updateCharts();
      },
      error: (err) => {
        this.error = 'Error al obtener métricas del sistema';
        this.loading = false;
        console.error('System metrics error:', err);
      }
    });
  }

  onTimeRangeChange(): void {
    this.destroyCharts();
    this.startPolling();
  }

  private updateSummary(): void {
    if (this.snapshots.length === 0) return;
    const latest = this.snapshots[this.snapshots.length - 1];
    this.latestWsSessions = latest.websocketSessions;
    this.latestSipRegs = latest.sipRegistrations;
    this.latestChannels = latest.activeChannels;
    this.latestEsl = latest.eslConnected === 1;
    this.latestAmdMs = latest.amdResponseTimeMs;
    this.latestRequests = latest.requestsPerMinute;

    // Agregar errores HTTP de todos los snapshots, más recientes primero
    this.recentHttpErrors = this.snapshots
      .flatMap(s => s.httpErrors || [])
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50);
  }

  private updateCharts(): void {
    if (this.snapshots.length === 0) return;
    const labels = this.snapshots.map(s => this.formatTime(s.timestamp));

    this.updateSessionsChart(labels);
    this.updateFreeSwitchChart(labels);
    this.updateAmdChart(labels);
    this.updateAmdDonut();
    this.updateTrafficChart(labels);
    this.updateErrorsChart(labels);
  }

  private formatTime(ts: number): string {
    const d = new Date(ts);
    return d.getHours().toString().padStart(2, '0') + ':' +
           d.getMinutes().toString().padStart(2, '0') + ':' +
           d.getSeconds().toString().padStart(2, '0');
  }

  // ─── Panel 1: Sesiones Activas ────────────────────────────────
  private updateSessionsChart(labels: string[]): void {
    if (!this.sessionsChartRef?.nativeElement) return;
    const c = this.tc();

    const wsData = this.snapshots.map(s => s.websocketSessions);
    const sipData = this.snapshots.map(s => s.sipRegistrations);
    const eslData = this.snapshots.map(s => s.eslConnected);

    if (this.sessionsChart) {
      this.sessionsChart.data.labels = labels;
      this.sessionsChart.data.datasets[0].data = wsData;
      this.sessionsChart.data.datasets[1].data = sipData;
      this.sessionsChart.data.datasets[2].data = eslData;
      this.sessionsChart.update('none');
      return;
    }

    this.sessionsChart = new Chart(this.sessionsChartRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'WebSocket Sessions',
            data: wsData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 4
          },
          {
            label: 'SIP Registrations',
            data: sipData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 4
          },
          {
            label: 'ESL Connected',
            data: eslData,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 2,
            tension: 0,
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: c.legendText, usePointStyle: true, pointStyle: 'circle', padding: 15 } }
        },
        scales: {
          x: { ticks: { color: c.text, maxTicksLimit: 10 }, grid: { color: c.grid } },
          y: { beginAtZero: true, ticks: { color: c.text, stepSize: 1 }, grid: { color: c.grid } },
          y1: {
            position: 'right' as const, min: 0, max: 1,
            ticks: { color: '#f59e0b', stepSize: 1, callback: (val: any) => val === 1 ? 'ON' : 'OFF' },
            grid: { display: false }
          }
        }
      }
    });
  }

  // ─── Panel 2: FreeSWITCH Calls ─────────────────────────────────
  private updateFreeSwitchChart(labels: string[]): void {
    if (!this.freeswitchChartRef?.nativeElement) return;
    const c = this.tc();

    const channelsData = this.snapshots.map(s => s.activeChannels);
    const successData = this.snapshots.map(s => s.callsSuccess);
    const failedData = this.snapshots.map(s => s.callsFailed);
    const abandonedData = this.snapshots.map(s => s.callsAbandoned);

    if (this.freeswitchChart) {
      this.freeswitchChart.data.labels = labels;
      this.freeswitchChart.data.datasets[0].data = channelsData;
      this.freeswitchChart.data.datasets[1].data = successData;
      this.freeswitchChart.data.datasets[2].data = failedData;
      this.freeswitchChart.data.datasets[3].data = abandonedData;
      this.freeswitchChart.update('none');
      return;
    }

    this.freeswitchChart = new Chart(this.freeswitchChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            type: 'line', label: 'Canales Activos', data: channelsData,
            borderColor: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.15)',
            borderWidth: 2, tension: 0.3, fill: true, pointRadius: 0, pointHoverRadius: 4,
            yAxisID: 'y1', order: 0
          },
          {
            type: 'bar', label: 'Exitosas', data: successData,
            backgroundColor: 'rgba(16, 185, 129, 0.7)', borderColor: '#10b981',
            borderWidth: 1, borderRadius: 2, yAxisID: 'y', order: 1
          },
          {
            type: 'bar', label: 'Fallidas', data: failedData,
            backgroundColor: 'rgba(239, 68, 68, 0.7)', borderColor: '#ef4444',
            borderWidth: 1, borderRadius: 2, yAxisID: 'y', order: 2
          },
          {
            type: 'bar', label: 'Abandonadas', data: abandonedData,
            backgroundColor: 'rgba(245, 158, 11, 0.7)', borderColor: '#f59e0b',
            borderWidth: 1, borderRadius: 2, yAxisID: 'y', order: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: c.legendText, usePointStyle: true, pointStyle: 'circle', padding: 15 } }
        },
        scales: {
          x: { stacked: true, ticks: { color: c.text, maxTicksLimit: 10 }, grid: { color: c.grid } },
          y: {
            stacked: true, beginAtZero: true,
            ticks: { color: c.text, stepSize: 1 }, grid: { color: c.grid },
            title: { display: true, text: 'Llamadas / 10s', color: c.text }
          },
          y1: {
            position: 'right' as const, beginAtZero: true,
            ticks: { color: '#8b5cf6' }, grid: { display: false },
            title: { display: true, text: 'Canales', color: '#8b5cf6' }
          }
        }
      }
    });
  }

  // ─── Panel 3: AMD ────────────────────────────────────────────
  private updateAmdChart(labels: string[]): void {
    if (!this.amdChartRef?.nativeElement) return;
    const c = this.tc();

    const responseData = this.snapshots.map(s => s.amdResponseTimeMs);

    if (this.amdChart) {
      this.amdChart.data.labels = labels;
      this.amdChart.data.datasets[0].data = responseData;
      this.amdChart.update('none');
      return;
    }

    this.amdChart = new Chart(this.amdChartRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'AMD Response Time (ms)',
          data: responseData,
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          borderWidth: 2, tension: 0.3, fill: true, pointRadius: 0, pointHoverRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: c.legendText, usePointStyle: true, pointStyle: 'circle', padding: 15 } }
        },
        scales: {
          x: { ticks: { color: c.text, maxTicksLimit: 10 }, grid: { color: c.grid } },
          y: {
            beginAtZero: true, ticks: { color: c.text }, grid: { color: c.grid },
            title: { display: true, text: 'ms', color: c.text }
          }
        }
      }
    });
  }

  private updateAmdDonut(): void {
    if (!this.amdDonutChartRef?.nativeElement) return;
    const c = this.tc();

    const totalHuman = this.snapshots.reduce((s, d) => s + d.amdHuman, 0);
    const totalMachine = this.snapshots.reduce((s, d) => s + d.amdMachine, 0);
    const totalUnknown = this.snapshots.reduce((s, d) => s + d.amdUnknown, 0);

    if (this.amdDonutChart) {
      this.amdDonutChart.data.datasets[0].data = [totalHuman, totalMachine, totalUnknown];
      this.amdDonutChart.update('none');
      return;
    }

    this.amdDonutChart = new Chart(this.amdDonutChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Human', 'Machine', 'Unknown'],
        datasets: [{
          data: [totalHuman, totalMachine, totalUnknown],
          backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
          borderColor: c.donutBorder,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: c.legendText, usePointStyle: true, pointStyle: 'circle', padding: 10, font: { size: 11 } }
          }
        }
      }
    });
  }

  // ─── Panel 4: API Traffic ─────────────────────────────────────
  private updateTrafficChart(labels: string[]): void {
    if (!this.trafficChartRef?.nativeElement) return;
    const c = this.tc();

    const avgLatency = this.snapshots.map(s => s.avgLatencyMs);
    const p95Latency = this.snapshots.map(s => s.p95LatencyMs);
    const requests = this.snapshots.map(s => s.requestsPerMinute);

    if (this.trafficChart) {
      this.trafficChart.data.labels = labels;
      this.trafficChart.data.datasets[0].data = requests;
      this.trafficChart.data.datasets[1].data = avgLatency;
      this.trafficChart.data.datasets[2].data = p95Latency;
      this.trafficChart.update('none');
      return;
    }

    this.trafficChart = new Chart(this.trafficChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            type: 'bar', label: 'Requests / 10s', data: requests,
            backgroundColor: 'rgba(59, 130, 246, 0.5)', borderColor: '#3b82f6',
            borderWidth: 1, borderRadius: 2, yAxisID: 'y', order: 1
          },
          {
            type: 'line', label: 'Avg Latency (ms)', data: avgLatency,
            borderColor: '#10b981', borderWidth: 2, tension: 0.3, fill: false,
            pointRadius: 0, pointHoverRadius: 4, yAxisID: 'y1', order: 0
          },
          {
            type: 'line', label: 'P95 Latency (ms)', data: p95Latency,
            borderColor: '#f59e0b', borderWidth: 2, tension: 0.3, fill: false,
            pointRadius: 0, pointHoverRadius: 4, borderDash: [5, 5], yAxisID: 'y1', order: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: c.legendText, usePointStyle: true, pointStyle: 'circle', padding: 15 } }
        },
        scales: {
          x: { ticks: { color: c.text, maxTicksLimit: 10 }, grid: { color: c.grid } },
          y: {
            beginAtZero: true, ticks: { color: '#3b82f6' }, grid: { color: c.grid },
            title: { display: true, text: 'Requests', color: '#3b82f6' }
          },
          y1: {
            position: 'right' as const, beginAtZero: true,
            ticks: { color: '#10b981' }, grid: { display: false },
            title: { display: true, text: 'Latencia (ms)', color: '#10b981' }
          }
        }
      }
    });
  }

  private updateErrorsChart(labels: string[]): void {
    if (!this.errorsChartRef?.nativeElement) return;
    const c = this.tc();

    const err4xx = this.snapshots.map(s => s.errors4xx);
    const err5xx = this.snapshots.map(s => s.errors5xx);

    if (this.errorsChart) {
      this.errorsChart.data.labels = labels;
      this.errorsChart.data.datasets[0].data = err4xx;
      this.errorsChart.data.datasets[1].data = err5xx;
      this.errorsChart.update('none');
      return;
    }

    this.errorsChart = new Chart(this.errorsChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Errores 4xx', data: err4xx,
            backgroundColor: 'rgba(245, 158, 11, 0.7)', borderColor: '#f59e0b',
            borderWidth: 1, borderRadius: 2
          },
          {
            label: 'Errores 5xx', data: err5xx,
            backgroundColor: 'rgba(239, 68, 68, 0.7)', borderColor: '#ef4444',
            borderWidth: 1, borderRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: c.legendText, usePointStyle: true, pointStyle: 'circle', padding: 15 } }
        },
        scales: {
          x: { stacked: true, ticks: { color: c.text, maxTicksLimit: 10 }, grid: { color: c.grid } },
          y: { stacked: true, beginAtZero: true, ticks: { color: c.text, stepSize: 1 }, grid: { color: c.grid } }
        }
      }
    });
  }

  private destroyCharts(): void {
    if (this.sessionsChart) { this.sessionsChart.destroy(); this.sessionsChart = null; }
    if (this.freeswitchChart) { this.freeswitchChart.destroy(); this.freeswitchChart = null; }
    if (this.amdChart) { this.amdChart.destroy(); this.amdChart = null; }
    if (this.amdDonutChart) { this.amdDonutChart.destroy(); this.amdDonutChart = null; }
    if (this.trafficChart) { this.trafficChart.destroy(); this.trafficChart = null; }
    if (this.errorsChart) { this.errorsChart.destroy(); this.errorsChart = null; }
  }
}
