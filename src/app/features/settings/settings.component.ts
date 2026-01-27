import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { FontSizeService } from '../../core/services/font-size.service';
import { ThemeService, Theme } from '../../shared/services/theme.service';
import { AudioDeviceService, AudioDevice } from '../../core/services/audio-device.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  // Active section for sidebar navigation
  activeSection: 'appearance' | 'font' | 'audio' = 'appearance';

  // Font size - applied (saved)
  appliedFontSize: number = 16;

  // Font size - preview (not saved yet)
  previewFontSize: number = 16;

  minFontSize: number = 14;
  maxFontSize: number = 24;
  defaultFontSize: number = 16;

  // Theme - using getter to read from service signal
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  // Preview text
  previewText: string = 'Este es un texto de ejemplo para visualizar el tamaño de la fuente seleccionada.';

  // Audio devices
  inputDevices: AudioDevice[] = [];
  outputDevices: AudioDevice[] = [];
  selectedInputId: string = 'default';
  selectedOutputId: string = 'default';
  isTestingMic: boolean = false;
  isTestingSpeaker: boolean = false;
  micTestResult: 'success' | 'error' | null = null;
  speakerTestResult: 'success' | 'error' | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private fontSizeService: FontSizeService,
    private themeService: ThemeService,
    private audioDeviceService: AudioDeviceService
  ) {}

  ngOnInit(): void {
    // Load font size settings
    this.minFontSize = this.fontSizeService.getMinSize();
    this.maxFontSize = this.fontSizeService.getMaxSize();
    this.defaultFontSize = this.fontSizeService.getDefaultSize();

    // Subscribe to font size changes
    this.subscriptions.push(
      this.fontSizeService.fontSize$.subscribe(size => {
        this.appliedFontSize = size;
        this.previewFontSize = size;
      })
    );
    // Theme is read directly from service signal via getter

    // Subscribe to audio devices
    this.subscriptions.push(
      this.audioDeviceService.getInputDevices().subscribe(devices => {
        this.inputDevices = devices;
      }),
      this.audioDeviceService.getOutputDevices().subscribe(devices => {
        this.outputDevices = devices;
      }),
      this.audioDeviceService.getSelectedInputId().subscribe(id => {
        this.selectedInputId = id;
      }),
      this.audioDeviceService.getSelectedOutputId().subscribe(id => {
        this.selectedOutputId = id;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Handle font size slider change - only updates preview
   */
  onFontSizeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.previewFontSize = parseInt(target.value, 10);
  }

  /**
   * Increase font size - only preview
   */
  increaseFontSize(): void {
    if (this.previewFontSize < this.maxFontSize) {
      this.previewFontSize++;
    }
  }

  /**
   * Decrease font size - only preview
   */
  decreaseFontSize(): void {
    if (this.previewFontSize > this.minFontSize) {
      this.previewFontSize--;
    }
  }

  /**
   * Apply font size changes - saves to localStorage
   */
  applyFontSize(): void {
    this.fontSizeService.setFontSize(this.previewFontSize);
  }

  /**
   * Reset font size to default
   */
  resetFontSize(): void {
    this.previewFontSize = this.defaultFontSize;
    this.fontSizeService.resetFontSize();
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  /**
   * Check if preview font size is at default
   */
  isDefaultFontSize(): boolean {
    return this.previewFontSize === this.defaultFontSize;
  }

  /**
   * Check if there are pending changes
   */
  hasChanges(): boolean {
    return this.previewFontSize !== this.appliedFontSize;
  }

  /**
   * Get percentage for slider background
   */
  getSliderPercentage(): number {
    return ((this.previewFontSize - this.minFontSize) / (this.maxFontSize - this.minFontSize)) * 100;
  }

  /**
   * Handle input device selection (ngModel)
   */
  onInputDeviceSelect(deviceId: string): void {
    this.audioDeviceService.setInputDevice(deviceId);
    // Clear previous test result
    this.micTestResult = null;
  }

  /**
   * Handle output device selection (ngModel)
   */
  onOutputDeviceSelect(deviceId: string): void {
    this.audioDeviceService.setOutputDevice(deviceId);
    // Clear previous test result
    this.speakerTestResult = null;
  }

  /**
   * Test the selected microphone
   */
  async testMicrophone(): Promise<void> {
    this.isTestingMic = true;
    this.micTestResult = null;

    const success = await this.audioDeviceService.testMicrophone();

    this.micTestResult = success ? 'success' : 'error';
    this.isTestingMic = false;

    // Clear result after 3 seconds
    setTimeout(() => {
      this.micTestResult = null;
    }, 3000);
  }

  /**
   * Test the selected speaker
   */
  async testSpeaker(): Promise<void> {
    this.isTestingSpeaker = true;
    this.speakerTestResult = null;

    const success = await this.audioDeviceService.testSpeaker();

    this.speakerTestResult = success ? 'success' : 'error';
    this.isTestingSpeaker = false;

    // Clear result after 3 seconds
    setTimeout(() => {
      this.speakerTestResult = null;
    }, 3000);
  }

  /**
   * Refresh audio device list
   */
  async refreshAudioDevices(): Promise<void> {
    await this.audioDeviceService.refreshDevices();
  }
}
