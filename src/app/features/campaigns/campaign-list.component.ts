import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { CampaignService } from '../../core/services/campaign.service';
import { Campaign, CampaignStatus } from '../../core/models/campaign.model';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class CampaignListComponent implements OnInit {
  campaigns: Campaign[] = [];
  loading = true;
  displayedColumns: string[] = ['name', 'status', 'dialMode', 'startDate', 'contacts', 'actions'];

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.loading = true;
    this.campaignService.getAllCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading campaigns:', error);
        this.loading = false;
      }
    });
  }

  startCampaign(campaign: Campaign): void {
    this.campaignService.startCampaign(campaign.id).subscribe({
      next: () => {
        this.loadCampaigns();
      },
      error: (error) => {
        console.error('Error starting campaign:', error);
      }
    });
  }

  pauseCampaign(campaign: Campaign): void {
    this.campaignService.pauseCampaign(campaign.id).subscribe({
      next: () => {
        this.loadCampaigns();
      },
      error: (error) => {
        console.error('Error pausing campaign:', error);
      }
    });
  }

  stopCampaign(campaign: Campaign): void {
    this.campaignService.stopCampaign(campaign.id).subscribe({
      next: () => {
        this.loadCampaigns();
      },
      error: (error) => {
        console.error('Error stopping campaign:', error);
      }
    });
  }

  deleteCampaign(campaign: Campaign): void {
    if (confirm(`Are you sure you want to delete campaign "${campaign.name}"?`)) {
      this.campaignService.deleteCampaign(campaign.id).subscribe({
        next: () => {
          this.loadCampaigns();
        },
        error: (error) => {
          console.error('Error deleting campaign:', error);
        }
      });
    }
  }

  getStatusColor(status: CampaignStatus): string {
    switch (status) {
      case CampaignStatus.ACTIVE: return 'primary';
      case CampaignStatus.PAUSED: return 'warn';
      case CampaignStatus.COMPLETED: return 'accent';
      default: return '';
    }
  }

  canStart(campaign: Campaign): boolean {
    return campaign.status === CampaignStatus.DRAFT || campaign.status === CampaignStatus.PAUSED;
  }

  canPause(campaign: Campaign): boolean {
    return campaign.status === CampaignStatus.ACTIVE;
  }

  canStop(campaign: Campaign): boolean {
    return campaign.status === CampaignStatus.ACTIVE || campaign.status === CampaignStatus.PAUSED;
  }
}
