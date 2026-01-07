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

export interface AutoDialerConfiguracion {
  intensidadMarcacion: number;
  intervaloMarcacionSegundos: number;
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
   */
  getAgentesMonitoreo(): Observable<AgenteMonitoreo[]> {
    return this.http.get<AgenteMonitoreo[]>(
      `${this.apiUrl}/agentes-monitoreo`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Inicia polling de agentes cada 3 segundos
   */
  startAgentesPolling(): Observable<AgenteMonitoreo[]> {
    return interval(3000).pipe(
      startWith(0),
      switchMap(() => this.getAgentesMonitoreo())
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
   * Obtiene la configuración actual del autodialer
   */
  getConfiguracion(): Observable<AutoDialerConfiguracion> {
    return this.http.get<AutoDialerConfiguracion>(
      `${this.apiUrl}/configuracion`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Actualiza la configuración del autodialer
   */
  updateConfiguracion(config: AutoDialerConfiguracion): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/configuracion`,
      config,
      { headers: this.getHeaders() }
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
