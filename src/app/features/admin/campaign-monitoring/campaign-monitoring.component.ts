import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
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

  // Timer local para conteo fluido de segundos
  private localTimerSubscription?: Subscription;

  // Sistema de alertas
  alertaActiva: AgentAlert | null = null;
  alertasDismissed: Set<string> = new Set(); // IDs de alertas ya cerradas (agente-estado)
  soundEnabled = false; // El usuario debe activar el sonido manualmente (política de navegadores)

  private readonly SOUND_STORAGE_KEY = 'supervisor_sound_enabled';

  // Modal de cambio de estado de agente
  showChangeStatusModal = false;
  selectedAgentForStatusChange: AgenteMonitoreo | null = null;
  changingStatus = false;
  estadosDisponibles = [
    { value: 'DISPONIBLE', label: 'Disponible', icon: 'circle', color: '#10B981' },
    { value: 'EN_REUNION', label: 'En Reunión', icon: 'users', color: '#8B5CF6' },
    { value: 'REFRIGERIO', label: 'Refrigerio', icon: 'coffee', color: '#F59E0B' },
    { value: 'SSHH', label: 'SSHH', icon: 'user', color: '#F59E0B' },
    { value: 'EN_MANUAL', label: 'Modo Manual', icon: 'pencil', color: '#6B7280' }
  ];

  constructor(
    private campaignService: CampaignAdminService,
    private autoDialerService: AutoDialerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSoundPreference(); // Cargar preferencia guardada
    this.initAlarmAudio();
    this.loadCampaigns();
    this.startAutoDialerPolling();
    this.startAgentesPolling();
    this.startLlamadasPolling();
    this.startLocalTimer(); // Timer local para conteo fluido
  }

  /**
   * Timer local que incrementa los segundos cada 1 segundo
   * para que el conteo sea fluido en lugar de saltar cada 3-5 segundos
   */
  private startLocalTimer(): void {
    this.localTimerSubscription = interval(1000).subscribe(() => {
      // Incrementar segundos de cada agente
      this.agentesMonitoreo.forEach(agente => {
        if (agente.segundosEnEstado !== undefined) {
          agente.segundosEnEstado++;
        }
      });
    });
  }

  /**
   * Carga la preferencia de sonido desde localStorage
   */
  private loadSoundPreference(): void {
    const saved = localStorage.getItem(this.SOUND_STORAGE_KEY);
    this.soundEnabled = saved === 'true';
  }

  /**
   * Guarda la preferencia de sonido en localStorage
   */
  private saveSoundPreference(): void {
    localStorage.setItem(this.SOUND_STORAGE_KEY, String(this.soundEnabled));
  }

  ngOnDestroy(): void {
    if (this.localTimerSubscription) {
      this.localTimerSubscription.unsubscribe();
    }
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

        // Debug: mostrar agentes con tiempo excedido
        const agentesExcedidos = agentes.filter(a => a.excedeTiempoMaximo);
        if (agentesExcedidos.length > 0) {
          console.log('[Monitor] Agentes con tiempo excedido:', agentesExcedidos.map(a => ({
            nombre: a.nombreCompleto,
            estado: a.estadoActual,
            excede: a.excedeTiempoMaximo,
            mensaje: a.mensajeAlerta,
            sonido: a.sonidoAlerta
          })));
        }

        // Verificar alertas de tiempo excedido
        this.checkAgentAlerts(agentes);
      },
      error: (err) => {
        console.error('Error polling agentes:', err);
      }
    });
  }

  // Mapa para rastrear el estado anterior de cada agente
  private previousAgentStates: Map<number, string> = new Map();

  /**
   * Verifica si hay agentes que exceden el tiempo y muestra alerta
   */
  private checkAgentAlerts(agentes: AgenteMonitoreo[]): void {
    // Primero, limpiar alertas dismisseadas si el agente cambió de estado
    for (const agente of agentes) {
      const prevState = this.previousAgentStates.get(agente.idUsuario);
      if (prevState && prevState !== agente.estadoActual) {
        // El agente cambió de estado, limpiar sus alertas dismisseadas
        console.log(`[Monitor] Agente ${agente.nombreCompleto} cambió de ${prevState} a ${agente.estadoActual}, limpiando alertas`);
        this.clearDismissedForAgent(agente.idUsuario);
      }
      this.previousAgentStates.set(agente.idUsuario, agente.estadoActual);
    }

    // Si ya hay una alerta activa, no mostrar otra
    if (this.alertaActiva) {
      console.log('[Monitor] Ya hay una alerta activa, no se mostrarán nuevas');
      return;
    }

    for (const agente of agentes) {
      if (agente.excedeTiempoMaximo && agente.mensajeAlerta) {
        const alertKey = `${agente.idUsuario}-${agente.estadoActual}`;

        // Si esta alerta ya fue cerrada, no mostrarla de nuevo
        if (this.alertasDismissed.has(alertKey)) {
          console.log(`[Monitor] Alerta ${alertKey} ya fue cerrada, ignorando`);
          continue;
        }

        // Mostrar alerta
        console.log(`[Monitor] Mostrando alerta para agente ${agente.nombreCompleto}`);
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

    // Reproducir alerta con voz si está habilitado
    if (agente.sonidoAlerta && this.soundEnabled) {
      this.speakAlert(agente);
      this.playAlarm();
    }
  }

  /**
   * Usa Text-to-Speech para anunciar la alerta (voz tipo Jarvis)
   */
  private speakAlert(agente: AgenteMonitoreo): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech no soportado');
      return;
    }

    const estadoHablado = this.getEstadoHablado(agente.estadoActual);
    const mensaje = `Atención. El agente ${agente.nombreCompleto} lleva demasiado tiempo en estado ${estadoHablado}. Requiere supervisión.`;

    // Cancelar habla anterior
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(mensaje);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;  // Velocidad
    utterance.pitch = 0.8; // Tono bajo = más serio
    utterance.volume = 1.0;

    // Buscar voz en español
    const voices = speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    speechSynthesis.speak(utterance);
  }

  /**
   * Convierte estado a texto hablado
   */
  private getEstadoHablado(estado: string): string {
    const estados: Record<string, string> = {
      'DISPONIBLE': 'disponible',
      'EN_LLAMADA': 'en llamada',
      'TIPIFICANDO': 'tipificando',
      'EN_REUNION': 'en reunión',
      'REFRIGERIO': 'refrigerio',
      'SSHH': 'baño',
      'EN_MANUAL': 'modo manual',
      'PAUSADO': 'pausado'
    };
    return estados[estado] || estado;
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
      // Detener voz también
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
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
    this.saveSoundPreference(); // Guardar preferencia

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

  // ==================== MODAL CAMBIO DE ESTADO ====================

  /**
   * Abre el modal para cambiar el estado de un agente
   */
  openChangeStatusModal(agente: AgenteMonitoreo): void {
    this.selectedAgentForStatusChange = agente;
    this.showChangeStatusModal = true;
  }

  /**
   * Cierra el modal de cambio de estado
   */
  closeChangeStatusModal(): void {
    this.showChangeStatusModal = false;
    this.selectedAgentForStatusChange = null;
    this.changingStatus = false;
  }

  /**
   * Maneja el click en el overlay del modal
   */
  onStatusModalOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('status-modal-overlay')) {
      this.closeChangeStatusModal();
    }
  }

  /**
   * Cambia el estado del agente seleccionado
   */
  changeAgentStatus(nuevoEstado: string): void {
    if (!this.selectedAgentForStatusChange || this.changingStatus) return;

    // No permitir cambiar a estados del sistema
    if (nuevoEstado === 'EN_LLAMADA' || nuevoEstado === 'TIPIFICANDO') {
      alert('Este estado solo puede ser cambiado por el sistema');
      return;
    }

    // No cambiar si ya está en ese estado
    if (this.selectedAgentForStatusChange.estadoActual === nuevoEstado) {
      this.closeChangeStatusModal();
      return;
    }

    this.changingStatus = true;
    const idUsuario = this.selectedAgentForStatusChange.idUsuario;
    const nombreAgente = this.selectedAgentForStatusChange.nombreCompleto;

    this.autoDialerService.cambiarEstadoAgente(idUsuario, nuevoEstado, `Cambiado por supervisor`).subscribe({
      next: (response) => {
        console.log(`✅ Estado de ${nombreAgente} cambiado a ${nuevoEstado}`, response);

        // Actualizar el estado localmente para feedback inmediato
        if (this.selectedAgentForStatusChange) {
          this.selectedAgentForStatusChange.estadoActual = nuevoEstado;
          this.selectedAgentForStatusChange.segundosEnEstado = 0;
        }

        this.closeChangeStatusModal();
      },
      error: (error) => {
        console.error(`❌ Error cambiando estado de ${nombreAgente}:`, error);
        alert(`Error al cambiar estado: ${error.error?.error || error.message || 'Error desconocido'}`);
        this.changingStatus = false;
      }
    });
  }

  /**
   * Verifica si un estado está actualmente seleccionado
   */
  isCurrentStatus(estado: string): boolean {
    return this.selectedAgentForStatusChange?.estadoActual === estado;
  }
}
