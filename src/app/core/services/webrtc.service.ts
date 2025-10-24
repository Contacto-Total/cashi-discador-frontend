import { Injectable, EventEmitter, inject } from '@angular/core';
import { WebsocketService } from './websocket.service';
import 'webrtc-adapter';

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
export class WebrtcService {
  private websocketService = inject(WebsocketService);

  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private currentCallState: CallState = CallState.IDLE;
  private isMuted = false;
  private pendingOffer: any = null;
  private remoteUserId: string | null = null;
  private targetPhoneNumber: string | null = null;

  public onRemoteStream = new EventEmitter<MediaStream>();
  public onCallStatus = new EventEmitter<CallState>();
  public onError = new EventEmitter<string>();

  private readonly iceServers: RTCConfiguration = {
    iceServers: [
      // Google STUN servers
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },

      // Twilio STUN
      { urls: 'stun:global.stun.twilio.com:3478' },

      // Metered TURN servers (multiple for redundancy)
      {
        urls: 'turn:a.relay.metered.ca:80',
        username: 'e46b526d9452c5e61c66ce86',
        credential: 'BGkz0EQbfYvXvZGu'
      },
      {
        urls: 'turn:a.relay.metered.ca:443',
        username: 'e46b526d9452c5e61c66ce86',
        credential: 'BGkz0EQbfYvXvZGu'
      },
      {
        urls: 'turn:a.relay.metered.ca:443?transport=tcp',
        username: 'e46b526d9452c5e61c66ce86',
        credential: 'BGkz0EQbfYvXvZGu'
      }
    ],
    iceCandidatePoolSize: 10,
    iceTransportPolicy: 'all',
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require'
  };

  constructor() {}

  async initialize(): Promise<void> {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('WebRTC is not supported in this browser or context. Try using HTTPS or a modern browser.');
      }

      // Request microphone permission
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });
      console.log('Microphone access granted');
    } catch (error: any) {
      console.error('Error accessing microphone:', error);
      const errorMsg = error.message || 'Could not access microphone. Please grant permission.';
      this.onError.emit(errorMsg);
      throw error;
    }
  }

  async makeCall(phoneNumber: string): Promise<void> {
    if (!this.localStream) {
      await this.initialize();
    }

    this.targetPhoneNumber = phoneNumber;
    this.currentCallState = CallState.CONNECTING;
    this.onCallStatus.emit(this.currentCallState);

    try {
      // Create peer connection
      this.peerConnection = new RTCPeerConnection(this.iceServers);

      // Add local stream
      console.log('Adding local tracks to peer connection');
      this.localStream?.getTracks().forEach(track => {
        console.log('Adding track:', track.kind, 'enabled:', track.enabled);
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      // Handle remote stream
      this.peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        console.log('Track enabled:', event.track.enabled);
        console.log('Track readyState:', event.track.readyState);

        if (event.streams && event.streams[0]) {
          this.remoteStream = event.streams[0];
          console.log('Remote stream tracks:', this.remoteStream.getTracks().map(t => t.kind));
          this.onRemoteStream.emit(this.remoteStream);
        } else {
          console.warn('No streams in track event');
        }
      };

      // Handle ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('🧊 ICE Candidate:', {
            type: event.candidate.type,
            protocol: event.candidate.protocol,
            address: event.candidate.address,
            port: event.candidate.port,
            relatedAddress: event.candidate.relatedAddress
          });
          this.sendSignalingMessage({
            type: 'ice-candidate',
            candidate: event.candidate,
            to: phoneNumber
          });
        } else {
          console.log('✅ All ICE candidates have been sent');
        }
      };

      // Handle ICE connection state changes
      this.peerConnection.oniceconnectionstatechange = () => {
        console.log('🔌 ICE connection state:', this.peerConnection?.iceConnectionState);
        if (this.peerConnection?.iceConnectionState === 'failed') {
          console.error('❌ ICE connection failed - restarting ICE');
          this.peerConnection?.restartIce();
        }
        if (this.peerConnection?.iceConnectionState === 'connected') {
          console.log('✅ ICE connected successfully!');
        }
      };

      // Handle ICE gathering state changes
      this.peerConnection.onicegatheringstatechange = () => {
        console.log('ICE gathering state:', this.peerConnection?.iceGatheringState);
      };

      // Handle connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', this.peerConnection?.connectionState);
        switch (this.peerConnection?.connectionState) {
          case 'connected':
            this.currentCallState = CallState.ACTIVE;
            this.onCallStatus.emit(this.currentCallState);
            break;
          case 'disconnected':
          case 'failed':
          case 'closed':
            this.currentCallState = CallState.ENDED;
            this.onCallStatus.emit(this.currentCallState);
            break;
        }
      };

      // Create and send offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      this.sendSignalingMessage({
        type: 'offer',
        sdp: offer,
        to: phoneNumber
      });

      this.currentCallState = CallState.RINGING;
      this.onCallStatus.emit(this.currentCallState);

    } catch (error) {
      console.error('Error making call:', error);
      this.onError.emit('Failed to establish call');
      this.hangupCall();
      throw error;
    }
  }

  private sendSignalingMessage(message: any): void {
    console.log('Sending signaling message:', message.type, 'to:', message.to);
    this.websocketService.send('/app/webrtc.signal', message);
  }

  handleIncomingOffer(message: any): void {
    console.log('Storing incoming offer from:', message.from);
    this.pendingOffer = message;
    // Use fromUsername for WebSocket routing (not fromUserId or extension)
    this.remoteUserId = message.fromUsername || message.from;
    console.log('Set remoteUserId to:', this.remoteUserId);
    this.currentCallState = CallState.RINGING;
    this.onCallStatus.emit(this.currentCallState);
  }

  async answerCall(): Promise<void> {
    if (!this.pendingOffer) {
      console.error('No pending offer to answer');
      return;
    }

    if (!this.localStream) {
      await this.initialize();
    }

    console.log('Answering call...');
    this.currentCallState = CallState.CONNECTING;
    this.onCallStatus.emit(this.currentCallState);

    try {
      // Create peer connection
      this.peerConnection = new RTCPeerConnection(this.iceServers);

      // Add local stream
      console.log('Adding local tracks to peer connection');
      this.localStream?.getTracks().forEach(track => {
        console.log('Adding track:', track.kind, 'enabled:', track.enabled);
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      // Handle remote stream
      this.peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        console.log('Track enabled:', event.track.enabled);
        console.log('Track readyState:', event.track.readyState);

        if (event.streams && event.streams[0]) {
          this.remoteStream = event.streams[0];
          console.log('Remote stream tracks:', this.remoteStream.getTracks().map(t => t.kind));
          this.onRemoteStream.emit(this.remoteStream);
        } else {
          console.warn('No streams in track event');
        }
      };

      // Handle ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate:', event.candidate.type);
          this.sendSignalingMessage({
            type: 'ice-candidate',
            candidate: event.candidate,
            to: this.remoteUserId
          });
        } else {
          console.log('All ICE candidates have been sent');
        }
      };

      // Handle ICE connection state changes
      this.peerConnection.oniceconnectionstatechange = () => {
        console.log('🔌 ICE connection state:', this.peerConnection?.iceConnectionState);
        if (this.peerConnection?.iceConnectionState === 'failed') {
          console.error('❌ ICE connection failed - restarting ICE');
          this.peerConnection?.restartIce();
        }
        if (this.peerConnection?.iceConnectionState === 'connected') {
          console.log('✅ ICE connected successfully!');
        }
      };

      // Handle ICE gathering state changes
      this.peerConnection.onicegatheringstatechange = () => {
        console.log('ICE gathering state:', this.peerConnection?.iceGatheringState);
      };

      // Handle connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', this.peerConnection?.connectionState);
        switch (this.peerConnection?.connectionState) {
          case 'connected':
            this.currentCallState = CallState.ACTIVE;
            this.onCallStatus.emit(this.currentCallState);
            break;
          case 'disconnected':
          case 'failed':
          case 'closed':
            this.currentCallState = CallState.ENDED;
            this.onCallStatus.emit(this.currentCallState);
            break;
        }
      };

      // Set remote description from pending offer
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(this.pendingOffer.sdp)
      );

      // Create and send answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.sendSignalingMessage({
        type: 'answer',
        sdp: answer,
        to: this.remoteUserId
      });

      this.pendingOffer = null;
      this.currentCallState = CallState.ACTIVE;
      this.onCallStatus.emit(this.currentCallState);

    } catch (error) {
      console.error('Error answering call:', error);
      this.onError.emit('Failed to answer call');
      this.hangupCall();
      throw error;
    }
  }

  async handleAnswer(message: any): Promise<void> {
    console.log('Received answer');
    if (this.peerConnection && message.sdp) {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(message.sdp)
      );
      this.currentCallState = CallState.ACTIVE;
      this.onCallStatus.emit(this.currentCallState);
    }
  }

  async handleIceCandidate(message: any): Promise<void> {
    console.log('Received ICE candidate');
    if (this.peerConnection && message.candidate) {
      try {
        await this.peerConnection.addIceCandidate(
          new RTCIceCandidate(message.candidate)
        );
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }

  hangupCall(): void {
    console.log('Hanging up call');

    // Send hangup signal
    if (this.remoteUserId) {
      this.sendSignalingMessage({
        type: 'hangup',
        to: this.remoteUserId
      });
    } else if (this.targetPhoneNumber) {
      this.sendSignalingMessage({
        type: 'hangup',
        to: this.targetPhoneNumber
      });
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Stop remote stream
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStream = null;
    }

    this.currentCallState = CallState.ENDED;
    this.onCallStatus.emit(this.currentCallState);

    // Reset state
    this.remoteUserId = null;
    this.targetPhoneNumber = null;
    this.pendingOffer = null;

    // Transition back to IDLE after a brief delay
    setTimeout(() => {
      this.currentCallState = CallState.IDLE;
      this.onCallStatus.emit(this.currentCallState);
    }, 1000);
  }

  muteAudio(): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
      this.isMuted = true;
    }
  }

  unmuteAudio(): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = true;
      });
      this.isMuted = false;
    }
  }

  toggleMute(): boolean {
    if (this.isMuted) {
      this.unmuteAudio();
    } else {
      this.muteAudio();
    }
    return this.isMuted;
  }

  isMicMuted(): boolean {
    return this.isMuted;
  }

  getCallState(): CallState {
    return this.currentCallState;
  }

  cleanup(): void {
    this.hangupCall();

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }
}
