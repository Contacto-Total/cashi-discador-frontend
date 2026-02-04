import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campaign, CampaignStatistics } from '../models/campaign.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private readonly apiUrl = `${environment.apiUrl}/campaigns`;

  constructor(private http: HttpClient) {}

  getAllCampaigns(page?: number, size?: number): Observable<Campaign[]> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<Campaign[]>(this.apiUrl, { params });
  }

  getCampaignById(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.apiUrl}/${id}`);
  }

  createCampaign(campaign: Campaign): Observable<Campaign> {
    return this.http.post<Campaign>(this.apiUrl, campaign);
  }

  updateCampaign(id: number, campaign: Campaign): Observable<Campaign> {
    return this.http.put<Campaign>(`${this.apiUrl}/${id}`, campaign);
  }

  deleteCampaign(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  startCampaign(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/${id}/start`, {});
  }

  pauseCampaign(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/${id}/pause`, {});
  }

  stopCampaign(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/${id}/stop`, {});
  }

  startDialing(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/${id}/start-dialing`, {});
  }

  stopDialing(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/${id}/stop-dialing`, {});
  }

  getCampaignStatistics(id: number): Observable<CampaignStatistics> {
    return this.http.get<CampaignStatistics>(`${this.apiUrl}/${id}/statistics`);
  }

  getActiveCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/active`);
  }

  /**
   * Verifica si hay una campaña discando para la subcartera del agente
   * @param subPortfolioId ID de la subcartera
   * @returns { discando: boolean, nombreCampana?: string, idCampana?: number }
   */
  getDiscandoStatus(subPortfolioId: number): Observable<{ discando: boolean; nombreCampana?: string; idCampana?: number }> {
    return this.http.get<{ discando: boolean; nombreCampana?: string; idCampana?: number }>(
      `${this.apiUrl}/discando-status/${subPortfolioId}`
    );
  }
}
