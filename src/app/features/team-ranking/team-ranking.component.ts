import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TeamRankingService, TeamRankingDTO, AgentRankingInfo } from './team-ranking.service';
import { AuthService } from '../../core/services/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-team-ranking',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DecimalPipe],
  templateUrl: './team-ranking.component.html',
  styleUrls: ['./team-ranking.component.css']
})
export class TeamRankingComponent implements OnInit, OnDestroy {
  ranking: TeamRankingDTO | null = null;
  loading = true;
  error: string | null = null;
  agenteId: number | null = null;

  private refreshSubscription?: Subscription;
  private readonly REFRESH_INTERVAL = 60000; // 1 minuto

  constructor(
    private teamRankingService: TeamRankingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.agenteId = this.authService.getUserId();
    if (this.agenteId) {
      this.loadRanking();
      this.startAutoRefresh();
    } else {
      this.error = 'No se pudo obtener el ID del usuario';
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadRanking(): void {
    if (!this.agenteId) return;

    this.loading = true;
    this.teamRankingService.getRankingEquipo(this.agenteId).subscribe({
      next: (data) => {
        this.ranking = data;
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Error cargando ranking:', err);
        this.error = 'Error al cargar el ranking del equipo';
        this.loading = false;
      }
    });
  }

  private startAutoRefresh(): void {
    this.refreshSubscription = interval(this.REFRESH_INTERVAL).subscribe(() => {
      this.loadRanking();
    });
  }

  private stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // Helpers para el template
  getMedalIcon(posicion: number): string {
    switch (posicion) {
      case 1: return 'trophy';
      case 2: return 'medal';
      case 3: return 'award';
      default: return 'user';
    }
  }

  getMedalColor(posicion: number): string {
    switch (posicion) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#64748b';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'minus';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      default: return '#6B7280';
    }
  }

  getEfectividadColor(efectividad: number): string {
    if (efectividad >= 80) return '#10B981';
    if (efectividad >= 50) return '#F59E0B';
    return '#EF4444';
  }

  formatMonto(monto: number): string {
    if (monto >= 1000000) {
      return (monto / 1000000).toFixed(1) + 'M';
    }
    if (monto >= 1000) {
      return (monto / 1000).toFixed(1) + 'K';
    }
    return monto.toFixed(0);
  }

  refresh(): void {
    this.loadRanking();
  }
}
