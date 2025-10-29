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
  createdAt?: string;
  updatedAt?: string;

  // Estadísticas (solo para lectura)
  totalContacts?: number;
  pendingContacts?: number;
  contactedContacts?: number;
  totalCalls?: number;
  answeredCalls?: number;
  contactRate?: number;
}

export interface ImportStats {
  totalTelefonosActivos: number;
  totalTelefonosPreferidos: number;
  fuenteDatos: string;
}

@Injectable({
  providedIn: 'root'
})
export class CampaignAdminService {
  private apiUrl = `${environment.gatewayUrl}/admin/campaigns`;

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
    return this.http.get<Campaign[]>(this.apiUrl, { headers: this.getHeaders() });
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
    return this.http.post(`${this.apiUrl}/${id}/activar`, {}, { headers: this.getHeaders() });
  }

  /**
   * Pausa una campaña
   */
  pausarCampaign(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/pausar`, {}, { headers: this.getHeaders() });
  }

  /**
   * Detiene una campaña completamente
   */
  detenerCampaign(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/detener`, {}, { headers: this.getHeaders() });
  }

  /**
   * Importa contactos desde la tabla externa
   */
  importarContactos(id: number, limit?: number): Observable<any> {
    const body = limit ? { limit } : {};
    return this.http.post(`${this.apiUrl}/${id}/importar-contactos`, body, { headers: this.getHeaders() });
  }

  /**
   * Obtiene estadísticas de importación disponibles
   */
  getImportStats(): Observable<ImportStats> {
    return this.http.get<ImportStats>(`${this.apiUrl}/import-stats`, { headers: this.getHeaders() });
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
}
