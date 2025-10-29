import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgentStatusService } from '../../core/services/agent-status.service';
import { AuthService } from '../../core/services/auth.service';
import {
  AgentStatus,
  AgentState,
  AGENT_STATE_LABELS,
  MANUAL_STATES
} from '../../core/models/agent-status.model';

@Component({
  selector: 'app-agent-status-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-status-dashboard.component.html',
  styleUrls: ['./agent-status-dashboard.component.css']
})
export class AgentStatusDashboardComponent implements OnInit, OnDestroy {
  currentStatus: AgentStatus | null = null;
  agentName: string = '';
  loading: boolean = false;
  error: string | null = null;

  private statusSubscription?: Subscription;

  // Estados disponibles
  AgentState = AgentState;
  stateLabels = AGENT_STATE_LABELS;
  manualStates = MANUAL_STATES;

  constructor(
    private agentStatusService: AgentStatusService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.agentName = user.firstName + ' ' + user.lastName || user.username;
    this.loadAgentStatus(user.id);

    // Polling cada 30 segundos
    this.statusSubscription = this.agentStatusService
      .startStatusPolling(user.id)
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  loadAgentStatus(userId: number): void {
    this.loading = true;
    this.error = null;

    this.agentStatusService.getAgentStatus(userId).subscribe({
      next: (response) => {
        this.currentStatus = {
          idUsuario: response.idUsuario,
          estadoActual: response.estadoActual as AgentState,
          estadoAnterior: response.estadoAnterior as AgentState | undefined,
          timestampCambio: response.timestampCambio,
          tiempoEnEstadoMinutos: response.tiempoEnEstadoMinutos,
          notas: response.notas,
          sessionId: response.sessionId
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading agent status:', err);
        this.error = 'Error al cargar el estado del agente';
        this.loading = false;
      }
    });

    // Suscribirse a cambios del estado
    this.agentStatusService.currentStatus$.subscribe(status => {
      if (status) {
        this.currentStatus = status;
      }
    });
  }

  changeStatus(newState: AgentState): void {
    if (!this.currentStatus || this.loading) return;

    this.loading = true;
    this.error = null;

    this.agentStatusService.changeStatus(this.currentStatus.idUsuario, {
      estado: newState,
      notas: `Cambio manual a ${this.stateLabels[newState]}`
    }).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        console.error('Error changing status:', err);
        this.error = 'Error al cambiar el estado';
        this.loading = false;
      }
    });
  }

  enterManualMode(): void {
    if (!this.currentStatus || this.loading) return;

    this.loading = true;
    this.error = null;

    this.agentStatusService.enterManualMode(this.currentStatus.idUsuario).subscribe({
      next: () => {
        this.loading = false;
        // Navegar al softphone
        this.router.navigate(['/dialer']);
      },
      error: (err) => {
        console.error('Error entering manual mode:', err);
        this.error = 'Error al entrar en modo manual';
        this.loading = false;
      }
    });
  }

  getStateColor(state: AgentState): string {
    const colors: Record<AgentState, string> = {
      [AgentState.DISPONIBLE]: '#4caf50',
      [AgentState.EN_REUNION]: '#ff9800',
      [AgentState.REFRIGERIO]: '#2196f3',
      [AgentState.SSHH]: '#9c27b0',
      [AgentState.EN_LLAMADA]: '#f44336',
      [AgentState.TIPIFICANDO]: '#ff5722',
      [AgentState.EN_MANUAL]: '#607d8b'
    };
    return colors[state] || '#757575';
  }

  isCurrentState(state: AgentState): boolean {
    return this.currentStatus?.estadoActual === state;
  }

  canChangeToState(state: AgentState): boolean {
    // No puede cambiar si está en llamada o tipificando
    if (this.currentStatus?.estadoActual === AgentState.EN_LLAMADA ||
        this.currentStatus?.estadoActual === AgentState.TIPIFICANDO) {
      return false;
    }
    // Solo puede cambiar a estados manuales
    return this.manualStates.includes(state);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
