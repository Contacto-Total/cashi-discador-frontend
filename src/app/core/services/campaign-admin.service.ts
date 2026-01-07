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

  // Tipo de filtro de estado para rangos por tipo de contacto
  tipoFiltroEstado?: 'ULTIMO_ESTADO' | 'MEJOR_ESTADO_MES' | 'MEJOR_ESTADO_HISTORICO';

  // Estadísticas (solo para lectura)
  totalContacts?: number;
  pendingContacts?: number;
  contactedContacts?: number;
  totalCalls?: number;
  answeredCalls?: number;
  contactRate?: number;
}

// Tipos de contacto para filtros de campaña
export type TipoContacto = 'CD' | 'CI' | 'PR' | 'NC';

export interface TipoContactoInfo {
  codigo: TipoContacto;
  nombre: string;
  descripcion: string;
  color: string;
}

export const TIPOS_CONTACTO: TipoContactoInfo[] = [
  { codigo: 'CD', nombre: 'Contacto Directo', descripcion: 'Se contactó directamente con el titular', color: '#10B981' },
  { codigo: 'CI', nombre: 'Contacto Indirecto', descripcion: 'Se contactó con un tercero', color: '#3B82F6' },
  { codigo: 'PR', nombre: 'Promesa Rota', descripcion: 'Tenía promesa de pago que venció sin cumplir', color: '#EF4444' },
  { codigo: 'NC', nombre: 'No Contactado', descripcion: 'No se ha podido contactar', color: '#6B7280' }
];

export const TIPOS_FILTRO_ESTADO = [
  { codigo: 'ULTIMO_ESTADO', nombre: 'Último Estado', descripcion: 'Usa la última gestión del cliente' },
  { codigo: 'MEJOR_ESTADO_MES', nombre: 'Mejor Estado del Mes', descripcion: 'Usa el mejor estado conseguido en el mes actual' },
  { codigo: 'MEJOR_ESTADO_HISTORICO', nombre: 'Mejor Estado Histórico', descripcion: 'Usa el mejor estado histórico del cliente' }
];

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

export interface FilterableField {
  id: number;
  fieldCode: string;
  fieldName: string;
  dataType: string;
  format?: string;
}

export interface CampaignFilterRange {
  id?: number;
  campaignId?: number;
  fieldDefinitionId: number;
  fieldCode: string;
  fieldName: string;
  minValue?: number;
  maxValue?: number;
  tipoContacto?: TipoContacto; // CD, CI, PR, NC - null = aplica a todos
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
    return this.http.get<CampaignStatistics>(`${environment.gatewayUrl}/admin/campaigns/${id}/statistics`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene el historial de llamadas de una campaña con paginación y búsqueda
   */
  getCampaignCalls(id: number, page: number = 0, size: number = 10, search?: string): Observable<CampaignCallsResponse> {
    let url = `${environment.gatewayUrl}/admin/campaigns/${id}/calls?page=${page}&size=${size}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get<CampaignCallsResponse>(url, { headers: this.getHeaders() });
  }

  // ========================================
  // FILTROS DE CAMPAÑA
  // ========================================

  /**
   * Obtiene los campos numéricos disponibles para filtrar según la subcartera
   */
  getFilterableFieldsBySubcartera(subcarteraId: number): Observable<FilterableField[]> {
    return this.http.get<FilterableField[]>(
      `${this.apiUrl}/filterable-fields/by-subcartera/${subcarteraId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtiene los campos numéricos disponibles para filtrar según la campaña
   */
  getFilterableFields(campaignId: number): Observable<FilterableField[]> {
    return this.http.get<FilterableField[]>(
      `${this.apiUrl}/${campaignId}/filterable-fields`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtiene los filtros actuales de una campaña
   */
  getCampaignFilters(campaignId: number): Observable<CampaignFilterRange[]> {
    return this.http.get<CampaignFilterRange[]>(
      `${this.apiUrl}/${campaignId}/filters`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Guarda filtros para una campaña (reemplaza los existentes)
   */
  saveCampaignFilters(campaignId: number, filters: CampaignFilterRange[]): Observable<CampaignFilterRange[]> {
    return this.http.post<CampaignFilterRange[]>(
      `${this.apiUrl}/${campaignId}/filters`,
      filters,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Elimina todos los filtros de una campaña
   */
  deleteAllFilters(campaignId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${campaignId}/filters`, { headers: this.getHeaders() });
  }
}
