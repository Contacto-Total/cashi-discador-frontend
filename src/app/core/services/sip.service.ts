import { Injectable, EventEmitter, inject } from '@angular/core';
import JsSIP from 'jssip';
import { WebsocketService } from './websocket.service';

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
  private currentCallState: CallState = CallState.IDLE;
  private remoteAudio: HTMLAudioElement | null = null;
  private ringtoneAudio: HTMLAudioElement | null = null;
  private localStream: MediaStream | null = null;
  private autoAnswerEnabled: boolean = false;  // For admin supervision mode

  public onCallStatus = new EventEmitter<CallState>();
  public onError = new EventEmitter<string>();
  public onRegistered = new EventEmitter<boolean>();
  public onIncomingCall = new EventEmitter<{ from: string }>();

  private websocketService = inject(WebsocketService);
  private currentExtension: string | null = null;

  constructor() {
    // Enable JsSIP debug (disable in production)
    JsSIP.debug.enable('JsSIP:*');

    // Create audio element for remote stream
    this.remoteAudio = new Audio();
    this.remoteAudio.autoplay = true;

    // Create audio element for ringtone (incoming calls only)
    this.ringtoneAudio = new Audio('assets/sounds/ringtone.mp3');
    this.ringtoneAudio.loop = true;
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
          session_timers: false
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
            console.log('📲 Incoming call from:', session.remote_identity.uri.user);

            this.currentSession = session;

            // Check if this is an auto-answer call (from auto-dialer)
            // Auto-answer is triggered by SIP header Alert-Info or Call-Info
            const request = session._request;
            const hasAutoAnswer = request && (
              request.hasHeader('Alert-Info') ||
              request.hasHeader('Call-Info') ||
              request.hasHeader('Answer-After')
            );

            // If auto-answer is enabled (admin supervision OR auto-dialer), answer immediately without ringtone
            if (this.autoAnswerEnabled || hasAutoAnswer) {
              console.log('🤖 Auto-answering call (auto-dialer mode)');
              this.currentCallState = CallState.CONNECTING;
              this.onCallStatus.emit(this.currentCallState);

              this.setupSessionHandlers(session);

              // Auto-answer after a short delay to ensure session is ready
              setTimeout(() => {
                this.answer();
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

        // Get microphone access (don't block registration on this)
        try {
          this.localStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            },
            video: false
          });
          console.log('🎤 Microphone access granted');
        } catch (error) {
          console.warn('⚠️ Microphone access denied (will retry when making a call):', error);
          // Don't emit error or reject - microphone can be requested later
        }

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

    if (!this.localStream) {
      throw new Error('Microphone not available');
    }

    try {
      console.log('📞 Making call to:', destination);

      this.currentCallState = CallState.CONNECTING;
      this.onCallStatus.emit(this.currentCallState);

      const options = {
        mediaConstraints: {
          audio: true,
          video: false
        },
        mediaStream: this.localStream,
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

    } catch (error: any) {
      console.error('❌ Failed to make call:', error);
      this.currentCallState = CallState.IDLE;
      this.onCallStatus.emit(this.currentCallState);
      this.onError.emit(error.message || 'Failed to make call');
      throw error;
    }
  }

  /**
   * Answer incoming call
   */
  async answer(): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No incoming call to answer');
    }

    if (!this.localStream) {
      throw new Error('Microphone not available');
    }

    try {
      console.log('📲 Answering call');

      const options = {
        mediaConstraints: {
          audio: true,
          video: false
        },
        mediaStream: this.localStream,
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
      pc.addEventListener('track', (event: RTCTrackEvent) => {
        console.log('🎵 Received remote audio track:', {
          trackId: event.track.id,
          trackKind: event.track.kind,
          trackEnabled: event.track.enabled,
          streamCount: event.streams.length
        });

        if (this.remoteAudio && event.streams[0]) {
          this.remoteAudio.srcObject = event.streams[0];
          this.remoteAudio.play()
            .then(() => console.log('✅ Playing remote audio'))
            .catch(err => console.error('❌ Error playing audio:', err));
        }
      });

      // Monitor for tracks appearing over time
      let trackCheckCount = 0;
      const trackCheckInterval = setInterval(() => {
        trackCheckCount++;
        const receivers = pc.getReceivers();
        const hasTrack = receivers.length > 0 && receivers[0].track;

        if (hasTrack && this.remoteAudio && !this.remoteAudio.srcObject) {
          console.log(`🎵 Found remote track on check #${trackCheckCount}`);
          const remoteStream = new MediaStream(receivers.map(r => r.track).filter(t => t !== null));
          if (remoteStream.getTracks().length > 0) {
            this.remoteAudio.srcObject = remoteStream;
            this.remoteAudio.play()
              .then(() => console.log('✅ Playing remote audio from monitoring'))
              .catch(err => console.error('❌ Error playing audio:', err));
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

    session.on('ended', () => {
      console.log('📴 Call ended');
      // Stop ringtone when call ends
      this.stopRingtone();
      this.currentCallState = CallState.ENDED;
      this.onCallStatus.emit(this.currentCallState);

      this.currentSession = null;

      setTimeout(() => {
        this.currentCallState = CallState.IDLE;
        this.onCallStatus.emit(this.currentCallState);
      }, 1000);
    });

    session.on('failed', (data: any) => {
      console.error('❌ Call failed:', data);
      // Stop ringtone when call fails
      this.stopRingtone();
      this.currentCallState = CallState.ENDED;
      this.onCallStatus.emit(this.currentCallState);

      this.currentSession = null;
      this.onError.emit(`Call failed: ${data.cause}`);

      setTimeout(() => {
        this.currentCallState = CallState.IDLE;
        this.onCallStatus.emit(this.currentCallState);
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
