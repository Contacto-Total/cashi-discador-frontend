import { Component, OnInit, OnDestroy, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { CampaignAdminService, Campaign } from '../../../core/services/campaign-admin.service';
import { AutoDialerService, AutoDialerEstadisticas, AgenteMonitoreo, LlamadaTiempoReal } from '../../../core/services/autodialer.service';
import { StatusAlarmClockComponent } from '../../../shared/components/status-alarm-clock/status-alarm-clock.component';

// Interfaz para alertas de agentes
interface AgentAlert {
  agente: AgenteMonitoreo;
  timestamp: Date;
}

@Component({
  selector: 'app-campaign-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, StatusAlarmClockComponent],
  templateUrl: './campaign-monitoring.component.html',
  styleUrls: ['./campaign-monitoring.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CampaignMonitoringComponent implements OnInit, OnDestroy {
  // Campaigns
  campaigns: Campaign[] = [];
  selectedCampaignId: number | null = null;
  loadingCampaigns: boolean = false;

  // Auto-Dialer Stats
  autoDialerStats: AutoDialerEstadisticas | null = null;
  private autoDialerSubscription?: Subscription;

  // Agentes
  agentesMonitoreo: AgenteMonitoreo[] = [];
  private agentesSubscription?: Subscription;

  // Llamadas en tiempo real
  llamadasEnTiempoReal: LlamadaTiempoReal[] = [];
  private llamadasSubscription?: Subscription;

  // Sistema de alertas
  alertaActiva: AgentAlert | null = null;
  alertasDismissed: Set<string> = new Set(); // IDs de alertas ya cerradas (agente-estado)
  soundEnabled = false; // El usuario debe activar el sonido manualmente (política de navegadores)

  constructor(
    private campaignService: CampaignAdminService,
    private autoDialerService: AutoDialerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initAlarmAudio();
    this.loadCampaigns();
    this.startAutoDialerPolling();
    this.startAgentesPolling();
    this.startLlamadasPolling();
  }

  ngOnDestroy(): void {
    if (this.autoDialerSubscription) {
      this.autoDialerSubscription.unsubscribe();
    }
    if (this.agentesSubscription) {
      this.agentesSubscription.unsubscribe();
    }
    if (this.llamadasSubscription) {
      this.llamadasSubscription.unsubscribe();
    }
    this.stopAlarm();
    // Cerrar el AudioContext
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  /**
   * Inicializa el audio de alarma usando Web Audio API para generar un beep
   */
  private initAlarmAudio(): void {
    // Crear un AudioContext para generar sonidos programáticamente
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isAlarmPlaying = false;

  /**
   * Carga todas las campañas para el selector
   */
  loadCampaigns(): void {
    this.loadingCampaigns = true;
    this.campaignService.getAllCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.loadingCampaigns = false;

        // Auto-select first active campaign
        if (campaigns.length > 0 && !this.selectedCampaignId) {
          const activeCampaign = campaigns.find(c => c.status === 'ACTIVE');
          this.selectedCampaignId = activeCampaign?.id || campaigns[0].id || null;
        }
      },
      error: (err) => {
        console.error('Error loading campaigns:', err);
        this.loadingCampaigns = false;
      }
    });
  }

  /**
   * Handler cuando se selecciona una campaña diferente
   */
  onCampaignChange(): void {
    console.log('Selected campaign changed to:', this.selectedCampaignId);

    // Restart stats polling with new campaign filter
    if (this.autoDialerSubscription) {
      this.autoDialerSubscription.unsubscribe();
    }
    this.startAutoDialerPolling();

    // Restart llamadas polling with new campaign filter
    if (this.llamadasSubscription) {
      this.llamadasSubscription.unsubscribe();
    }
    this.startLlamadasPolling();
  }

  /**
   * Inicia polling del estado del auto-dialer cada 5 segundos
   * Filtra por campaña si hay una seleccionada
   */
  startAutoDialerPolling(): void {
    const campaignId = this.selectedCampaignId || undefined;
    this.autoDialerSubscription = this.autoDialerService.startStatsPolling(campaignId).subscribe({
      next: (stats) => {
        this.autoDialerStats = stats;
      },
      error: (err) => {
        console.error('Error polling auto-dialer stats:', err);
      }
    });
  }

  /**
   * Inicia polling de agentes cada 3 segundos
   */
  startAgentesPolling(): void {
    this.agentesSubscription = this.autoDialerService.startAgentesPolling().subscribe({
      next: (agentes) => {
        this.agentesMonitoreo = agentes;
        // Verificar alertas de tiempo excedido
        this.checkAgentAlerts(agentes);
      },
      error: (err) => {
        console.error('Error polling agentes:', err);
      }
    });
  }

  /**
   * Verifica si hay agentes que exceden el tiempo y muestra alerta
   */
  private checkAgentAlerts(agentes: AgenteMonitoreo[]): void {
    // Si ya hay una alerta activa, no mostrar otra
    if (this.alertaActiva) return;

    for (const agente of agentes) {
      if (agente.excedeTiempoMaximo && agente.mensajeAlerta) {
        const alertKey = `${agente.idUsuario}-${agente.estadoActual}`;

        // Si esta alerta ya fue cerrada, no mostrarla de nuevo
        if (this.alertasDismissed.has(alertKey)) continue;

        // Mostrar alerta
        this.showAlert(agente);
        break;
      }
    }
  }

  /**
   * Muestra la alerta para un agente
   */
  showAlert(agente: AgenteMonitoreo): void {
    this.alertaActiva = {
      agente,
      timestamp: new Date()
    };

    // Reproducir sonido si está habilitado
    if (agente.sonidoAlerta) {
      this.playAlarm();
    }
  }

  /**
   * Cierra la alerta actual
   */
  dismissAlert(): void {
    if (this.alertaActiva) {
      const alertKey = `${this.alertaActiva.agente.idUsuario}-${this.alertaActiva.agente.estadoActual}`;
      this.alertasDismissed.add(alertKey);
      this.alertaActiva = null;
      this.stopAlarm();
    }
  }

  /**
   * Cierra alerta si se hace click fuera del modal
   */
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('alert-overlay')) {
      this.dismissAlert();
    }
  }

  /**
   * Activa/desactiva el sonido de alertas
   * El usuario debe hacer click para activar (política de navegadores)
   */
  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;

    if (this.soundEnabled && this.audioContext) {
      // Reanudar AudioContext con interacción del usuario
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      // Hacer un beep corto de confirmación
      this.playTestBeep();
    }
  }

  /**
   * Reproduce un beep corto de prueba/confirmación
   */
  private playTestBeep(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  /**
   * Reproduce el sonido de alarma usando Web Audio API
   * Genera un beep intermitente tipo alarma
   */
  private playAlarm(): void {
    // Solo reproducir si el sonido está habilitado
    if (!this.audioContext || this.isAlarmPlaying || !this.soundEnabled) return;

    try {
      // Reanudar el AudioContext si está suspendido (política de autoplay)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      this.isAlarmPlaying = true;
      this.startBeepSequence();
    } catch (err) {
      console.warn('No se pudo reproducir la alarma:', err);
    }
  }

  /**
   * Inicia una secuencia de beeps intermitentes
   */
  private startBeepSequence(): void {
    if (!this.audioContext || !this.isAlarmPlaying) return;

    // Crear oscilador y ganancia para cada beep
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Configurar el tono de alarma (frecuencia alta = urgente)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // La5

    // Configurar volumen
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);

    // Duración del beep: 200ms
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);

    // Programar el siguiente beep después de 400ms (200ms beep + 200ms silencio)
    oscillator.onended = () => {
      if (this.isAlarmPlaying) {
        setTimeout(() => this.startBeepSequence(), 200);
      }
    };
  }

  /**
   * Detiene el sonido de alarma
   */
  private stopAlarm(): void {
    this.isAlarmPlaying = false;
  }

  /**
   * Limpia las alertas cerradas cuando un agente cambia de estado
   */
  clearDismissedForAgent(idUsuario: number): void {
    const keysToRemove: string[] = [];
    this.alertasDismissed.forEach(key => {
      if (key.startsWith(`${idUsuario}-`)) {
        keysToRemove.push(key);
      }
    });
    keysToRemove.forEach(key => this.alertasDismissed.delete(key));
  }

  /**
   * Inicia polling de llamadas en tiempo real
   * Filtra por campaña si hay una seleccionada
   */
  startLlamadasPolling(): void {
    const campaignId = this.selectedCampaignId || undefined;
    this.llamadasSubscription = this.autoDialerService.startLlamadasPolling(campaignId).subscribe({
      next: (llamadas) => {
        this.llamadasEnTiempoReal = llamadas;
      },
      error: (err) => {
        console.error('Error polling llamadas en tiempo real:', err);
      }
    });
  }

  /**
   * Obtiene la hora actual en formato HH:MM:SS
   */
  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('es-PE', { hour12: false });
  }

  /**
   * Obtiene el color según el estado del agente
   */
  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return '#10B981'; // Verde
      case 'EN_LLAMADA': return '#3B82F6'; // Azul
      case 'DESCONECTADO': return '#EF4444'; // Rojo
      case 'PAUSADO': return '#F59E0B'; // Amarillo
      case 'EN_REUNION': return '#8B5CF6'; // Púrpura
      case 'REFRIGERIO': return '#F59E0B'; // Amarillo
      case 'SSHH': return '#F59E0B'; // Amarillo
      case 'TIPIFICANDO': return '#06B6D4'; // Cyan
      default: return '#6B7280'; // Gris
    }
  }

  /**
   * Obtiene el ícono según el estado del agente
   */
  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'circle';
      case 'EN_LLAMADA': return 'phone-call';
      case 'DESCONECTADO': return 'circle';
      case 'PAUSADO': return 'pause';
      case 'EN_REUNION': return 'users';
      case 'REFRIGERIO': return 'coffee';
      case 'SSHH': return 'user';
      case 'TIPIFICANDO': return 'edit';
      default: return 'circle';
    }
  }

  /**
   * Obtiene texto legible del estado
   */
  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'Libre';
      case 'EN_LLAMADA': return 'En Llamada';
      case 'DESCONECTADO': return 'Desconectado';
      case 'PAUSADO': return 'Pausado';
      case 'EN_REUNION': return 'En Reunión';
      case 'REFRIGERIO': return 'Refrigerio';
      case 'SSHH': return 'SSHH';
      case 'TIPIFICANDO': return 'Tipificando';
      default: return estado;
    }
  }

  /**
   * Formatea segundos a formato MM:SS o HH:MM:SS
   */
  formatTiempo(segundos: number): string {
    if (!segundos || segundos < 0) return '-';

    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    } else {
      return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Navega de vuelta a campañas
   */
  goBack(): void {
    this.router.navigate(['/admin/campaigns']);
  }

  /**
   * Navega a la pantalla de registro de extensiones
   */
  navigateToExtensions(): void {
    this.router.navigate(['/admin/extensions']);
  }
}
