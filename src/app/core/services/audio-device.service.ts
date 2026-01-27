import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AudioDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput';
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
   * Set the input device (microphone)
   */
  setInputDevice(deviceId: string): void {
    this.selectedInputId$.next(deviceId);
    localStorage.setItem(STORAGE_KEY_INPUT, deviceId);
    console.log('🎤 Input device set to:', deviceId);
  }

  /**
   * Set the output device (speaker)
   */
  setOutputDevice(deviceId: string): void {
    this.selectedOutputId$.next(deviceId);
    localStorage.setItem(STORAGE_KEY_OUTPUT, deviceId);
    console.log('🔊 Output device set to:', deviceId);
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

    // Check if saved input device still exists
    if (currentInputId !== 'default' && !inputs.some(d => d.deviceId === currentInputId)) {
      console.warn('⚠️ Saved input device no longer exists, resetting to default');
      this.setInputDevice('default');
    }

    // Check if saved output device still exists
    if (currentOutputId !== 'default' && !outputs.some(d => d.deviceId === currentOutputId)) {
      console.warn('⚠️ Saved output device no longer exists, resetting to default');
      this.setOutputDevice('default');
    }
  }

  /**
   * Test the selected microphone by creating a short recording
   */
  async testMicrophone(): Promise<boolean> {
    try {
      const deviceId = this.selectedInputId$.value;
      const constraints: MediaStreamConstraints = {
        audio: deviceId === 'default' ? true : { deviceId: { exact: deviceId } }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Check if we got audio tracks
      const audioTracks = stream.getAudioTracks();
      const hasAudio = audioTracks.length > 0;

      console.log('🎤 Microphone test:', hasAudio ? 'SUCCESS' : 'FAILED', {
        tracks: audioTracks.length,
        label: audioTracks[0]?.label
      });

      // Clean up
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
