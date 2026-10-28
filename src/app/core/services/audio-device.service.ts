import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface AudioDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput';
  /** El preferido guardado, que no está conectado ahora */
  desconectado?: boolean;
}

export interface AudioLevelData {
  level: number;        // 0-100
  bars: number[];       // Array of 12 bar heights (0-100)
  isActive: boolean;
  peakLevel: number;
}

const STORAGE_KEY_INPUT = 'cashi_audio_input_device';
const STORAGE_KEY_OUTPUT = 'cashi_audio_output_device';
// El nombre sirve para reconocer el headset si al reconectarlo cambia de deviceId
const STORAGE_KEY_INPUT_LABEL = 'cashi_audio_input_label';
const STORAGE_KEY_OUTPUT_LABEL = 'cashi_audio_output_label';

const MIC_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true
};

export interface MicrofonoObtenido {
  stream: MediaStream;
  dispositivo: string;
  /** No se pudo abrir el preferido y se tomó el predeterminado del sistema */
  alternativo: boolean;
}

/** Lo que el softphone está usando de verdad, para mostrarlo en /settings */
export interface DispositivoEnUso {
  label: string;
  /** El elegido no está conectado y se usa el del sistema (o ninguno) */
  alternativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AudioDeviceService {
  private inputDevices$ = new BehaviorSubject<AudioDevice[]>([]);
  private outputDevices$ = new BehaviorSubject<AudioDevice[]>([]);
  private selectedInputId$ = new BehaviorSubject<string>('default');
  private selectedOutputId$ = new BehaviorSubject<string>('default');
  // null = el softphone no está registrado
  private activeInput$ = new BehaviorSubject<DispositivoEnUso | null>(null);
  private activeOutput$ = new BehaviorSubject<DispositivoEnUso | null>(null);

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
    localStorage.setItem(STORAGE_KEY_INPUT, deviceId);
    const device = this.inputDevices$.value.find(d => d.deviceId === deviceId);
    const label = device?.label;
    // Si es el preferido desconectado se conserva el nombre guardado para reconocerlo al volver
    if (!device?.desconectado) {
      if (label && deviceId !== 'default') {
        localStorage.setItem(STORAGE_KEY_INPUT_LABEL, label);
      } else {
        localStorage.removeItem(STORAGE_KEY_INPUT_LABEL);
      }
    }
    this.selectedInputId$.next(deviceId);
    console.log('🎤 Input device set and saved to localStorage:', deviceId, label);
  }

  /**
   * Set the output device (speaker)
   */
  setOutputDevice(deviceId: string): void {
    localStorage.setItem(STORAGE_KEY_OUTPUT, deviceId);
    const device = this.outputDevices$.value.find(d => d.deviceId === deviceId);
    const label = device?.label;
    if (!device?.desconectado) {
      if (label && deviceId !== 'default') {
        localStorage.setItem(STORAGE_KEY_OUTPUT_LABEL, label);
      } else {
        localStorage.removeItem(STORAGE_KEY_OUTPUT_LABEL);
      }
    }
    this.selectedOutputId$.next(deviceId);
    console.log('🔊 Output device set and saved to localStorage:', deviceId, label);
  }

