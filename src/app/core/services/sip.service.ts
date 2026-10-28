import { Injectable, EventEmitter, inject } from '@angular/core';
import JsSIP from 'jssip';
import { WebsocketService } from './websocket.service';
import { AudioDeviceService } from './audio-device.service';
import { AudioTelemetryService, EventoAudio } from './audio-telemetry.service';
import { distinctUntilChanged, skip } from 'rxjs';

export enum CallState {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  RINGING = 'RINGING',
  ACTIVE = 'ACTIVE',
  HELD = 'HELD',
  ENDED = 'ENDED'
}

@Injectable({
  providedIn: 'root'
})
export class SipService {
  private ua: any | null = null;
  private currentSession: any | null = null;

  /** Hay una llamada establecida o en curso de establecerse. */
  get enLlamada(): boolean {
    return !!this.currentSession;
  }
  private currentCallState: CallState = CallState.IDLE;
  private remoteAudio: HTMLAudioElement | null = null;
  private ringtoneAudio: HTMLAudioElement | null = null;
  private localStream: MediaStream | null = null;
  private autoAnswerEnabled: boolean = false;  // For admin supervision mode
  private blockIncomingCalls: boolean = false;  // Block incoming calls during ACW/tipification
  private _isRellamadaActive: boolean = false;  // Flag: rellamada en progreso (ignore call events in app.component)
  private _pruebaActiva: boolean = false;  // Llamada de prueba de /settings (ver llamarPrueba)
  private bloqueoAntesDePrueba: boolean = false;
  public lastHangupCause: string = '';  // Último motivo de cuelgue SIP

  public onCallStatus = new EventEmitter<CallState>();
  public onError = new EventEmitter<string>();
  public onRegistered = new EventEmitter<boolean>();
  public onIncomingCall = new EventEmitter<{ from: string }>();
  public onOutgoingCall = new EventEmitter<{ to: string }>();

  // Guardar número de destino actual para llamadas salientes
  // Permite que collection-management lo lea al inicializarse
  private currentOutgoingNumber: string | null = null;
  // Cuando el asesor pidio la llamada saliente. Acota cuanto tiempo vale la excepcion
  // del candado de entrantes; ver esperandoLlamadaPropia().
  private outgoingRequestedAt: number | null = null;
  private currentCallIncoming: boolean = false; // Dirección de la llamada actual
  private currentPredictiveCallUuid: string | null = null;


  private websocketService = inject(WebsocketService);
  private audioDeviceService = inject(AudioDeviceService);
  private audioTelemetry = inject(AudioTelemetryService);
  private currentExtension: string | null = null;

  // Apertura de micrófono en curso: los que piden micrófono a la vez esperan a la misma
  private micSwitch: Promise<MediaStream> | null = null;
  private devicechangeTimer: any = null;
  // El parlante elegido se desconectó y el audio sale por el del sistema
  private salidaPerdida = false;

