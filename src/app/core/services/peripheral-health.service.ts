import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { SipService } from './sip.service';
import { environment } from '../../../environments/environment';

export interface PeripheralProblem {
  type: 'MIC_MISSING' | 'MIC_PERMISSION' | 'MIC_DISCONNECTED' | 'SPEAKER_MISSING' | 'SIP_DISCONNECTED';
  message: string;
  solution: string;
  severity: 'error' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class PeripheralHealthService implements OnDestroy {
  private problems$ = new BehaviorSubject<PeripheralProblem[]>([]);
  private checking$ = new BehaviorSubject<boolean>(false);
  private checkInterval?: Subscription;
  private lastReportedStatus = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private sipService: SipService
  ) {
    // Listen for device changes (plug/unplug)
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        console.log('[PeripheralHealth] Device change detected, re-checking...');
        this.runCheck();
      });
    }
  }

  /** Start periodic checks (call once after login) */
  start(): void {
    if (this.checkInterval) return;
    console.log('[PeripheralHealth] Starting periodic checks (every 30s)');
    this.runCheck();
    this.checkInterval = interval(30000).subscribe(() => this.runCheck());
  }

  /** Stop checks (call on logout) */
  stop(): void {
    this.checkInterval?.unsubscribe();
    this.checkInterval = undefined;
    this.problems$.next([]);
    this.lastReportedStatus = '';
  }

  ngOnDestroy(): void {
    this.stop();
  }

  /** Observable of current problems (empty = all OK) */
  getProblems(): Observable<PeripheralProblem[]> {
    return this.problems$.asObservable();
  }

  /** Observable for checking state (for spinner on Verify button) */
  isChecking(): Observable<boolean> {
    return this.checking$.asObservable();
  }

  /** Manual re-check (Verify button) */
  async runCheck(): Promise<void> {
    this.checking$.next(true);
    const problems: PeripheralProblem[] = [];

    try {
      // 1. Check microphone permission
      const micPermission = await this.checkMicPermission();
      if (micPermission === 'denied') {
        problems.push({
          type: 'MIC_PERMISSION',
          message: 'Permiso de micrófono bloqueado',
          solution: 'Haz click en el candado de la barra del navegador y permite el micrófono',
          severity: 'error'
        });
      }

      // 2. Enumerate devices
      if (micPermission !== 'denied') {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter(d => d.kind === 'audioinput');
        const speakers = devices.filter(d => d.kind === 'audiooutput');

        if (mics.length === 0) {
          problems.push({
            type: 'MIC_MISSING',
            message: 'No se detecta micrófono',
            solution: 'Conecta tus audífonos y haz click en Verificar',
            severity: 'error'
          });
        }

        if (speakers.length === 0) {
          problems.push({
            type: 'SPEAKER_MISSING',
            message: 'No se detecta parlante',
            solution: 'Conecta tus audífonos y haz click en Verificar',
            severity: 'error'
          });
        }

        // 3. Check if selected mic still exists
        if (mics.length > 0) {
          const savedMicId = localStorage.getItem('cashi_audio_input_device');
          if (savedMicId && savedMicId !== 'default' && !mics.some(m => m.deviceId === savedMicId)) {
            problems.push({
              type: 'MIC_DISCONNECTED',
              message: 'Tu micrófono se desconectó',
              solution: 'Reconecta tus audífonos y haz click en Verificar',
              severity: 'error'
            });
          }
        }
      }

      // 4. Check SIP registration
      if (!this.sipService.isRegistered()) {
        problems.push({
          type: 'SIP_DISCONNECTED',
          message: 'Sin conexión al servidor de llamadas',
          solution: 'Verifica tu internet. Si persiste, recarga la página (F5)',
          severity: 'warning'
        });
      }
    } catch (err) {
      console.error('[PeripheralHealth] Error during check:', err);
    }

    this.problems$.next(problems);
    this.checking$.next(false);

    // Report to backend
    this.reportToBackend(problems);
  }

  private async checkMicPermission(): Promise<string> {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return result.state; // 'granted', 'denied', 'prompt'
    } catch {
      return 'unknown';
    }
  }

  private reportToBackend(problems: PeripheralProblem[]): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return;

    // Determine worst status
    let status = 'OK';
    if (problems.length > 0) {
      const errorProblem = problems.find(p => p.severity === 'error');
      status = errorProblem ? errorProblem.type : problems[0].type;
    }

    // Only report if status changed
    if (status === this.lastReportedStatus) return;
    this.lastReportedStatus = status;

    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${environment.apiUrl}/agent-status/${user.id}/peripheral`;

    this.http.post(url, { status }, { headers }).subscribe({
      next: () => console.log(`[PeripheralHealth] Reported: ${status}`),
      error: (err) => console.warn('[PeripheralHealth] Report failed:', err.status)
    });
  }
}
