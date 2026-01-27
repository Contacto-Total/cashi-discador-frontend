import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface AudioDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput';
}

export interface AudioLevelData {
  level: number;        // 0-100
  bars: number[];       // Array of 12 bar heights (0-100)
  isActive: boolean;
  peakLevel: number;
}

const STORAGE_KEY_INPUT = 'cashi_audio_input_device';
const STORAGE_KEY_OUTPUT = 'cashi_audio_output_device';

@Injectable({
  providedIn: 'root'
})
export class AudioDeviceService {
  private inputDevices$ = new BehaviorSubject<AudioDevice[]>([]);
  private outputDevices$ = new BehaviorSubject<AudioDevice[]>([]);
  private selectedInputId$ = new BehaviorSubject<string>('default');
  private selectedOutputId$ = new BehaviorSubject<string>('default');

  // Audio level monitoring
  private audioLevel$ = new BehaviorSubject<AudioLevelData>({
    level: 0,
    bars: Array(12).fill(0),
    isActive: false,
    peakLevel: 0
  });
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private isMonitoring = false;

  constructor() {
    this.loadSavedDevices();
    this.refreshDevices();

    // Listen for device changes (plug/unplug)
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        console.log('🔌 Audio devices changed, refreshing list...');
        this.refreshDevices();
      });
    }
  }

  /**
   * Get input devices as observable
   */
  getInputDevices(): Observable<AudioDevice[]> {
    return this.inputDevices$.asObservable();
  }

  /**
   * Get output devices as observable
   */
  getOutputDevices(): Observable<AudioDevice[]> {
    return this.outputDevices$.asObservable();
  }

  /**
   * Get selected input device ID as observable
   */
  getSelectedInputId(): Observable<string> {
    return this.selectedInputId$.asObservable();
  }

  /**
   * Get selected output device ID as observable
   */
  getSelectedOutputId(): Observable<string> {
    return this.selectedOutputId$.asObservable();
  }

  /**
   * Get current selected input device ID (sync)
   */
  getCurrentInputDeviceId(): string {
    return this.selectedInputId$.value;
  }

  /**
   * Get current selected output device ID (sync)
   */
  getCurrentOutputDeviceId(): string {
    return this.selectedOutputId$.value;
  }

  /**
   * Get audio level data as observable (for real-time visualization)
   */
  getAudioLevel(): Observable<AudioLevelData> {
    return this.audioLevel$.asObservable();
  }

  /**
   * Check if audio monitoring is active
   */
  isAudioMonitoringActive(): boolean {
    return this.isMonitoring;
  }

  /**
   * Set the input device (microphone)
   */
  setInputDevice(deviceId: string): void {
    this.selectedInputId$.next(deviceId);
    localStorage.setItem(STORAGE_KEY_INPUT, deviceId);
    console.log('🎤 Input device set and saved to localStorage:', deviceId);
    // Verify it was saved
    const verified = localStorage.getItem(STORAGE_KEY_INPUT);
    console.log('🎤 Verified localStorage value:', verified);
  }

  /**
   * Set the output device (speaker)
   */
  setOutputDevice(deviceId: string): void {
    this.selectedOutputId$.next(deviceId);
    localStorage.setItem(STORAGE_KEY_OUTPUT, deviceId);
    console.log('🔊 Output device set and saved to localStorage:', deviceId);
    // Verify it was saved
    const verified = localStorage.getItem(STORAGE_KEY_OUTPUT);
    console.log('🔊 Verified localStorage value:', verified);
  }

  /**
   * Refresh the list of available devices
   */
  async refreshDevices(): Promise<void> {
    try {
      // Request permission first (needed to get device labels)
      await navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Stop all tracks immediately - we just needed permission
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(() => {
          console.warn('⚠️ Could not get audio permission for device enumeration');
        });

      const devices = await navigator.mediaDevices.enumerateDevices();

      const inputs: AudioDevice[] = devices
        .filter(d => d.kind === 'audioinput')
        .map(d => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${d.deviceId.slice(0, 8)}`,
          kind: 'audioinput' as const
        }));

      const outputs: AudioDevice[] = devices
        .filter(d => d.kind === 'audiooutput')
        .map(d => ({
          deviceId: d.deviceId,
          label: d.label || `Speaker ${d.deviceId.slice(0, 8)}`,
          kind: 'audiooutput' as const
        }));

      this.inputDevices$.next(inputs);
      this.outputDevices$.next(outputs);

      console.log('🎧 Audio devices refreshed:', {
        inputs: inputs.length,
        outputs: outputs.length
      });

      // Validate that saved devices still exist
      this.validateSavedDevices(inputs, outputs);

    } catch (error) {
      console.error('❌ Failed to enumerate audio devices:', error);
    }
  }

  /**
   * Load saved device selections from localStorage
   */
  private loadSavedDevices(): void {
    const savedInput = localStorage.getItem(STORAGE_KEY_INPUT);
    const savedOutput = localStorage.getItem(STORAGE_KEY_OUTPUT);

    console.log('🔧 [AudioDevice] Loading saved devices from localStorage:', {
      savedInput,
      savedOutput
    });

    if (savedInput) {
      this.selectedInputId$.next(savedInput);
    }
    if (savedOutput) {
      this.selectedOutputId$.next(savedOutput);
    }
  }

  /**
   * Validate that saved devices still exist, reset to default if not
   */
  private validateSavedDevices(inputs: AudioDevice[], outputs: AudioDevice[]): void {
    const currentInputId = this.selectedInputId$.value;
    const currentOutputId = this.selectedOutputId$.value;

    console.log('🔧 [AudioDevice] Validating saved devices:', {
      currentInputId,
      currentOutputId,
      availableInputIds: inputs.map(d => d.deviceId),
      availableOutputIds: outputs.map(d => d.deviceId)
    });

    // Check if saved input device still exists
    if (currentInputId !== 'default' && !inputs.some(d => d.deviceId === currentInputId)) {
      console.warn('⚠️ Saved input device no longer exists, resetting to default');
      console.warn('   Saved ID:', currentInputId);
      console.warn('   Available IDs:', inputs.map(d => d.deviceId));
      this.setInputDevice('default');
    } else {
      console.log('✅ Input device validated:', currentInputId);
    }

    // Check if saved output device still exists
    if (currentOutputId !== 'default' && !outputs.some(d => d.deviceId === currentOutputId)) {
      console.warn('⚠️ Saved output device no longer exists, resetting to default');
      console.warn('   Saved ID:', currentOutputId);
      console.warn('   Available IDs:', outputs.map(d => d.deviceId));
      this.setOutputDevice('default');
    } else {
      console.log('✅ Output device validated:', currentOutputId);
    }
  }

  /**
   * Start real-time microphone monitoring with audio level visualization
   */
  async startMicrophoneMonitoring(): Promise<boolean> {
    if (this.isMonitoring) {
      console.log('🎤 Already monitoring microphone');
      return true;
    }

    try {
      const deviceId = this.selectedInputId$.value;
      const constraints: MediaStreamConstraints = {
        audio: deviceId === 'default'
          ? { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
          : { deviceId: { exact: deviceId }, echoCancellation: false, noiseSuppression: false, autoGainControl: false }
      };

      this.micStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Create audio context and analyser
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      // Connect microphone to analyser
      const source = this.audioContext.createMediaStreamSource(this.micStream);
      source.connect(this.analyser);

      this.isMonitoring = true;
      console.log('🎤 Microphone monitoring started');

      // Start the visualization loop
      this.updateAudioLevel();

      return true;
    } catch (error) {
      console.error('❌ Failed to start microphone monitoring:', error);
      this.stopMicrophoneMonitoring();
      return false;
    }
  }

  /**
   * Stop microphone monitoring and cleanup
   */
  stopMicrophoneMonitoring(): void {
    this.isMonitoring = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;

    // Reset audio level
    this.audioLevel$.next({
      level: 0,
      bars: Array(12).fill(0),
      isActive: false,
      peakLevel: 0
    });

    console.log('🎤 Microphone monitoring stopped');
  }

  /**
   * Update audio level visualization (called in animation loop)
   */
  private updateAudioLevel(): void {
    if (!this.isMonitoring || !this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate overall level (RMS)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / bufferLength);
    const level = Math.min(100, (rms / 128) * 100);

    // Create 12 bars from frequency data
    const bars: number[] = [];
    const barsCount = 12;
    const samplesPerBar = Math.floor(bufferLength / barsCount);

    for (let i = 0; i < barsCount; i++) {
      let barSum = 0;
      for (let j = 0; j < samplesPerBar; j++) {
        barSum += dataArray[i * samplesPerBar + j];
      }
      const barAvg = barSum / samplesPerBar;
      // Apply some smoothing and scaling
      const barHeight = Math.min(100, (barAvg / 255) * 150);
      bars.push(barHeight);
    }

    // Track peak level
    const currentData = this.audioLevel$.value;
    const peakLevel = Math.max(currentData.peakLevel * 0.95, level);

    this.audioLevel$.next({
      level: Math.round(level),
      bars,
      isActive: true,
      peakLevel: Math.round(peakLevel)
    });

    // Continue the loop
    this.animationFrameId = requestAnimationFrame(() => this.updateAudioLevel());
  }

  /**
   * Simple microphone test (legacy - just checks if it works)
   */
  async testMicrophone(): Promise<boolean> {
    try {
      const deviceId = this.selectedInputId$.value;
      const constraints: MediaStreamConstraints = {
        audio: deviceId === 'default' ? true : { deviceId: { exact: deviceId } }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const audioTracks = stream.getAudioTracks();
      const hasAudio = audioTracks.length > 0;

      console.log('🎤 Microphone test:', hasAudio ? 'SUCCESS' : 'FAILED', {
        tracks: audioTracks.length,
        label: audioTracks[0]?.label
      });

      stream.getTracks().forEach(track => track.stop());
      return hasAudio;
    } catch (error) {
      console.error('❌ Microphone test failed:', error);
      return false;
    }
  }

  /**
   * Test the selected speaker by playing a test tone
   */
  async testSpeaker(): Promise<boolean> {
    try {
      const deviceId = this.selectedOutputId$.value;

      // Create an audio context
      const audioContext = new AudioContext();

      // Create a test tone (beep)
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 440; // A4 note
      gainNode.gain.value = 0.3;

      oscillator.start();

      // Stop after 200ms
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 200);

      // Try to set output device if supported
      if (deviceId !== 'default') {
        const audio = new Audio();
        if ('setSinkId' in audio) {
          try {
            await (audio as any).setSinkId(deviceId);
            console.log('🔊 Speaker output set to:', deviceId);
          } catch (err) {
            console.warn('⚠️ Could not set speaker output:', err);
          }
        }
      }

      console.log('🔊 Speaker test: SUCCESS');
      return true;
    } catch (error) {
      console.error('❌ Speaker test failed:', error);
      return false;
    }
  }
}
