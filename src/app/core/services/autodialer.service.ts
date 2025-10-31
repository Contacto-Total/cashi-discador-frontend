import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, switchMap, startWith } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AutoDialerStatus {
  activo: boolean;
  fechaActivacion?: string;
  fechaDesactivacion?: string;
  usuarioActivacion?: string;
  notas?: string;
}

export interface AutoDialerEstadisticas {
  activo: boolean;
  agentesDisponibles: number;
  contactosPendientes: number;
  llamadasActivas: number;
  llamadasCompletadasHoy: number;
  contactosCompletados: number;
  contactosFallidos: number;
  // Nuevas métricas detalladas
  totalLlamadas: number;
  llamadasEnCola: number;
  llamadasConectadas: number;
  llamadasMarcando: number;
  llamadasNoContestadas: number;
  llamadasAbandonadas: number;
  duracionPromedioSegundos: number;
  duracionPromedioFormato: string;
  duracionMaximaSegundos: number;
  duracionMaximaFormato: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutoDialerService {
  private apiUrl = `${environment.gatewayUrl}/admin/autodialer`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Activa el auto-dialer
   */
  activar(usuario: string = 'admin', notas: string = 'Activación desde panel'): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/activar`,
      { usuario, notas },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Desactiva el auto-dialer
   */
  desactivar(notas: string = 'Desactivación desde panel'): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/desactivar`,
      { notas },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Toggle (activar/desactivar) el auto-dialer
   */
  toggle(usuario: string = 'admin'): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/toggle`,
      { usuario },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtiene el estado actual del auto-dialer
   */
  getEstado(): Observable<AutoDialerStatus> {
    return this.http.get<AutoDialerStatus>(
      `${this.apiUrl}/estado`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtiene estadísticas en tiempo real
   */
  getEstadisticas(): Observable<AutoDialerEstadisticas> {
    return this.http.get<AutoDialerEstadisticas>(
      `${this.apiUrl}/estadisticas`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Health check del servicio
   */
  healthCheck(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/health`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Inicia polling de estadísticas cada 5 segundos
   */
  startStatsPolling(): Observable<AutoDialerEstadisticas> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.getEstadisticas())
    );
  }
}
