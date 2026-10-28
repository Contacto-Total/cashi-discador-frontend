import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export type EventoAudio =
  | 'MIC_PERDIDO'
  | 'MIC_RECUPERADO'
  | 'MIC_CAMBIADO'
  | 'MIC_NO_DISPONIBLE'
  | 'SIN_MIC_AL_CONTESTAR'
  | 'ICE_DESCONECTADO'
  | 'ICE_FALLIDO'
  | 'ICE_RECONECTADO';

export interface EventoAudioPayload {
  evento: EventoAudio;
  dispositivo?: string | null;
  enLlamada: boolean;
  callUuid?: string | null;
  detalle?: string | null;
  ocurridoEn: number;
}

/**
 * Reporta al backend los eventos de audio del softphone (quedan en el log del backend como [AUDIO-EVT])
 * para cruzarlos con las llamadas caídas. Antes solo quedaban en la consola del navegador.
 *
 * Si el envío falla (justo cuando se cae la red, que es cuando más interesa) el evento
 * queda en cola y sale con el siguiente envío que funcione. ocurridoEn conserva la hora real.
 */
@Injectable({
  providedIn: 'root'
})
export class AudioTelemetryService {
  private static readonly MAX_PENDIENTES = 50;
  private pendientes: EventoAudioPayload[] = [];
  private enviando = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  reportar(evento: Omit<EventoAudioPayload, 'ocurridoEn'>): void {
    console.log(`[AudioTelemetry] ${evento.evento}`, evento);
    this.pendientes.push({ ...evento, ocurridoEn: Date.now() });
    if (this.pendientes.length > AudioTelemetryService.MAX_PENDIENTES) {
      this.pendientes.shift();
    }
    this.vaciarCola();
  }

  private vaciarCola(): void {
    if (this.enviando || this.pendientes.length === 0) return;

    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.pendientes = [];
      return;
    }

    this.enviando = true;
    const siguiente = this.pendientes[0];
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
    const url = `${environment.apiUrl}/agent-status/${user.id}/audio-event`;

    this.http.post(url, siguiente, { headers }).subscribe({
      next: () => {
        this.pendientes.shift();
        this.enviando = false;
        this.vaciarCola();
      },
      error: (err) => {
        this.enviando = false;
        // Un 4xx no se arregla reintentando: se descarta para no trabar la cola
        if (err.status >= 400 && err.status < 500) {
          console.warn('[AudioTelemetry] Evento rechazado, se descarta:', err.status);
          this.pendientes.shift();
          this.vaciarCola();
          return;
        }
        // Red caída o 5xx: se queda en cola y sale con el próximo evento
        console.warn('[AudioTelemetry] Envío fallido, queda en cola:', err.status);
      }
    });
  }
}