  /**
   * Abre el micrófono para el softphone. Orden: el preferido por deviceId, el preferido
   * por nombre (algunos headsets USB cambian de deviceId al reconectarse) y, si no está
   * conectado, el predeterminado del sistema. La preferencia NO se toca: cuando el
   * headset vuelva, el softphone lo retoma.
   */
  async acquireMicrophone(): Promise<MicrofonoObtenido> {
    const objetivo = await this.resolveInputDevice();

    if (objetivo) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { ...MIC_CONSTRAINTS, deviceId: { exact: objetivo.deviceId } },
          video: false
        });
        return { stream, dispositivo: this.trackLabel(stream, objetivo.label), alternativo: false };
      } catch (error) {
        console.warn('⚠️ No se pudo abrir el micrófono preferido, se usa el predeterminado:', error);
      }
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: { ...MIC_CONSTRAINTS }, video: false });
    return {
      stream,
      dispositivo: this.trackLabel(stream, 'Predeterminado'),
      alternativo: this.selectedInputId$.value !== 'default'
    };
  }

  /**
   * El micrófono preferido si está conectado (por deviceId o por nombre).
   * null = la preferencia es 'default' o el preferido no está: va el predeterminado del sistema.
   */
  async resolveInputDevice(): Promise<MediaDeviceInfo | null> {
    const inputs = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audioinput');
    return this.findPreferred(inputs, this.selectedInputId$.value, localStorage.getItem(STORAGE_KEY_INPUT_LABEL));
  }

  /** El parlante preferido si está conectado; si no, 'default'. */
  async resolveOutputDeviceId(): Promise<string> {
    const outputs = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audiooutput');
    const encontrado = this.findPreferred(outputs, this.selectedOutputId$.value, localStorage.getItem(STORAGE_KEY_OUTPUT_LABEL));
    return encontrado?.deviceId ?? 'default';
  }

  getActiveInput(): Observable<DispositivoEnUso | null> {
    return this.activeInput$.asObservable();
  }

  getActiveOutput(): Observable<DispositivoEnUso | null> {
    return this.activeOutput$.asObservable();
  }

  /** Lo llama el softphone cada vez que cambia el micrófono que está usando */
  setActiveInput(dispositivo: DispositivoEnUso | null): void {
    this.activeInput$.next(dispositivo);
  }

  /** Lo llama el softphone cada vez que cambia el parlante que está usando */
  setActiveOutput(dispositivo: DispositivoEnUso | null): void {
    this.activeOutput$.next(dispositivo);
  }

  /** groupId del micrófono predeterminado del sistema, para saber si Windows lo cambió */
  async defaultInputGroupId(): Promise<string | null> {
    const inputs = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audioinput');
    return (inputs.find(d => d.deviceId === 'default') ?? inputs[0])?.groupId ?? null;
  }

  private findPreferred(devices: MediaDeviceInfo[], preferidoId: string, preferidoLabel: string | null): MediaDeviceInfo | null {
    if (!preferidoId || preferidoId === 'default') return null;
    return devices.find(d => d.deviceId === preferidoId)
      ?? (preferidoLabel ? devices.find(d => d.label === preferidoLabel) : undefined)
      ?? null;
  }

  private trackLabel(stream: MediaStream, alterno: string): string {
    return stream.getAudioTracks()[0]?.label || alterno;
  }

  /**
   * Refresh the list of available devices
   */
  async refreshDevices(): Promise<void> {
    try {
      let devices = await navigator.mediaDevices.enumerateDevices();

      // Sin permiso los dispositivos vienen sin nombre: solo entonces se abre el micrófono.
      // Abrirlo en cada devicechange hacía que los headsets Bluetooth cambiaran de perfil
      // (y eso dispara otro devicechange) en plena llamada.
      if (devices.some(d => d.kind === 'audioinput' && !d.label)) {
        await navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => stream.getTracks().forEach(track => track.stop()))
          .catch(() => console.warn('⚠️ Could not get audio permission for device enumeration'));
        devices = await navigator.mediaDevices.enumerateDevices();
      }

      // La entrada 'default' del navegador ya está en el selector como "Usar dispositivo del
      // sistema"; repetida, el select tenía dos opciones con el mismo value
      const inputs: AudioDevice[] = devices
        .filter(d => d.kind === 'audioinput' && d.deviceId !== 'default')
        .map(d => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${d.deviceId.slice(0, 8)}`,
          kind: 'audioinput' as const
        }));

      const outputs: AudioDevice[] = devices
        .filter(d => d.kind === 'audiooutput' && d.deviceId !== 'default')
        .map(d => ({
          deviceId: d.deviceId,
          label: d.label || `Speaker ${d.deviceId.slice(0, 8)}`,
          kind: 'audiooutput' as const
        }));

      this.adoptarIdNuevo(inputs, this.selectedInputId$, STORAGE_KEY_INPUT, STORAGE_KEY_INPUT_LABEL);
      this.adoptarIdNuevo(outputs, this.selectedOutputId$, STORAGE_KEY_OUTPUT, STORAGE_KEY_OUTPUT_LABEL);

      // El preferido desconectado se sigue mostrando para que la lista no quede en blanco
      // y el asesor vea que su headset no está
      this.addDisconnectedPreferred(inputs, this.selectedInputId$.value, STORAGE_KEY_INPUT_LABEL, 'audioinput');
      this.addDisconnectedPreferred(outputs, this.selectedOutputId$.value, STORAGE_KEY_OUTPUT_LABEL, 'audiooutput');

      this.inputDevices$.next(inputs);
      this.outputDevices$.next(outputs);

      console.log('🎧 Audio devices refreshed:', {
        inputs: inputs.length,
        outputs: outputs.length
      });

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
   * Headset reconectado con otro deviceId (pasa con algunos USB): la preferencia pasa al id
   * nuevo. Sin esto el selector de /settings quedaba en blanco aunque el headset estuviera.
   */
  private adoptarIdNuevo(list: AudioDevice[], selected$: BehaviorSubject<string>,
                         storageKey: string, labelKey: string): void {
    const preferidoId = selected$.value;
    if (preferidoId === 'default' || list.some(d => d.deviceId === preferidoId)) return;
    const label = localStorage.getItem(labelKey);
    const nuevo = label ? list.find(d => d.label === label) : undefined;
    if (nuevo) {
      console.log('🎧 Dispositivo preferido reconectado con otro id:', label);
      localStorage.setItem(storageKey, nuevo.deviceId);
      selected$.next(nuevo.deviceId);
    }
  }

  /**
   * Antes se cambiaba la preferencia a 'default' cuando el headset no estaba, y al
   * reconectarlo ya nadie sabía que era el preferido. Ahora la preferencia se conserva.
   */
  private addDisconnectedPreferred(list: AudioDevice[], preferidoId: string, labelKey: string,
                                   kind: 'audioinput' | 'audiooutput'): void {
    if (preferidoId === 'default' || list.some(d => d.deviceId === preferidoId)) return;
    const label = localStorage.getItem(labelKey);
    list.push({ deviceId: preferidoId, label: `${label || 'Dispositivo guardado'} (desconectado)`, kind, desconectado: true });
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
