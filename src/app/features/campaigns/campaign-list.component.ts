import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { CampaignService } from '../../core/services/campaign.service';
import { Campaign, CampaignStatus } from '../../core/models/campaign.model';
import { AutoDialerService } from '../../core/services/autodialer.service';

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
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class CampaignListComponent implements OnInit, OnDestroy {
  campaigns: Campaign[] = [];
  loading = true;
  displayedColumns: string[] = ['name', 'status', 'dialMode', 'intensidad', 'dialing', 'startDate', 'contacts', 'actions'];

  // Auto-Dialer state
  isAutoDialerActive: boolean = false;
  autoDialerLoading: boolean = false;
  private autoDialerSubscription?: Subscription;

  constructor(
    private campaignService: CampaignService,
    private autoDialerService: AutoDialerService
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
    this.loadAutoDialerState();
    this.startAutoDialerPolling();
  }

  ngOnDestroy(): void {
    if (this.autoDialerSubscription) {
      this.autoDialerSubscription.unsubscribe();
    }
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

  // ========================================
  // PER-CAMPAIGN DIALING METHODS
  // ========================================

  toggleDialing(campaign: Campaign, event: Event): void {
    event.stopPropagation(); // Prevent row click

    if (campaign.estaDiscando) {
      this.stopDialing(campaign);
    } else {
      this.startDialing(campaign);
    }
  }

  startDialing(campaign: Campaign): void {
    this.campaignService.startDialing(campaign.id).subscribe({
      next: () => {
        console.log(`✅ Discado iniciado para campaña: ${campaign.name}`);
        this.loadCampaigns();
      },
      error: (error) => {
        console.error('Error iniciando discado:', error);
        alert(error.error?.message || 'Error al iniciar el discado');
      }
    });
  }

  stopDialing(campaign: Campaign): void {
    this.campaignService.stopDialing(campaign.id).subscribe({
      next: () => {
        console.log(`⏸️ Discado detenido para campaña: ${campaign.name}`);
        this.loadCampaigns();
      },
      error: (error) => {
        console.error('Error deteniendo discado:', error);
      }
    });
  }

  canStartDialing(campaign: Campaign): boolean {
    return campaign.status === CampaignStatus.ACTIVE && !campaign.estaDiscando;
  }

  canStopDialing(campaign: Campaign): boolean {
    return campaign.estaDiscando;
  }

  // ========================================
  // AUTO-DIALER METHODS (DEPRECATED - will be removed)
  // ========================================

  /**
   * Carga el estado actual del auto-dialer
   */
  loadAutoDialerState(): void {
    this.autoDialerService.getEstado().subscribe({
      next: (response) => {
        this.isAutoDialerActive = response.activo;
      },
      error: (err) => {
        console.error('Error loading auto-dialer state:', err);
      }
    });
  }

  /**
   * Inicia polling del estado del auto-dialer cada 5 segundos
   */
  startAutoDialerPolling(): void {
    this.autoDialerSubscription = this.autoDialerService.startStatsPolling().subscribe({
      next: (stats) => {
        this.isAutoDialerActive = stats.activo;
      },
      error: (err) => {
        console.error('Error polling auto-dialer stats:', err);
      }
    });
  }

  /**
   * Toggle auto-dialer (activar/desactivar)
   */
  toggleAutoDialer(): void {
    this.autoDialerLoading = true;

    this.autoDialerService.toggle('admin').subscribe({
      next: (response) => {
        this.autoDialerLoading = false;
        this.isAutoDialerActive = response.activo;
        console.log('Auto-Dialer toggled:', response.mensaje);
      },
      error: (err) => {
        console.error('Error toggling auto-dialer:', err);
        this.autoDialerLoading = false;
      }
    });
  }

  /**
   * Obtiene el texto del botón del auto-dialer
   */
  getAutoDialerButtonText(): string {
    if (this.autoDialerLoading) return 'Procesando...';
    return this.isAutoDialerActive ? 'PAUSAR DISCADO' : 'INICIAR DISCADO';
  }

  /**
   * Obtiene el ícono del botón del auto-dialer
   */
  getAutoDialerButtonIcon(): string {
    return this.isAutoDialerActive ? 'pause' : 'play_arrow';
  }

  /**
   * Obtiene el color del botón del auto-dialer
   */
  getAutoDialerButtonColor(): string {
    return this.isAutoDialerActive ? 'warn' : 'primary';
  }

  /**
   * Obtiene el tooltip del botón
   */
  getAutoDialerTooltip(): string {
    return this.isAutoDialerActive
      ? 'Pausar el sistema de discado automático'
      : 'Iniciar el sistema de discado automático';
  }
}
