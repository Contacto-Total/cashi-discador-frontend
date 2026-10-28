import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { FontSizeService } from '../../core/services/font-size.service';
import { ThemeService, Theme } from '../../shared/services/theme.service';
import { AudioDeviceService, AudioDevice, AudioLevelData, DispositivoEnUso } from '../../core/services/audio-device.service';
import { AuthService } from '../../core/services/auth.service';
import { PruebaLlamadaComponent } from './prueba-llamada/prueba-llamada.component';
import { ESTILOS } from '../asistencia/asistencia.estilos';

type Seccion = 'appearance' | 'font' | 'audio';

// Mismo sistema visual que el módulo de asistencia (asistencia.estilos.ts)
const PASTILLA = {
  neutra: 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400',
  azul: 'bg-[#eef2ff] text-[#3730a3] dark:bg-indigo-950/50 dark:text-indigo-300',
  roja: 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300',
  ambar: 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300'
} as const;

@Component({
  selector: 'app-settings',
  standalone: true,
  // Toma la tipografía y los ajustes del módulo de asistencia (styles.css, «MÓDULO DE ASISTENCIA»)
  host: { class: 'cashi-asistencia' },
  imports: [CommonModule, FormsModule, LucideAngularModule, PruebaLlamadaComponent],
  templateUrl: './settings.component.html',
  styles: [`
    :host { display: block; min-height: 100%; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
    /* El select nativo pierde su flecha con appearance: none; se dibuja una */
    .select-flecha {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238491a3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") !important;
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 14px;
    }
  `]
})
export class SettingsComponent implements OnInit, OnDestroy {
  readonly estilos = ESTILOS;
  readonly pastillaNeutra = PASTILLA.neutra;
  readonly pastillaAzul = PASTILLA.azul;
  readonly pastillaRoja = PASTILLA.roja;
  readonly pastillaAmbar = PASTILLA.ambar;
  readonly avisoUso = 'flex items-start gap-2 rounded-lg px-3 py-2 text-[12px] leading-[1.45]';
  readonly avisoVerde = 'bg-[#e8f5ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300';
  readonly avisoAmbar = 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300';
  readonly selectFlecha = 'select-flecha truncate !pr-9 cursor-pointer disabled:cursor-default disabled:opacity-60';

  readonly temas: { clave: Theme; texto: string; marco: string; lateral: string; cabecera: string; linea: string }[] = [
    { clave: 'light', texto: 'Claro', marco: 'border-[#e6e9ee] bg-white', lateral: 'bg-[#f1f3f6]', cabecera: 'bg-[#e6e9ee]', linea: 'bg-[#e6e9ee]' },
    { clave: 'dark', texto: 'Oscuro', marco: 'border-slate-700 bg-slate-900', lateral: 'bg-slate-800', cabecera: 'bg-slate-700', linea: 'bg-slate-700' }
  ];

  // Active section (pestañas)
  activeSection: Seccion = 'font';

  // Solo ADMIN puede ver la pestaña de apariencia
  get isAdmin(): boolean {
    return this.authService.getCurrentUser()?.role === 'ADMIN';
  }

  get secciones(): { clave: Seccion; texto: string; icono: string }[] {
    return [
      ...(this.isAdmin ? [{ clave: 'appearance' as const, texto: 'Apariencia', icono: 'palette' }] : []),
      { clave: 'font', texto: 'Tamaño de texto', icono: 'type' },
      { clave: 'audio', texto: 'Audio', icono: 'headphones' }
    ];
  }

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
  // Lo que el softphone está usando ahora (null = no registrado)
  activeInput: DispositivoEnUso | null = null;
  activeOutput: DispositivoEnUso | null = null;
  isTestingMic: boolean = false;
  isTestingSpeaker: boolean = false;
  micTestResult: 'success' | 'error' | null = null;
  speakerTestResult: 'success' | 'error' | null = null;

  // Audio level monitoring
  audioLevel: AudioLevelData = {
    level: 0,
    bars: Array(12).fill(0),
    isActive: false,
    peakLevel: 0
  };
  isMicMonitoring: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private fontSizeService: FontSizeService,
    private themeService: ThemeService,
    private audioDeviceService: AudioDeviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Si es ADMIN, mostrar pestaña de apariencia por defecto
    if (this.isAdmin) {
      this.activeSection = 'appearance';
    }

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
      }),
      this.audioDeviceService.getActiveInput().subscribe(d => {
        this.activeInput = d;
      }),
      this.audioDeviceService.getActiveOutput().subscribe(d => {
        this.activeOutput = d;
      }),
      // Subscribe to audio level for real-time visualization
      this.audioDeviceService.getAudioLevel().subscribe(level => {
        this.audioLevel = level;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    // Stop microphone monitoring when leaving the page
    this.stopMicrophoneMonitoring();
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
   * Toggle microphone monitoring (start/stop)
   */
  async toggleMicrophoneMonitoring(): Promise<void> {
    if (this.isMicMonitoring) {
      this.stopMicrophoneMonitoring();
    } else {
      await this.startMicrophoneMonitoring();
    }
  }

  /**
   * Start microphone monitoring with real-time visualization
   */
  async startMicrophoneMonitoring(): Promise<void> {
    this.isTestingMic = true;
    this.micTestResult = null;

    const success = await this.audioDeviceService.startMicrophoneMonitoring();

    if (success) {
      this.isMicMonitoring = true;
      this.isTestingMic = false;
    } else {
      this.micTestResult = 'error';
      this.isTestingMic = false;
      this.isMicMonitoring = false;

      // Clear error after 3 seconds
      setTimeout(() => {
        this.micTestResult = null;
      }, 3000);
    }
  }

  /**
   * Stop microphone monitoring
   */
  stopMicrophoneMonitoring(): void {
    this.audioDeviceService.stopMicrophoneMonitoring();
    this.isMicMonitoring = false;
    this.isTestingMic = false;
  }

  /**
   * Legacy test microphone (simple check)
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
