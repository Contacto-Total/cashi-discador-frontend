import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { ReportService, DashboardStats, CallsByHour } from '../../core/services/report.service';
import { CampaignService } from '../../core/services/campaign.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { Campaign } from '../../core/models/campaign.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  activeCampaigns: Campaign[] = [];
  loading = true;
  chart: Chart | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private reportService: ReportService,
    private campaignService: CampaignService,
    private websocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.subscribeToUpdates();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load statistics
    this.reportService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading = false;
      }
    });

    // Load active campaigns
    this.campaignService.getActiveCampaigns().subscribe({
      next: (campaigns) => {
        this.activeCampaigns = campaigns;
      },
      error: (error) => {
        console.error('Error loading active campaigns:', error);
      }
    });

    // Load calls by hour for chart
    this.reportService.getCallsByHour(new Date()).subscribe({
      next: (data) => {
        this.renderChart(data);
      },
      error: (error) => {
        console.error('Error loading calls by hour:', error);
      }
    });
  }

  subscribeToUpdates(): void {
    // Subscribe to real-time updates via WebSocket
    const callsSub = this.websocketService.subscribe('/topic/calls').subscribe({
      next: (event) => {
        console.log('Call event received:', event);
        this.refreshStats();
      }
    });

    const campaignsSub = this.websocketService.subscribe('/topic/campaigns').subscribe({
      next: (event) => {
        console.log('Campaign event received:', event);
        this.loadActiveCampaigns();
      }
    });

    this.subscriptions.push(callsSub, campaignsSub);
  }

  refreshStats(): void {
    this.reportService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error refreshing stats:', error);
      }
    });
  }

  loadActiveCampaigns(): void {
    this.campaignService.getActiveCampaigns().subscribe({
      next: (campaigns) => {
        this.activeCampaigns = campaigns;
      },
      error: (error) => {
        console.error('Error loading active campaigns:', error);
      }
    });
  }

  renderChart(data: CallsByHour[]): void {
    const canvas = document.getElementById('callsChart') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.map(d => `${d.hour}:00`),
        datasets: [
          {
            label: 'Total Calls',
            data: data.map(d => d.totalCalls),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
          },
          {
            label: 'Answered Calls',
            data: data.map(d => d.answeredCalls),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Calls by Hour - Today'
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'PAUSED': return 'orange';
      case 'DRAFT': return 'gray';
      default: return 'black';
    }
  }
}