  constructor() {
    // Enable JsSIP debug (disable in production)
    JsSIP.debug.enable('JsSIP:*');

    // Create audio element for remote stream
    this.remoteAudio = new Audio();
    this.remoteAudio.autoplay = true;

    // Create audio element for ringtone (incoming calls only)
    this.ringtoneAudio = new Audio('assets/sounds/ringtone.mp3');
    this.ringtoneAudio.loop = true;

    // El micrófono se abre al registrar y se reutiliza en todas las llamadas. Si el headset
    // se desconecta o vuelve, o el asesor lo cambia en /settings, se reemplaza sin recargar.
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', () => this.onDevicesChanged());
    }
    this.audioDeviceService.getSelectedInputId().pipe(skip(1), distinctUntilChanged()).subscribe(() => {
      if (this.localStream) {
        this.aplicarMicrofonoPreferido('configuracion')
          .catch(err => this.reportarAudio('MIC_NO_DISPONIBLE', null, this.describirError(err)));
      }
    });
    this.audioDeviceService.getSelectedOutputId().pipe(skip(1), distinctUntilChanged())
      .subscribe(() => this.applyOutputDevice());
  }

  /**
   * Enable auto-answer mode (for admin supervision)
   */
  enableAutoAnswer(): void {
    this.autoAnswerEnabled = true;
    console.log('🤖 Auto-answer enabled for admin supervision');
  }

  /**
   * Disable auto-answer mode
   */
  disableAutoAnswer(): void {
    this.autoAnswerEnabled = false;
    console.log('🤖 Auto-answer disabled');
  }

  /**
   * True si el asesor acaba de pedir una llamada y todavia esta esperando su pata.
   *
   * La manual y la rellamada no se marcan desde el navegador: el backend hace
   * `originate user/<anexo> &bridge(<cliente>)`, asi que la propia llamada del asesor
   * le entra como un INVITE igual que una predictiva. Sin esta excepcion el candado de
   * abajo la rechazaba con 486 y la llamada no podia existir, porque la pantalla de
   * Gestion Manual deja al asesor en TIPIFICANDO desde que abre la ficha y el dashboard
   * bloquea las entrantes con cualquier estado distinto de DISPONIBLE. El resultado era
   * un ciclo cerrado: falla la llamada, vuelve a TIPIFICANDO, falla la siguiente.
   *
   * Acotado en el tiempo a proposito. Si el originate nunca llega a sonar, nadie llama a
   * clearCurrentOutgoingNumber() y la bandera se queda puesta; sin el plazo, eso dejaria
   * al asesor aceptando predictivas durante toda su tipificacion, que es justo lo que el
   * candado existe para evitar.
   */
  private esperandoLlamadaPropia(): boolean {
    if (!this.currentOutgoingNumber || this.outgoingRequestedAt === null) {
      return false;
    }
    return Date.now() - this.outgoingRequestedAt < SipService.ESPERA_LLAMADA_PROPIA_MS;
  }

  /** Lo que tarda como mucho el originate del backend en hacer sonar al asesor. */
  private static readonly ESPERA_LLAMADA_PROPIA_MS = 60_000;

  /**
   * Block incoming calls (for ACW/tipification period)
   */
  blockIncomingCallsMode(block: boolean): void {
    this.blockIncomingCalls = block;
    console.log(block ? '🚫 Incoming calls BLOCKED (agent tipifying)' : '✅ Incoming calls UNBLOCKED (agent available)');
  }

  setRellamadaActive(active: boolean): void {
    this._isRellamadaActive = active;
  }

  isRellamadaActive(): boolean {
    return this._isRellamadaActive;
  }

  /**
   * Obtener el número de destino de la llamada saliente actual
   * Usado por collection-management para cargar datos del cliente
   */
  getCurrentOutgoingNumber(): string | null {
    return this.currentOutgoingNumber;
  }

  /**
   * Limpiar el número de destino de la llamada saliente
   */
  clearCurrentOutgoingNumber(): void {
    this.currentOutgoingNumber = null;
    this.outgoingRequestedAt = null;
  }

  /**
   * Establecer el número de destino de la llamada saliente
   * Usado por el discador manual antes de iniciar la llamada
   */
  setCurrentOutgoingNumber(phoneNumber: string): void {
    this.currentOutgoingNumber = phoneNumber;
    this.outgoingRequestedAt = Date.now();
    console.log('📤 [SipService] Número de llamada saliente establecido:', phoneNumber);
    this.onOutgoingCall.emit({ to: phoneNumber });
  }

  /**
   * Indica si la llamada actual es incoming (del Predictivo)
   */
  isCurrentCallIncoming(): boolean {
    return this.currentCallIncoming;
  }

  /** UUID propagated only by predictive INVITEs; manual calls never set this value. */
  getCurrentPredictiveCallUuid(): string | null {
    return this.currentPredictiveCallUuid;
  }


  /**
   * Initialize and register to FreeSWITCH
   */
  async register(extension: string, password: string, wsServer: string, domain: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Store extension for latency monitoring
        this.currentExtension = extension;
        console.log('🔌 Registering to FreeSWITCH:', { extension, wsServer, domain });

        // Detect if page is loaded over HTTPS
        // If HTTPS, always use WSS (required by browser security)
        // If HTTP (local dev), use WS
        const isPageSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
        const wsProtocol = isPageSecure ? 'wss' : 'ws';
        const wsUrl = `${wsProtocol}://${wsServer}`;

        // Track registration state
        let isResolved = false;
        let registrationTimeout: any = null;

        console.log('Connecting to FreeSWITCH at:', wsUrl);
        const socket = new JsSIP.WebSocketInterface(wsUrl);

        // Monitor WebSocket connection events
        socket.onconnect = () => {
          console.log('🔗 WebSocket onconnect event fired');
        };

        socket.ondisconnect = (error: any, code?: number, reason?: string) => {
          console.error('🔌 WebSocket ondisconnect event fired:', { error, code, reason });
          if (!isResolved) {
            isResolved = true;
            if (registrationTimeout) clearTimeout(registrationTimeout);
            const errorMsg = `WebSocket connection failed: ${reason || error || 'Connection refused'}`;
            this.onError.emit(errorMsg);
            this.onRegistered.emit(false);
            reject(new Error(errorMsg));
          }
        };

        const configuration = {
          sockets: [socket],
          uri: `sip:${extension}@${domain}`,
          password: password,
          display_name: extension,
          register: true,
          session_timers: false,
          // Recover SIP/WebSocket quickly after a brief network interruption,
          // while keeping a bounded backoff if FreeSWITCH remains unavailable.
          connection_recovery_min_interval: 1,
          connection_recovery_max_interval: 10
        };

        this.ua = new JsSIP.UA(configuration);

        // Setup timeout for registration (30 seconds)
        registrationTimeout = setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            const errorMsg = 'Registration timeout - FreeSWITCH did not respond within 30 seconds';
            console.error('❌', errorMsg);
            this.onError.emit(errorMsg);
            this.onRegistered.emit(false);
            if (this.ua) {
              this.ua.stop();
              this.ua = null;
            }
            reject(new Error(errorMsg));
          }
        }, 30000);

        // Setup event handlers
        this.ua.on('connected', () => {
          console.log('✅ WebSocket connected to FreeSWITCH');
          // Note: WebSocket connected does NOT mean SIP registered
          // Wait for 'registered' event before resolving
        });

        this.ua.on('disconnected', () => {
          console.log('❌ WebSocket disconnected from FreeSWITCH');
          this.onRegistered.emit(false);

          if (!isResolved) {
            isResolved = true;
            if (registrationTimeout) clearTimeout(registrationTimeout);
            const errorMsg = 'WebSocket disconnected before registration completed';
            this.onError.emit(errorMsg);
            reject(new Error(errorMsg));
          }
        });

        this.ua.on('registered', () => {
          console.log('✅ Successfully registered to FreeSWITCH');
          this.onRegistered.emit(true);

          // Start latency monitoring via WebSocket ping-pong
          if (this.currentExtension) {
            console.log(`📡 Starting latency monitoring for extension ${this.currentExtension}`);
            this.websocketService.startLatencyMonitoring(this.currentExtension);
          }

          if (!isResolved) {
            isResolved = true;
            if (registrationTimeout) clearTimeout(registrationTimeout);
            resolve();
          }
        });

        this.ua.on('unregistered', () => {
          console.log('❌ Unregistered from FreeSWITCH');
          this.onRegistered.emit(false);

          // Stop latency monitoring
          this.websocketService.stopLatencyMonitoring();
        });

        this.ua.on('registrationFailed', (data: any) => {
          console.error('❌ SIP registration failed:', data);
          const errorMsg = `Registration failed: ${data.cause || 'Unknown error'}`;
          this.onError.emit(errorMsg);
          this.onRegistered.emit(false);

          if (!isResolved) {
            isResolved = true;
            if (registrationTimeout) clearTimeout(registrationTimeout);
            reject(new Error(errorMsg));
          }
        });

        this.ua.on('newRTCSession', (data: any) => {
          const session = data.session;

          if (session.direction === 'incoming') {
            this.currentCallIncoming = true;
            const request = session._request;
            const predictiveUuid = request?.getHeader?.('X-Cashi-UUID');
            this.currentPredictiveCallUuid = typeof predictiveUuid === 'string' && predictiveUuid.trim()
              ? predictiveUuid.trim()
              : null;
            console.log('📲 Incoming call from:', session.remote_identity.uri.user);

            // CHECK: If calls are blocked (agent is tipifying), reject the call immediately.
            // Salvo que sea la pata de una llamada que el propio asesor acaba de pedir:
            // esa no viene del discador y rechazarla es rechazar su propia marcacion.
            const esLlamadaPropia = this.esperandoLlamadaPropia();

            if (this._pruebaActiva) {
              console.warn('🚫 REJECTING incoming call - llamada de prueba en curso');
              this.currentPredictiveCallUuid = null;
              session.terminate({
                status_code: 486,
                reason_phrase: 'Busy Here - Test Call'
              });
              return;
            } else if (this.blockIncomingCalls && esLlamadaPropia) {
              console.log('\u260e\ufe0f Entrantes bloqueadas, pero esta es la llamada que pidio el asesor a', this.currentOutgoingNumber, '- se acepta');
            } else if (this.blockIncomingCalls) {
              console.warn('🚫 REJECTING incoming call - agent is tipifying (ACW period)');
              this.currentPredictiveCallUuid = null;
              session.terminate({
                status_code: 486,
                reason_phrase: 'Busy Here - Agent Tipifying'
              });
              return;
            }

            this.currentSession = session;

            // Check if this is an auto-answer call (from auto-dialer)
            // Auto-answer is triggered by SIP header Alert-Info or Call-Info
            const hasAutoAnswer = request && (
              request.hasHeader('Alert-Info') ||
              request.hasHeader('Call-Info') ||
              request.hasHeader('Answer-After')
            );

            // If auto-answer is enabled (admin supervision OR auto-dialer), answer immediately without ringtone
            // esLlamadaPropia tambien contesta sola: el originate manual no manda las
            // cabeceras de auto-answer que si trae el discador, y seria absurdo hacer que
            // el asesor conteste la llamada que acaba de pedir el mismo.
            if (this.autoAnswerEnabled || hasAutoAnswer || esLlamadaPropia) {
              console.log('🤖 Auto-answering call (auto-dialer mode)');
              this.currentCallState = CallState.CONNECTING;
              this.onCallStatus.emit(this.currentCallState);

              this.setupSessionHandlers(session);

              // Auto-answer after a short delay to ensure session is ready
              setTimeout(() => {
                this.answer().catch(err => {
                  console.error('❌ Auto-answer FAILED:', err.message || err);
                  console.error('❌ localStream:', this.localStream ? 'EXISTS' : 'NULL');
                  console.error('❌ currentSession:', this.currentSession ? 'EXISTS' : 'NULL');
                });
              }, 100);
            } else {
              // Normal incoming call with ringtone
              // Play ringtone for incoming call
              this.ringtoneAudio?.play().catch(err => {
                console.warn('⚠️ Could not play ringtone:', err);
              });

              this.currentCallState = CallState.RINGING;
              this.onCallStatus.emit(this.currentCallState);

              const from = session.remote_identity.uri.user || 'Unknown';
              this.onIncomingCall.emit({ from });

              this.setupSessionHandlers(session);
            }
          }
        });

        // Start the UA
        this.ua.start();

        // Get microphone access with selected device (don't block registration on this).
        // Si el headset preferido no está, toma el predeterminado: antes el getUserMedia con
        // deviceId exact fallaba, localStream quedaba null y el auto-answer fallaba en silencio.
        try {
          await this.switchMicrophone(null, 'registro');
        } catch (error) {
          console.warn('⚠️ Microphone access denied (will retry when making a call):', error);
          // Don't emit error or reject - microphone can be requested later
          this.reportarAudio('MIC_NO_DISPONIBLE', null, 'al registrar: ' + this.describirError(error));
          this.audioDeviceService.setActiveInput({ label: 'Ningún micrófono disponible', alternativo: true });
        }

        // Set output device on remote audio element (el preferido, o el del sistema si no está)
        await this.applyOutputDevice();

      } catch (error: any) {
        console.error('❌ Failed to initialize SIP client:', error);
        const errorMsg = error.message || 'Failed to initialize SIP client';
        this.onError.emit(errorMsg);
        this.onRegistered.emit(false);
        reject(error);
      }
    });
  }

  /**
   * Make outgoing call
   */
  async call(destination: string): Promise<void> {
    if (!this.ua || !this.ua.isRegistered()) {
      throw new Error('Not registered to FreeSWITCH');
    }

    const micStream = await this.micParaLlamada('saliente');

    try {
      console.log('📞 Making call to:', destination);

      this.currentCallState = CallState.CONNECTING;
      this.onCallStatus.emit(this.currentCallState);

      this.iniciarSesionSaliente(destination, micStream);

      // Guardar número de destino y emitir evento
      this.currentCallIncoming = false;
      this.currentPredictiveCallUuid = null;
      this.currentOutgoingNumber = destination;
      this.outgoingRequestedAt = Date.now();
      console.log('📤 Emitiendo onOutgoingCall con destino:', destination);
      this.onOutgoingCall.emit({ to: destination });

    } catch (error: any) {
      console.error('❌ Failed to make call:', error);
      this.currentCallState = CallState.IDLE;
      this.onCallStatus.emit(this.currentCallState);
      this.onError.emit(error.message || 'Failed to make call');
      throw error;
    }
  }

  /**
   * Llamada de prueba desde /settings (eco del servidor o un número real).
   *
   * Sale directo del navegador a FreeSWITCH, sin pasar por /calls/make: no crea registro de
   * llamada ni gestión, y el backend no le cambia el estado al asesor. Mientras dura:
   * - app.component no navega a tipificación ni devuelve al asesor a DISPONIBLE;
   * - se rechaza cualquier entrante (respaldo: la pantalla solo la permite fuera de DISPONIBLE,
   *   así que el discador no debería mandarle nada).
   * No marca currentOutgoingNumber: eso abriría la excepción de "llamada propia" del candado.
   */
  async llamarPrueba(destino: string): Promise<void> {
    if (!this.ua || !this.ua.isRegistered()) {
      throw new Error('El softphone no está conectado');
    }
    if (this.currentSession || this._pruebaActiva) {
      throw new Error('Ya hay una llamada en curso');
    }

    this._pruebaActiva = true;
    this.bloqueoAntesDePrueba = this.blockIncomingCalls;
    this.blockIncomingCallsMode(true);

    try {
      const micStream = await this.micParaLlamada('saliente');
      console.log('🧪 Llamada de prueba a:', destino);

      this.currentCallState = CallState.CONNECTING;
      this.onCallStatus.emit(this.currentCallState);

      this.currentCallIncoming = false;
      this.currentPredictiveCallUuid = null;
      this.iniciarSesionSaliente(destino, micStream);
    } catch (error) {
      this.terminarModoPrueba();
      this.currentCallState = CallState.IDLE;
      this.onCallStatus.emit(this.currentCallState);
      throw error;
    }
  }

  isPruebaActiva(): boolean {
    return this._pruebaActiva;
  }

  private terminarModoPrueba(): void {
    if (!this._pruebaActiva) {
      return;
    }
    this._pruebaActiva = false;
    this.blockIncomingCallsMode(this.bloqueoAntesDePrueba);
    console.log('🧪 Llamada de prueba terminada');
  }

  private iniciarSesionSaliente(destination: string, micStream: MediaStream): void {
    const options = {
      mediaConstraints: {
        audio: true,
        video: false
      },
      mediaStream: micStream,
      pcConfig: {
        iceServers: [
          // Multiple STUN servers for faster failover
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun.cloudflare.com:3478' }
        ],
        iceTransportPolicy: 'all',
        rtcpMuxPolicy: 'require',
        iceCandidatePoolSize: 0  // Disable pre-gathering for faster startup
      },
      // Offer constraints to ensure audio negotiation
      rtcOfferConstraints: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      }
    };

    const session = this.ua.call(`sip:${destination}@${this.ua._configuration.uri.host}`, options);
    this.currentSession = session;
    this.setupSessionHandlers(session);
    this.setupICEGatheringMonitor(session, 'outgoing');
    this.setupSDPOptimization(session);
  }

  /**
   * Answer incoming call
   */
  async answer(): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No incoming call to answer');
    }

    const micStream = await this.micParaLlamada('entrante');

    try {
      console.log('📲 Answering call');

      const options = {
        mediaConstraints: {
          audio: true,
          video: false
        },
        mediaStream: micStream,
        pcConfig: {
          iceServers: [
            // Multiple STUN servers for faster failover
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun.cloudflare.com:3478' }
          ],
          iceTransportPolicy: 'all',
          rtcpMuxPolicy: 'require',
          iceCandidatePoolSize: 0  // Disable pre-gathering for faster startup
        },
        // Answer constraints to ensure audio negotiation
        rtcAnswerConstraints: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: false
        }
      };

      this.setupICEGatheringMonitor(this.currentSession, 'incoming');
      this.setupSDPOptimization(this.currentSession);
      this.currentSession.answer(options);

    } catch (error: any) {
      console.error('❌ Failed to answer call:', error);
      this.onError.emit(error.message || 'Failed to answer call');
      throw error;
    }
  }

  /**
   * Hangup current call
   */
  hangup(): void {
    if (!this.currentSession) {
      return;
    }

    try {
      console.log('📴 Hanging up call');
      this.currentSession.terminate();
    } catch (error: any) {
      console.error('❌ Failed to hangup:', error);
    }
  }

  /**
   * Mute/unmute microphone
   */
  mute(): void {
    if (this.currentSession) {
      this.currentSession.mute({ audio: true });
      console.log('🔇 Muted');
    }
  }

  unmute(): void {
    if (this.currentSession) {
      this.currentSession.unmute({ audio: true });
      console.log('🔊 Unmuted');
    }
  }

  isMuted(): boolean {
    return this.currentSession?.isMuted().audio || false;
  }

  // ========== MICRÓFONO: recuperación y cambio en caliente ==========

  /**
   * Micrófono vivo para contestar o llamar. Si el de la sesión murió (headset desconectado)
   * o nunca se abrió, se abre otro aquí mismo en vez de fallar la llamada.
   */
  private async micParaLlamada(direccion: 'entrante' | 'saliente'): Promise<MediaStream> {
    const track = this.localStream?.getAudioTracks()[0];
    if (this.localStream && track?.readyState === 'live') {
      return this.localStream;
    }
    try {
      return await this.switchMicrophone('MIC_RECUPERADO', `sin micrófono vivo al iniciar llamada ${direccion}`);
    } catch (error) {
      console.error('❌ No hay micrófono para la llamada:', error);
      this.reportarAudio('SIN_MIC_AL_CONTESTAR', null, `${direccion}: ${this.describirError(error)}`);
      this.audioDeviceService.setActiveInput({ label: 'Ningún micrófono disponible', alternativo: true });
      throw new Error('Microphone not available');
    }
  }

  /**
   * Abre el micrófono (el preferido o, si no está, el predeterminado) y lo pone en lugar
   * del actual. Con llamada en curso se cambia con replaceTrack: no renegocia SIP ni corta.
   */
  private switchMicrophone(evento: EventoAudio | null, motivo: string): Promise<MediaStream> {
    if (this.micSwitch) {
      return this.micSwitch;
    }
    this.micSwitch = (async () => {
      try {
        const { stream, dispositivo, alternativo } = await this.audioDeviceService.acquireMicrophone();
        const track = stream.getAudioTracks()[0];
        track?.addEventListener('ended', () => this.onMicTrackEnded(track));

        const anterior = this.localStream;
        this.localStream = stream;
        if (track) {
          await this.replaceSessionTrack(track);
        }
        // stop() no dispara 'ended', así que esto no se confunde con una desconexión
        anterior?.getTracks().forEach(t => t.stop());

        console.log(`🎤 Micrófono en uso: ${dispositivo} (${motivo})`);
        this.audioDeviceService.setActiveInput({ label: dispositivo, alternativo });
        if (evento) {
          this.reportarAudio(evento, dispositivo,
            motivo + (alternativo ? ' - el preferido no está, se usa el predeterminado' : ''));
        }
        return stream;
      } finally {
        this.micSwitch = null;
      }
    })();
    return this.micSwitch;
  }

  private async replaceSessionTrack(track: MediaStreamTrack): Promise<void> {
    const pc: RTCPeerConnection | undefined = this.currentSession?.connection;
    if (!pc || pc.signalingState === 'closed') {
      return;
    }
    const sender = pc.getSenders().find(s => s.track?.kind === 'audio')
      ?? pc.getTransceivers().find(t => t.receiver.track?.kind === 'audio')?.sender;
    if (!sender) {
      return;
    }
    try {
      // JsSIP silencia con track.enabled sobre el sender: la pista nueva respeta el mute
      track.enabled = !this.isMuted();
      await sender.replaceTrack(track);
      console.log('🔁 Micrófono reemplazado en la llamada en curso');
    } catch (error) {
      console.error('❌ No se pudo reemplazar el micrófono en la llamada:', error);
    }
  }

  private onMicTrackEnded(track: MediaStreamTrack): void {
    if (this.localStream?.getAudioTracks()[0] !== track) {
      return;
    }
    console.warn('🎤 El micrófono dejó de funcionar:', track.label);
    this.reportarAudio('MIC_PERDIDO', track.label, 'la pista terminó (dispositivo desconectado)');
    this.switchMicrophone('MIC_RECUPERADO', 'reemplazo tras pérdida').catch(err => {
      this.reportarAudio('MIC_NO_DISPONIBLE', null, this.describirError(err));
      this.audioDeviceService.setActiveInput({ label: 'Ningún micrófono disponible', alternativo: true });
    });
  }

  /** Al conectar/desconectar llegan varios devicechange seguidos: se revisa una sola vez. */
  private onDevicesChanged(): void {
    clearTimeout(this.devicechangeTimer);
    this.devicechangeTimer = setTimeout(() => this.revisarDispositivos(), 800);
  }

  private async revisarDispositivos(): Promise<void> {
    if (!this.ua) {
      return;
    }
    this.applyOutputDevice();

    try {
      await this.aplicarMicrofonoPreferido('dispositivos');
    } catch (error) {
      this.reportarAudio('MIC_NO_DISPONIBLE', null, this.describirError(error));
      this.audioDeviceService.setActiveInput({ label: 'Ningún micrófono disponible', alternativo: true });
    }
  }

  /**
   * Pone el micrófono que corresponde (el preferido, o el del sistema si no está) solo si
   * no es el que ya está en uso. Se compara por groupId: es el mismo para el dispositivo
   * físico aunque se haya elegido por otra entrada de la lista.
   */
  private async aplicarMicrofonoPreferido(origen: 'dispositivos' | 'configuracion'): Promise<void> {
    const track = this.localStream?.getAudioTracks()[0];
    if (!track || track.readyState !== 'live') {
      await this.switchMicrophone('MIC_RECUPERADO', 'dispositivo conectado');
      return;
    }
    const preferido = await this.audioDeviceService.resolveInputDevice();
    const groupObjetivo = preferido ? preferido.groupId : await this.audioDeviceService.defaultInputGroupId();
    const groupActual = track.getSettings().groupId;
    if (!groupObjetivo || !groupActual || groupObjetivo === groupActual) {
      return;
    }
    if (origen === 'configuracion') {
      await this.switchMicrophone('MIC_CAMBIADO', 'cambio en configuración');
    } else if (preferido) {
      await this.switchMicrophone('MIC_RECUPERADO', 'volvió el micrófono preferido');
    } else {
      await this.switchMicrophone('MIC_CAMBIADO', 'cambió el predeterminado del sistema');
    }
  }

  /**
   * Parlante: el preferido si está conectado, si no el del sistema ('' en setSinkId).
   * Al volver el headset, la llamada vuelve a sonar por él.
   */
  private async applyOutputDevice(): Promise<void> {
    const audio = this.remoteAudio as any;
    if (!this.ua || !audio || !('setSinkId' in audio)) {
      return;
    }
    try {
      const outputs = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audiooutput');

      // Si el parlante en uso se desconectó, el elemento conserva su sinkId. Se pasa
      // explícitamente al del sistema: si no, al volver el headset el sinkId "ya coincide"
      // con el preferido y nunca se vuelve a aplicar.
      const actual: string = audio.sinkId || '';
      if (actual && !outputs.some(d => d.deviceId === actual)) {
        console.warn('🔊 El parlante en uso se desconectó, pasa al del sistema');
        await audio.setSinkId('');
        this.salidaPerdida = true;
        this.reportarAudio('SALIDA_PERDIDA', null, 'el parlante en uso se desconectó');
      }

      const deviceId = await this.audioDeviceService.resolveOutputDeviceId();
      const destino = deviceId === 'default' ? '' : deviceId;
      if (audio.sinkId !== destino) {
        await audio.setSinkId(destino);
        console.log('🔊 Salida de audio:', deviceId);
      }

      const label = outputs.find(d => d.deviceId === (destino || 'default'))?.label || 'Dispositivo del sistema';
      if (destino && this.salidaPerdida) {
        this.salidaPerdida = false;
        this.reportarAudio('SALIDA_RECUPERADA', label, 'volvió el parlante preferido');
      }
      this.audioDeviceService.setActiveOutput({
        label,
        alternativo: this.audioDeviceService.getCurrentOutputDeviceId() !== 'default' && !destino
      });
    } catch (error) {
      console.warn('⚠️ No se pudo cambiar la salida de audio:', error);
    }
  }

  private reportarAudio(evento: EventoAudio, dispositivo: string | null, detalle: string | null): void {
    this.audioTelemetry.reportar({
      evento,
      dispositivo,
      detalle,
      enLlamada: !!this.currentSession,
      callUuid: this.currentPredictiveCallUuid
    });
  }

  private describirError(error: any): string {
    return `${error?.name || 'Error'}: ${error?.message || error}`;
  }

  /**
   * Setup SDP optimization to filter SDP candidates
   */
  private setupSDPOptimization(session: any): void {
    // Filter SDP ONLY when sending (local), NOT when receiving (remote)
    session.on('sdp', (data: any) => {
      // CRITICAL: Only filter OUR SDP (originator='local'), NEVER filter FreeSWITCH SDP (originator='remote')
      if (data.originator === 'local') {
        let sdp = data.sdp;
        const originalLength = sdp.length;

        console.log('🔧 Filtering LOCAL SDP - removing problematic candidates');

        // Remove IPv6 candidates (lines with colons in IP addresses)
        sdp = sdp.replace(/a=candidate:.*:[a-f0-9]+:[a-f0-9]+:.*/gi, '');

        // Remove TCP candidates
        sdp = sdp.replace(/a=candidate:.*\btcp\b.*/gi, '');

        // Remove virtual interface candidates
        sdp = sdp.replace(/a=candidate:.*\b172\.\d+\.\d+\.\d+\b.*/gi, '');
        sdp = sdp.replace(/a=candidate:.*\b169\.254\.\d+\.\d+\b.*/gi, '');

        // Clean up empty lines created by removals
        sdp = sdp.replace(/^\s*[\r\n]/gm, '');

        const removedBytes = originalLength - sdp.length;
        if (removedBytes > 0) {
          console.log(`✅ Local SDP cleaned: removed ${removedBytes} bytes`);
        }

        data.sdp = sdp;
      } else {
        console.log('✅ Keeping remote SDP from FreeSWITCH unchanged');
      }
    });
  }

  /**
   * Setup ICE gathering monitor with aggressive timeout and candidate filtering
   * ALSO handles remote audio track setup (CRITICAL: must be in first peerconnection listener)
   */
  private setupICEGatheringMonitor(session: any, callType: 'outgoing' | 'incoming'): void {
    console.log(`⏱️ Starting ICE gathering monitor for ${callType} call`);

    let gatheringStartTime: number;
    let gatheringTimeout: any = null;
    let candidateCount = 0;
    let hasSrflxCandidate = false;
    let hasHostCandidate = false;

    // Define handler function that will be called either immediately or on event
    const handlePeerConnection = (pc: RTCPeerConnection) => {
      gatheringStartTime = Date.now();

      console.log('🔍 ICE Gathering State:', pc.iceGatheringState);

      // ========== ICE CANDIDATE FILTERING (MOVED HERE FROM setupSDPOptimization) ==========
      const originalOnIceCandidate = pc.onicecandidate;
      console.log('🔧 Installing aggressive ICE candidate filter');

      // Override onicecandidate to filter out problematic candidates
      pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
          const candidate = event.candidate;
          const sdp = candidate.candidate;

          // Filter out IPv6 candidates (contain ':' in IP address)
          if (sdp.includes(':') && !sdp.includes('::ffff:')) {
            console.log('🚫 Blocked IPv6 candidate from being added');
            return; // Don't add this candidate
          }

          // Filter out TCP candidates
          if (candidate.protocol === 'tcp' || sdp.toLowerCase().includes(' tcp ')) {
            console.log('🚫 Blocked TCP candidate from being added');
            return; // Don't add this candidate
          }

          // Filter out virtual/APIPA interfaces
          if (sdp.includes('172.28.') || sdp.includes('172.16.') ||
              sdp.includes('169.254.') || sdp.includes('172.17.')) {
            console.log('🚫 Blocked virtual/APIPA candidate from being added');
            return; // Don't add this candidate
          }

          console.log('✅ Allowing candidate:', candidate.type, candidate.protocol, candidate.address);
        }

        // Call original handler (JsSIP's internal handler)
        if (originalOnIceCandidate) {
          originalOnIceCandidate.call(pc, event);
        }
      };
      // ========== END ICE CANDIDATE FILTERING ==========

      // ========== AUDIO TRACK HANDLING (MOVED HERE FROM setupSessionHandlers) ==========
      console.log('🔧 [AUDIO] Setting up remote audio track handlers');

      // Listen for remote audio tracks
      pc.addEventListener('track', async (event: RTCTrackEvent) => {
        console.log('🎵 Received remote track:', {
          trackId: event.track.id,
          trackKind: event.track.kind,
          trackEnabled: event.track.enabled,
          streamCount: event.streams.length
        });

        // CRÍTICO: ignorar pistas que no sean audio (ej. video del eavesdrop).
        // Sin esto el handler se dispara 2 veces (audio + video), la 2da interrumpe
        // a la 1ra, salta AbortError y se crea un 2do <audio> → ambos suenan = ECO.
        if (event.track.kind !== 'audio') {
          console.log('⏭️ Ignorando pista no-audio:', event.track.kind);
          return;
        }

        // CRÍTICO: si ya estamos reproduciendo este mismo stream, no re-asignar.
        // Re-setear srcObject con el mismo stream interrumpe el play() y duplica audio.
        if (this.remoteAudio && this.remoteAudio.srcObject === event.streams[0]) {
          console.log('⏭️ Stream ya en reproducción, omitiendo re-asignación');
          return;
        }

        if (this.remoteAudio && event.streams[0]) {
          // Set output device before playing
          // El preferido si está conectado: antes se pedía aunque no estuviera, fallaba y se recreaba el elemento
          const outputDeviceId = await this.audioDeviceService.resolveOutputDeviceId();
          let sinkFailed = false;
          if (outputDeviceId && outputDeviceId !== 'default' && 'setSinkId' in this.remoteAudio) {
            try {
              await (this.remoteAudio as any).setSinkId(outputDeviceId);
              console.log('🔊 Audio output set to:', outputDeviceId);
            } catch (sinkError) {
              console.warn('⚠️ Could not set audio output device, recreating audio element:', sinkError);
              sinkFailed = true;
              // Recreate audio element to clear corrupted state (common with Bluetooth)
              this.remoteAudio = new Audio();
              this.remoteAudio.autoplay = true;
            }
          }

          this.remoteAudio.srcObject = event.streams[0];
          try {
            await this.remoteAudio.play();
            console.log('✅ Playing remote audio' + (sinkFailed ? ' (using system default device)' : ''));
          } catch (playErr: any) {
            // AbortError = el play() fue interrumpido por otra asignación; el elemento
            // actual probablemente ya está sonando. NO crear otro o se duplica (eco).
            if (playErr?.name === 'AbortError') {
              console.warn('⚠️ play() interrumpido (AbortError) - el audio ya está activo, NO se crea otro elemento');
            } else {
              console.error('❌ Error playing audio, retrying with new element:', playErr);
              // Apagar el elemento viejo ANTES de crear uno nuevo (evita 2 sonando = eco)
              try { this.remoteAudio.pause(); this.remoteAudio.srcObject = null; } catch {}
              this.remoteAudio = new Audio();
              this.remoteAudio.autoplay = true;
              this.remoteAudio.srcObject = event.streams[0];
              this.remoteAudio.play()
                .then(() => console.log('✅ Playing remote audio (retry succeeded)'))
                .catch(err => console.error('❌ Error playing audio after retry:', err));
            }
          }
        }
      });

      // Monitor for tracks appearing over time
      let trackCheckCount = 0;
      const trackCheckInterval = setInterval(async () => {
        trackCheckCount++;
        const receivers = pc.getReceivers();
        const hasTrack = receivers.length > 0 && receivers[0].track;

        if (hasTrack && this.remoteAudio && !this.remoteAudio.srcObject) {
          console.log(`🎵 Found remote track on check #${trackCheckCount}`);
          const remoteStream = new MediaStream(receivers.map(r => r.track).filter(t => t !== null));
          if (remoteStream.getTracks().length > 0) {
            // Set output device before playing
            const outputDeviceId = await this.audioDeviceService.resolveOutputDeviceId();
            let sinkFailed = false;
            if (outputDeviceId && outputDeviceId !== 'default' && 'setSinkId' in this.remoteAudio) {
              try {
                await (this.remoteAudio as any).setSinkId(outputDeviceId);
                console.log('🔊 Audio output set to:', outputDeviceId);
              } catch (sinkError) {
                console.warn('⚠️ Could not set audio output device, recreating audio element:', sinkError);
                sinkFailed = true;
                this.remoteAudio = new Audio();
                this.remoteAudio.autoplay = true;
              }
            }

            this.remoteAudio.srcObject = remoteStream;
            try {
              await this.remoteAudio.play();
              console.log('✅ Playing remote audio from monitoring' + (sinkFailed ? ' (using system default device)' : ''));
            } catch (playErr: any) {
              if (playErr?.name === 'AbortError') {
                console.warn('⚠️ play() interrumpido (AbortError) - el audio ya está activo, NO se crea otro elemento');
              } else {
                console.error('❌ Error playing audio, retrying with new element:', playErr);
                try { this.remoteAudio.pause(); this.remoteAudio.srcObject = null; } catch {}
                this.remoteAudio = new Audio();
                this.remoteAudio.autoplay = true;
                this.remoteAudio.srcObject = remoteStream;
                this.remoteAudio.play()
                  .then(() => console.log('✅ Playing remote audio from monitoring (retry succeeded)'))
                  .catch(err => console.error('❌ Error playing audio after retry:', err));
              }
            }
            clearInterval(trackCheckInterval);
          }
        }

        // Stop checking after 3 seconds
        if (trackCheckCount >= 30) {
          clearInterval(trackCheckInterval);
          if (!this.remoteAudio?.srcObject) {
            console.warn('⚠️ No remote audio track found after 3 seconds');
          }
        }
      }, 100);
      // ========== END AUDIO TRACK HANDLING ==========

      // Monitor ICE gathering state changes
      pc.addEventListener('icegatheringstatechange', () => {
        const elapsed = Date.now() - gatheringStartTime;
        console.log(`🔄 ICE Gathering State changed to: ${pc.iceGatheringState} (${elapsed}ms elapsed)`);

        if (pc.iceGatheringState === 'complete') {
          console.log(`✅ ICE gathering completed in ${elapsed}ms with ${candidateCount} candidates`);
          if (gatheringTimeout) {
            clearTimeout(gatheringTimeout);
          }
        }
      });

      // ========== CRITICAL: Monitor ICE CONNECTION state ==========
      // Se reporta para separar cortes de red de cortes de headset
      let iceCaidoDesde: number | null = null;
      pc.addEventListener('iceconnectionstatechange', () => {
        console.log(`🔌 ICE Connection State: ${pc.iceConnectionState}`);

        if (pc.iceConnectionState === 'connected') {
          console.log('✅ ICE CONNECTION ESTABLISHED - Audio should flow now!');
          if (iceCaidoDesde !== null) {
            this.reportarAudio('ICE_RECONECTADO', null, `${callType}, caído ${Date.now() - iceCaidoDesde} ms`);
            iceCaidoDesde = null;
          }
        } else if (pc.iceConnectionState === 'failed') {
          console.error('❌ ICE CONNECTION FAILED - No audio will flow!');
          this.reportarAudio('ICE_FALLIDO', null, callType);
        } else if (pc.iceConnectionState === 'disconnected') {
          console.warn('⚠️ ICE CONNECTION DISCONNECTED');
          iceCaidoDesde = Date.now();
          this.reportarAudio('ICE_DESCONECTADO', null, callType);
        }
      });

      // Monitor connection state (higher level)
      pc.addEventListener('connectionstatechange', () => {
        console.log(`🔗 PeerConnection State: ${pc.connectionState}`);

        if (pc.connectionState === 'connected') {
          console.log('✅ PEER CONNECTION ESTABLISHED');
        } else if (pc.connectionState === 'failed') {
          console.error('❌ PEER CONNECTION FAILED');
        }
      });

      // Monitor and filter ICE candidates as they are gathered
      pc.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          candidateCount++;
          const candidate = event.candidate;
          const elapsed = Date.now() - gatheringStartTime;

          // Track what types we have
          if (candidate.type === 'srflx') {
            hasSrflxCandidate = true;
            console.log(`✅ Got STUN candidate (srflx) in ${elapsed}ms - we have public IP!`);

            // CRITICAL FIX: Force gathering to complete by manually dispatching null candidate
            // This is the ONLY way to make Chrome stop waiting for IPv6/TCP timeouts
            setTimeout(() => {
              if (pc.iceGatheringState !== 'complete') {
                console.log('🔧 FORCE COMPLETING ICE gathering - dispatching null candidate manually');

                // Clear ICE servers to stop more candidates from being generated
                pc.setConfiguration({ iceServers: [] });

                // Manually dispatch the null candidate event to signal gathering completion
                // This is what Chrome would do after all timeouts expire
                const nullCandidateEvent = new RTCPeerConnectionIceEvent('icecandidate', {
                  candidate: null
                });
                pc.dispatchEvent(nullCandidateEvent);

                // Also call the original handler if it exists
                if (originalOnIceCandidate) {
                  originalOnIceCandidate.call(pc, nullCandidateEvent);
                }
              }
            }, 250); // Give it 250ms to get a few more candidates, then force complete
          }
          if (candidate.type === 'host' && candidate.protocol === 'udp' && !candidate.address?.includes(':')) {
            hasHostCandidate = true;
          }

          // Log candidate details
          console.log(`🧊 ICE Candidate #${candidateCount} (${elapsed}ms):`, {
            type: candidate.type,
            protocol: candidate.protocol,
            address: candidate.address || 'N/A',
            port: candidate.port
          });

          // Warn about slow candidates
          if (candidate.protocol === 'tcp') {
            console.warn('⚠️ TCP candidate detected (slower than UDP)');
          }
          if (candidate.address?.includes(':')) {
            console.warn('⚠️ IPv6 candidate detected (may cause delays)');
          }
          if (candidate.address?.startsWith('172.') || candidate.address?.startsWith('169.254.')) {
            console.warn('⚠️ Virtual/APIPA interface candidate detected');
          }

          // If we have the essentials (srflx or host), consider shortening wait
          if (hasSrflxCandidate && elapsed > 500) {
            console.log('✅ Have srflx candidate, ready to proceed if gathering completes');
          }
        } else {
          // null candidate means gathering is complete
          const elapsed = Date.now() - gatheringStartTime;
          console.log(`🏁 ICE gathering signaled completion in ${elapsed}ms`);
          if (gatheringTimeout) {
            clearTimeout(gatheringTimeout);
          }
        }
      });

      // AGGRESSIVE timeout: 5 seconds maximum
      // After this, we trust that JsSIP will proceed with what it has
      gatheringTimeout = setTimeout(() => {
        const elapsed = Date.now() - gatheringStartTime;
        if (pc.iceGatheringState !== 'complete') {
          console.error(`🚨 ICE gathering STILL not complete after ${elapsed}ms (state: ${pc.iceGatheringState})`);
          console.error(`🚨 This is causing the call to fail - gathering should complete in < 2 seconds`);
          console.warn(`📊 Status: ${candidateCount} candidates, srflx=${hasSrflxCandidate}, host=${hasHostCandidate}`);

          if (!hasSrflxCandidate && !hasHostCandidate) {
            console.error('❌ CRITICAL: No usable candidates found - network issue?');
          } else {
            console.warn('⚠️ Have usable candidates but gathering won\'t complete - likely IPv6/TCP timeout');
          }
        }
      }, 5000); // Reduced to 5 seconds
    };

    // CRITICAL FIX: Check if PeerConnection already exists (for outgoing calls)
    // JsSIP fires peerconnection event SYNCHRONOUSLY during ua.call(),
    // so for outgoing calls the connection already exists when this function runs
    if (session.connection) {
      console.log('🔧 [FIX] PeerConnection already exists (outgoing call), setting up directly');
      handlePeerConnection(session.connection);
    } else {
      console.log('🔧 [FIX] PeerConnection not yet created (incoming call), waiting for event');
      session.once('peerconnection', (data: any) => {
        handlePeerConnection(data.peerconnection);
      });
    }
  }

  /**
   * Setup session event handlers
   * NOTE: Audio handling is done in setupICEGatheringMonitor (first peerconnection listener)
   */
  private setupSessionHandlers(session: any): void {
    session.on('progress', () => {
      console.log('📞 Call progress (ringing)');
      this.currentCallState = CallState.RINGING;
      this.onCallStatus.emit(this.currentCallState);
    });

    session.on('accepted', () => {
      console.log('✅ Call accepted');
      // Stop ringtone when call is accepted
      this.stopRingtone();
      this.currentCallState = CallState.ACTIVE;
      this.onCallStatus.emit(this.currentCallState);
    });

    session.on('confirmed', () => {
      console.log('✅ Call confirmed (ACK received)');
      this.currentCallState = CallState.ACTIVE;
      this.onCallStatus.emit(this.currentCallState);
    });

    session.on('ended', (data: any) => {
      this.lastHangupCause = data?.cause || 'BYE';
      console.log('📴 Call ended, cause:', this.lastHangupCause);
      // Stop ringtone when call ends
      this.stopRingtone();

      // NOTE: Do NOT block incoming calls here automatically.
      // The blocking should only happen when agent enters tipification screen.
      // collection-management.page.ts handles this via blockIncomingCallsMode(true).

      this.currentCallState = CallState.ENDED;
      this.onCallStatus.emit(this.currentCallState);

      this.currentSession = null;
      this.currentPredictiveCallUuid = null;
      this.terminarModoPrueba();

      setTimeout(() => {
        // Solo emitir IDLE si no hay una nueva llamada activa
        // Evita que el IDLE de una llamada anterior mate la navegación de la siguiente
        if (this.currentCallState === CallState.ENDED) {
          this.currentCallState = CallState.IDLE;
          this.onCallStatus.emit(this.currentCallState);
        } else {
          console.log('⚠️ Suppressed stale IDLE - new call already in state:', this.currentCallState);
        }
      }, 1000);
    });

    session.on('failed', (data: any) => {
      this.lastHangupCause = data?.cause || 'Unknown';
      console.error('❌ Call failed:', data, 'cause:', this.lastHangupCause);
      // Stop ringtone when call fails
      this.stopRingtone();

      // NOTE: Do NOT block incoming calls here automatically.
      // The blocking should only happen when agent enters tipification screen.

      this.currentCallState = CallState.ENDED;
      this.onCallStatus.emit(this.currentCallState);

      this.currentSession = null;
      this.currentPredictiveCallUuid = null;
      // La pantalla de prueba muestra su propio resultado: sin el modal de error global
      if (!this._pruebaActiva) {
        this.onError.emit(`Call failed: ${data.cause}`);
      }
      this.terminarModoPrueba();

      setTimeout(() => {
        // Solo emitir IDLE si no hay una nueva llamada activa
        if (this.currentCallState === CallState.ENDED) {
          this.currentCallState = CallState.IDLE;
          this.onCallStatus.emit(this.currentCallState);
        } else {
          console.log('⚠️ Suppressed stale IDLE - new call already in state:', this.currentCallState);
        }
      }, 1000);
    });
  }

  /**
   * Stop ringtone audio
   */
  private stopRingtone(): void {
    if (this.ringtoneAudio) {
      this.ringtoneAudio.pause();
      this.ringtoneAudio.currentTime = 0;
    }
  }

  /**
   * Unregister and stop
   */
  async unregister(): Promise<void> {
    if (!this.ua) {
      return;
    }

    try {
      console.log('👋 Unregistering from FreeSWITCH');

      // Stop ringtone if playing
      this.stopRingtone();

      if (this.currentSession) {
        this.currentSession.terminate();
      }

      this.ua.unregister();
      this.ua.stop();
      this.ua = null;
      this.currentSession = null;

      // Stop local stream
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
      this.audioDeviceService.setActiveInput(null);
      this.audioDeviceService.setActiveOutput(null);

    } catch (error: any) {
      console.error('❌ Failed to unregister:', error);
    }
  }

  getCallState(): CallState {
    return this.currentCallState;
  }

  isRegistered(): boolean {
    return this.ua?.isRegistered() || false;
  }
}
