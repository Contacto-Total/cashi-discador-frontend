import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, switchMap, startWith } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AutoDialerStatus {
  activo: boolean;
  mensaje?: string;
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
  llamadasFinalizadas: number;
  duracionPromedioSegundos: number;
  duracionPromedioFormato: string;
  duracionMaximaSegundos: number;
  duracionMaximaFormato: string;
}

export interface AgenteMonitoreo {
  idUsuario: number;
  sipExtension: string;
  nombreCompleto: string;
  estadoActual: string;
  telefonoDestino: string | null;
  segundosEnEstado: number;
  uuidLlamadaActual: string | null;
  // Campos de umbral de tiempo
  colorIndicador: 'verde' | 'amarillo' | 'rojo';
  porcentajeTiempo: number;
  excedeTiempoMaximo: boolean;
  tiempoMaximoSegundos: number | null;
  mensajeAlerta: string | null;
  sonidoAlerta: boolean;
}

export interface LlamadaTiempoReal {
  id: number;
  anexoDestino: string;        // Teléfono del cliente
  anexoAgente: string;          // Extensión del agente
  nombreAgente: string;         // Nombre completo del agente
  fechaInicio: string;
  estadoLlamada: string;        // MARCANDO, CONECTADA, EN_CURSO
  duracionSegundos: number;     // Duración hasta ahora
  uuidLlamada: string;
  idContacto: number;
  idAgente: number;
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
   * Obtiene el estado actual del auto-dialer (si hay campañas discando)
   */
  getEstado(): Observable<AutoDialerStatus> {
    return this.http.get<AutoDialerStatus>(
      `${this.apiUrl}/estado`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtiene estadísticas en tiempo real
   * @param campaignId ID de campaña para filtrar (opcional)
   */
  getEstadisticas(campaignId?: number): Observable<AutoDialerEstadisticas> {
    const url = campaignId
      ? `${this.apiUrl}/estadisticas?campaignId=${campaignId}`
      : `${this.apiUrl}/estadisticas`;
    return this.http.get<AutoDialerEstadisticas>(
      url,
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
   * @param campaignId ID de campaña para filtrar (opcional)
   */
  startStatsPolling(campaignId?: number): Observable<AutoDialerEstadisticas> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.getEstadisticas(campaignId))
    );
  }

  /**
   * Obtiene lista de agentes para monitoreo en tiempo real
   * @param campaignId ID de campaña para filtrar agentes por subcartera (opcional)
   */
  getAgentesMonitoreo(campaignId?: number): Observable<AgenteMonitoreo[]> {
    let url = `${this.apiUrl}/agentes-monitoreo`;
    if (campaignId) {
      url += `?campaignId=${campaignId}`;
    }
    return this.http.get<AgenteMonitoreo[]>(url, { headers: this.getHeaders() });
  }

  /**
   * Inicia polling de agentes cada 3 segundos
   * @param campaignId ID de campaña para filtrar agentes por subcartera (opcional)
   */
  startAgentesPolling(campaignId?: number): Observable<AgenteMonitoreo[]> {
    return interval(3000).pipe(
      startWith(0),
      switchMap(() => this.getAgentesMonitoreo(campaignId))
    );
  }

  /**
   * Obtiene todas las llamadas en tiempo real (MARCANDO, CONECTADA, EN_CURSO)
   */
  getLlamadasEnTiempoReal(): Observable<LlamadaTiempoReal[]> {
    return this.http.get<LlamadaTiempoReal[]>(
      `${this.apiUrl}/llamadas-tiempo-real`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtiene llamadas en tiempo real filtradas por campaña
   */
  getLlamadasEnTiempoRealByCampaign(campaignId: number): Observable<LlamadaTiempoReal[]> {
    return this.http.get<LlamadaTiempoReal[]>(
      `${this.apiUrl}/llamadas-tiempo-real/${campaignId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Inicia polling de llamadas en tiempo real cada 2 segundos
   * Si se proporciona campaignId, filtra por esa campaña
   */
  startLlamadasPolling(campaignId?: number): Observable<LlamadaTiempoReal[]> {
    return interval(2000).pipe(
      startWith(0),
      switchMap(() =>
        campaignId
          ? this.getLlamadasEnTiempoRealByCampaign(campaignId)
          : this.getLlamadasEnTiempoReal()
      )
    );
  }

  /**
   * Cambia el estado de un agente (para uso de supervisores)
   */
  cambiarEstadoAgente(idUsuario: number, estado: string, notas?: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/agent-status/${idUsuario}/cambiar-estado`,
      { estado, notas: notas || '' },
      { headers: this.getHeaders() }
    );
  }
}
