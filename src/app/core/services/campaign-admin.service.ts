import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Campaign {
  id?: number;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  dialMode: 'MANUAL' | 'PROGRESSIVE' | 'PREDICTIVE';
  startDate?: string;
  endDate?: string;
  maxAttempts?: number;
  retryInterval?: number;
  callerId?: string;
  aggressiveness?: number;
  intensidad?: number; // 1-100, default 50
  estaDiscando?: boolean; // Control de discado automático
  createdAt?: string;
  updatedAt?: string;

  // Relaciones con Tenant/Portfolio/SubPortfolio
  tenantId?: number;
  portfolioId?: number;
  subPortfolioId?: number;

  // Estadísticas (solo para lectura)
  totalContacts?: number;
  pendingContacts?: number;
  contactedContacts?: number;
  totalCalls?: number;
  answeredCalls?: number;
  contactRate?: number;
}

export interface ImportStats {
  totalClientes: number;
  fuenteDatos: string;
  inquilino?: number;
  cartera?: number;
  subcartera?: number;
}

export interface CampaignStatistics {
  idCampana: number;
  nombre: string;
  descripcion?: string;
  estadoActual: string;
  fechaInicio?: string;
  fechaFinal?: string;
  totalRegistros: number;
  faltaReintentar: number;
  reintentosCompletados: number;
  faltaLlamar: number;
  totalLlamadas: number;
  llamadasExitosas: number;
  llamadasNoContestadas: number;
  llamadasFallidas: number;
  llamadasAbandonadas: number;
  duracionPromedioLlamada: string;
  duracionMaximaLlamada: string;
  duracionPromedioSegundos: number;
  duracionMaximaSegundos: number;
  modoDiscado: string;
  intentosMaximos: number;
  intervaloReintento: number;
  llamadasContestadas: number;
  llamadasCortas: number;
  llamadasBuzonVoz: number;
  llamadasPausadas: number;
}

export interface CampaignCall {
  idLlamada: number;
  fecha: string;
  telefono: string;
  dato: string;
  estado: string;
  causa?: string;
  duracion: string;
  duracionSegundos: number;
  intentos: number;
  agenteNombre?: string;
  agenteExtension?: string;
  uuidLlamada: string;
  idContacto: number;
  estadoContacto: string;
}

export interface CampaignCallsResponse {
  content: CampaignCall[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class CampaignAdminService {
  private apiUrl = `${environment.gatewayUrl}/campaigns`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Obtiene todas las campañas
   */
  getAllCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/list`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene una campaña por ID con estadísticas
   */
  getCampaignById(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Crea una nueva campaña
   */
  createCampaign(campaign: Campaign): Observable<any> {
    return this.http.post(this.apiUrl, campaign, { headers: this.getHeaders() });
  }

  /**
   * Actualiza una campaña
   */
  updateCampaign(id: number, campaign: Campaign): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, campaign, { headers: this.getHeaders() });
  }

  /**
   * Elimina una campaña
   */
  deleteCampaign(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Activa una campaña (inicia discado automático)
   */
  activarCampaign(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/start`, {}, { headers: this.getHeaders() });
  }

  /**
   * Pausa una campaña
   */
  pausarCampaign(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/pause`, {}, { headers: this.getHeaders() });
  }

  /**
   * Detiene una campaña completamente
   */
  detenerCampaign(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/detener`, {}, { headers: this.getHeaders() });
  }

  /**
   * Inicia el discado automático para una campaña específica
   */
  startDialing(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/${id}/start-dialing`, {}, { headers: this.getHeaders() });
  }

  /**
   * Detiene el discado automático para una campaña específica
   */
  stopDialing(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/${id}/stop-dialing`, {}, { headers: this.getHeaders() });
  }

  /**
   * Importa contactos desde cashi_db.clientes (ya no usa límite)
   */
  importarContactos(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/importar-contactos`, {}, { headers: this.getHeaders() });
  }

  /**
   * Obtiene estadísticas de importación disponibles para una campaña
   */
  getImportStats(id: number): Observable<ImportStats> {
    return this.http.get<ImportStats>(`${this.apiUrl}/${id}/import-stats`, { headers: this.getHeaders() });
  }

  /**
   * Helper para obtener el color según el estado
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'DRAFT': '#6B7280',
      'ACTIVE': '#10B981',
      'PAUSED': '#F59E0B',
      'COMPLETED': '#3B82F6'
    };
    return colors[status] || '#6B7280';
  }

  /**
   * Helper para obtener el texto del estado
   */
  getStatusText(status: string): string {
    const texts: Record<string, string> = {
      'DRAFT': 'Borrador',
      'ACTIVE': 'Activa',
      'PAUSED': 'Pausada',
      'COMPLETED': 'Completada'
    };
    return texts[status] || status;
  }

  /**
   * Obtiene estadísticas detalladas de una campaña
   */
  getCampaignStatistics(id: number): Observable<CampaignStatistics> {
    return this.http.get<CampaignStatistics>(`${this.apiUrl}/${id}/statistics`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene el historial de llamadas de una campaña con paginación y búsqueda
   */
  getCampaignCalls(id: number, page: number = 0, size: number = 10, search?: string): Observable<CampaignCallsResponse> {
    let url = `${this.apiUrl}/${id}/calls?page=${page}&size=${size}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get<CampaignCallsResponse>(url, { headers: this.getHeaders() });
  }
}
