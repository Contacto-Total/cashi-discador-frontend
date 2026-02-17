import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, interval, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { asyncScheduler } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { CampaignAdminService, Campaign } from '../../../core/services/campaign-admin.service';
import { AutoDialerService, AutoDialerEstadisticas, AgenteMonitoreo, LlamadaTiempoReal } from '../../../core/services/autodialer.service';
import { WebsocketService } from '../../../core/services/websocket.service';
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

  // WebSocket real-time push
  private wsSubscription?: Subscription;
  private fallbackSubscription?: Subscription;
  private refreshTrigger$ = new Subject<void>();

  // Timer local para conteo fluido de segundos
  private localTimerSubscription?: Subscription;

  // Sistema de alertas
  alertaActiva: AgentAlert | null = null;
  alertasDismissed: Set<string> = new Set(); // IDs de alertas ya cerradas (agente-estado)
  soundEnabled = false; // El usuario debe activar el sonido manualmente (política de navegadores)

  // Timer de alerta con progreso visual
  alertDuration = 0; // Duración total en segundos
  alertRemainingTime = 0; // Tiempo restante en segundos
  alertProgress = 100; // Porcentaje de progreso (100 -> 0)
  private alertTimerSubscription?: Subscription;

  // Duraciones por tipo de estado (en segundos)
  private readonly ALERT_DURATIONS: Record<string, number> = {
    'DISPONIBLE': 8,
    'EN_LLAMADA': 10,
    'TIPIFICANDO': 10,
    'EN_REUNION': 12,
    'REFRIGERIO': 12,
    'SSHH': 10,
    'EN_MANUAL': 8,
    'PAUSADO': 8
  };
  private readonly DEFAULT_ALERT_DURATION = 10;

  private readonly SOUND_STORAGE_KEY = 'supervisor_sound_enabled';
  private readonly ALERTS_STORAGE_KEY = 'supervisor_alerts_enabled';
  alertsEnabled = true; // Mostrar modales de alerta (se guarda en localStorage)

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
    private websocketService: WebsocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSoundPreference(); // Cargar preferencia guardada
    this.loadAlertsPreference(); // Cargar preferencia de alertas
    this.initAlarmAudio();
    this.initSpeechVoices(); // Pre-cargar voces de texto a voz
    this.loadCampaigns();
    this.setupWebSocketMonitoring(); // WebSocket push en tiempo real
    this.setupFallbackPolling();     // Poll de respaldo cada 30s
    this.refreshAllData();           // Fetch inicial
    this.startLocalTimer();          // Timer local para conteo fluido
  }

  /**
   * Pre-carga las voces de speechSynthesis para evitar delays
   */
  private initSpeechVoices(): void {
    if (!('speechSynthesis' in window)) return;

    // Función para cargar voces
    const loadVoices = () => {
      this.speechVoices = speechSynthesis.getVoices();
      this.spanishVoice = this.speechVoices.find(v => v.lang.startsWith('es')) || null;
      console.log(`[Monitor] Voces cargadas: ${this.speechVoices.length}, voz española: ${this.spanishVoice?.name || 'ninguna'}`);
    };

    // Cargar voces inmediatamente si están disponibles
    loadVoices();

    // También escuchar el evento voiceschanged (necesario en algunos navegadores)
    speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
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

  /**
   * Carga la preferencia de alertas desde localStorage
   */
  private loadAlertsPreference(): void {
    const saved = localStorage.getItem(this.ALERTS_STORAGE_KEY);
    this.alertsEnabled = saved !== 'false'; // Por defecto activadas
  }

  /**
   * Activa/desactiva los modales de alerta (solo para este navegador)
   */
  toggleAlerts(): void {
    this.alertsEnabled = !this.alertsEnabled;
    localStorage.setItem(this.ALERTS_STORAGE_KEY, String(this.alertsEnabled));

    // Si se desactivan, cerrar alerta activa
    if (!this.alertsEnabled && this.alertaActiva) {
      this.dismissAlert();
    }
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
    this.fallbackSubscription?.unsubscribe();
    this.localTimerSubscription?.unsubscribe();
    this.autoDialerSubscription?.unsubscribe();
    this.agentesSubscription?.unsubscribe();
    this.llamadasSubscription?.unsubscribe();
    this.alertTimerSubscription?.unsubscribe();
    this.refreshTrigger$.complete();
    this.stopAlarm();
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

  // Voces de speechSynthesis pre-cargadas
  private speechVoices: SpeechSynthesisVoice[] = [];
  private spanishVoice: SpeechSynthesisVoice | null = null;

  /**
   * Carga todas las campañas para el selector
   */
  loadCampaigns(): void {
    this.loadingCampaigns = true;
    this.campaignService.getAllCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.loadingCampaigns = false;

        // Auto-select first active campaign and restart pollings with campaign filter
        if (campaigns.length > 0 && !this.selectedCampaignId) {
          const activeCampaign = campaigns.find(c => c.status === 'ACTIVE');
          this.selectedCampaignId = activeCampaign?.id || campaigns[0].id || null;
          // Reiniciar pollings con la campaña seleccionada
          this.onCampaignChange();
        }
      },
      error: (err) => {
        console.error('Error loading campaigns:', err);
        this.loadingCampaigns = false;
      }
    });
  }

  /**
   * Configura la suscripción WebSocket para actualizaciones instantáneas.
   * Cada evento se debouncea 500ms para agrupar ráfagas de eventos.
   */
  private setupWebSocketMonitoring(): void {
    // Throttle: reaccionar inmediato al primer evento, luego 1 refresh por segundo máximo
    this.wsSubscription = this.websocketService.subscribe('/topic/campaign-monitoring')
      .pipe(throttleTime(1000, asyncScheduler, { leading: true, trailing: true }))
      .subscribe({
        next: () => {
          this.refreshAllData();
        },
        error: (err) => {
          console.error('[Monitor] Error en WebSocket campaign-monitoring:', err);
        }
      });
    console.log('[Monitor] WebSocket suscrito a /topic/campaign-monitoring');
  }

  /**
   * Poll de respaldo cada 30s por si el WebSocket se desconecta
   */
  private setupFallbackPolling(): void {
    this.fallbackSubscription = interval(30000).subscribe(() => {
      this.refreshAllData();
    });
  }

  /**
   * Fetch de todos los datos (estadísticas, agentes, llamadas) en paralelo
   */
  refreshAllData(): void {
    const campaignId = this.selectedCampaignId || undefined;

    this.autoDialerService.getEstadisticas(campaignId).subscribe({
      next: (stats) => { this.autoDialerStats = stats; },
      error: (err) => { console.error('Error fetching stats:', err); }
    });

    this.autoDialerService.getAgentesMonitoreo(campaignId).subscribe({
      next: (agentes) => {
        this.mergeAgentes(agentes);
        this.checkAgentAlerts(this.agentesMonitoreo);
      },
      error: (err) => { console.error('Error fetching agentes:', err); }
    });

    const llamadas$ = campaignId
      ? this.autoDialerService.getLlamadasEnTiempoRealByCampaign(campaignId)
      : this.autoDialerService.getLlamadasEnTiempoReal();

    llamadas$.subscribe({
      next: (llamadas) => { this.mergeLlamadas(llamadas); },
      error: (err) => { console.error('Error fetching llamadas:', err); }
    });
  }

  /**
   * Actualiza agentes en-place para evitar flickering del DOM.
   * Solo agrega/elimina filas cuando hay cambios reales en la lista.
   */
  private mergeAgentes(newAgentes: AgenteMonitoreo[]): void {
    const existingMap = new Map<number, AgenteMonitoreo>();
    this.agentesMonitoreo.forEach(a => existingMap.set(a.idUsuario, a));

    const newIds = new Set<number>();

    for (const newAgent of newAgentes) {
      newIds.add(newAgent.idUsuario);
      const existing = existingMap.get(newAgent.idUsuario);

      if (existing) {
        // Actualizar propiedades en el objeto existente (sin reemplazar la referencia)
        existing.sipExtension = newAgent.sipExtension;
        existing.nombreCompleto = newAgent.nombreCompleto;
        existing.estadoActual = newAgent.estadoActual;
        existing.telefonoDestino = newAgent.telefonoDestino;
        existing.segundosEnEstado = newAgent.segundosEnEstado;
        existing.uuidLlamadaActual = newAgent.uuidLlamadaActual;
        existing.colorIndicador = newAgent.colorIndicador;
        existing.porcentajeTiempo = newAgent.porcentajeTiempo;
        existing.excedeTiempoMaximo = newAgent.excedeTiempoMaximo;
        existing.tiempoMaximoSegundos = newAgent.tiempoMaximoSegundos;
        existing.mensajeAlerta = newAgent.mensajeAlerta;
        existing.sonidoAlerta = newAgent.sonidoAlerta;
        existing.peripheralStatus = newAgent.peripheralStatus;
      } else {
        // Agente nuevo: agregar al array
        this.agentesMonitoreo.push(newAgent);
      }
    }

    // Eliminar agentes que ya no están en la respuesta
    for (let i = this.agentesMonitoreo.length - 1; i >= 0; i--) {
      if (!newIds.has(this.agentesMonitoreo[i].idUsuario)) {
        this.agentesMonitoreo.splice(i, 1);
      }
    }
  }

  /**
   * Actualiza llamadas en-place para evitar flickering del DOM.
   */
  private mergeLlamadas(newLlamadas: LlamadaTiempoReal[]): void {
    const existingMap = new Map<number, LlamadaTiempoReal>();
    this.llamadasEnTiempoReal.forEach(l => existingMap.set(l.id, l));

    const newIds = new Set<number>();

    for (const newLlamada of newLlamadas) {
      newIds.add(newLlamada.id);
      const existing = existingMap.get(newLlamada.id);

      if (existing) {
        existing.anexoDestino = newLlamada.anexoDestino;
        existing.anexoAgente = newLlamada.anexoAgente;
        existing.nombreAgente = newLlamada.nombreAgente;
        existing.estadoLlamada = newLlamada.estadoLlamada;
        existing.duracionSegundos = newLlamada.duracionSegundos;
      } else {
        this.llamadasEnTiempoReal.push(newLlamada);
      }
    }

    // Eliminar llamadas que ya no están activas
    for (let i = this.llamadasEnTiempoReal.length - 1; i >= 0; i--) {
      if (!newIds.has(this.llamadasEnTiempoReal[i].id)) {
        this.llamadasEnTiempoReal.splice(i, 1);
      }
    }
  }

  /**
   * Handler cuando se selecciona una campaña diferente
   */
  onCampaignChange(): void {
    console.log('Selected campaign changed to:', this.selectedCampaignId);
    this.refreshAllData(); // Fetch inmediato con nueva campaña
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

    // Si las alertas están desactivadas, no mostrar ninguna
    if (!this.alertsEnabled) return;

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

    // Iniciar timer de alerta con duración según el tipo de estado
    this.startAlertTimer(agente.estadoActual);

    // Reproducir alerta con voz si el sonido está habilitado
    // Siempre reproducir para todas las alertas (no depende de sonidoAlerta del backend)
    if (this.soundEnabled) {
      this.speakAlert(agente);
      this.playAlarm();
    }
  }

  /**
   * Inicia el timer de la alerta con progreso visual
   */
  private startAlertTimer(estado: string): void {
    // Limpiar timer anterior si existe
    if (this.alertTimerSubscription) {
      this.alertTimerSubscription.unsubscribe();
    }

    // Obtener duración según el estado
    this.alertDuration = this.ALERT_DURATIONS[estado] || this.DEFAULT_ALERT_DURATION;
    this.alertRemainingTime = this.alertDuration;
    this.alertProgress = 100;

    // Iniciar countdown cada 100ms para animación fluida
    this.alertTimerSubscription = interval(100).subscribe(() => {
      this.alertRemainingTime -= 0.1;
      this.alertProgress = (this.alertRemainingTime / this.alertDuration) * 100;

      if (this.alertRemainingTime <= 0) {
        this.dismissAlert();
      }
    });
  }

  /**
   * Detiene el timer de la alerta
   */
  private stopAlertTimer(): void {
    if (this.alertTimerSubscription) {
      this.alertTimerSubscription.unsubscribe();
      this.alertTimerSubscription = undefined;
    }
    this.alertDuration = 0;
    this.alertRemainingTime = 0;
    this.alertProgress = 100;
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

    // Delay necesario después de cancel() para evitar bug de Chrome
    // donde speak() es ignorado si se llama inmediatamente después de cancel()
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(mensaje);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;  // Velocidad
      utterance.pitch = 0.8; // Tono bajo = más serio
      utterance.volume = 1.0;

      // Usar voz pre-cargada si está disponible
      if (this.spanishVoice) {
        utterance.voice = this.spanishVoice;
      }

      speechSynthesis.speak(utterance);
    }, 100); // 100ms de delay para asegurar que cancel() termine
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
      this.stopAlertTimer();
      this.stopAlarm();
      // Detener voz también
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }

      // Verificar si hay más alertas pendientes después de un pequeño delay
      // para permitir que el estado se actualice correctamente
      setTimeout(() => {
        if (this.agentesMonitoreo.length > 0) {
          this.checkAgentAlerts(this.agentesMonitoreo);
        }
      }, 500); // 500ms de delay para evitar conflictos con speechSynthesis
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
  private async playAlarm(): Promise<void> {
    // Solo reproducir si el sonido está habilitado
    if (!this.audioContext || this.isAlarmPlaying || !this.soundEnabled) return;

    try {
      // Reanudar el AudioContext si está suspendido (política de autoplay)
      // Esperar a que se complete antes de reproducir
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Verificar que el contexto esté activo
      if (this.audioContext.state !== 'running') {
        console.warn('[Monitor] AudioContext no está en estado running:', this.audioContext.state);
        return;
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


  // trackBy para evitar re-render completo del DOM en cada polling
  trackByLlamada(index: number, llamada: any): string {
    return llamada.id || llamada.uuidLlamada || index.toString();
  }

  trackByAgente(index: number, agente: any): number {
    return agente.idUsuario || index;
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
   * Obtiene la etiqueta legible del estado de llamada
   */
  getEstadoLlamadaLabel(estado: string): string {
    const map: Record<string, string> = {
      'INICIADA': 'Iniciada',
      'MARCANDO': 'Timbrando',
      'CONECTADA': 'Contestada',
      'EN_COLA': 'En cola',
      'EN_CURSO': 'Con asesor'
    };
    return map[estado] || estado;
  }

  /**
   * Obtiene el color del badge según el estado de llamada
   */
  getEstadoLlamadaColor(estado: string): string {
    const map: Record<string, string> = {
      'INICIADA': '#64748b',   // gris
      'MARCANDO': '#eab308',   // amarillo
      'CONECTADA': '#f97316',  // naranja
      'EN_COLA': '#a855f7',    // morado
      'EN_CURSO': '#22c55e'    // verde
    };
    return map[estado] || '#3B82F6';
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

  // ==================== PERIFÉRICOS ====================

  getPeripheralColor(status: string): string {
    if (!status || status === 'OK') return '#22c55e'; // verde
    if (status === 'DESCONOCIDO') return '#94a3b8'; // gris
    return '#ef4444'; // rojo
  }

  getPeripheralTooltip(status: string): string {
    switch (status) {
      case 'OK': return 'Periféricos OK';
      case 'MIC_MISSING': return 'Sin micrófono detectado';
      case 'MIC_PERMISSION': return 'Permiso de micrófono bloqueado';
      case 'MIC_DISCONNECTED': return 'Micrófono desconectado';
      case 'SPEAKER_MISSING': return 'Sin parlante detectado';
      case 'SIP_DISCONNECTED': return 'Sin conexión SIP';
      case 'DESCONOCIDO': return 'Sin información de periféricos';
      default: return 'Problema con periféricos';
    }
  }
}
