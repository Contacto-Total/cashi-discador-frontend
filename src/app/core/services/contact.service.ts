import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contact, ImportResult } from '../models/contact.model';
import { ClienteDetalle } from '../models/cliente-detalle.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  getAllContacts(filters?: {
    campaignId?: number;
    status?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Observable<Contact[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.campaignId) params = params.set('campaignId', filters.campaignId.toString());
      if (filters.status) params = params.set('status', filters.status);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.size) params = params.set('size', filters.size.toString());
    }

    return this.http.get<Contact[]>(this.apiUrl, { params });
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  updateContact(id: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getContactsByCampaign(campaignId: number, page?: number, size?: number): Observable<Contact[]> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<Contact[]>(`${this.apiUrl}/campaign/${campaignId}`, { params });
  }

  importContacts(campaignId: number, file: File, mapping: any): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('campaignId', campaignId.toString());
    formData.append('mapping', JSON.stringify(mapping));

    return this.http.post<ImportResult>(`${this.apiUrl}/import`, formData);
  }

  getNextContact(campaignId: number, agentId: number): Observable<Contact | null> {
    return this.http.get<Contact | null>(
      `${this.apiUrl}/next?campaignId=${campaignId}&agentId=${agentId}`
    );
  }

  /**
   * Obtiene la llamada activa de un agente desde el auto-dialer (por ID de agente)
   */
  getActiveCall(agentId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/autodialer/active-call/${agentId}`);
  }

  /**
   * Obtiene la llamada activa de un agente por su extensión SIP
   */
  getActiveCallByExtension(sipExtension: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/autodialer/active-call/extension/${sipExtension}`);
  }

  /**
   * Obtiene los datos completos del cliente para la pantalla de tipificación
   */
  getClienteDetalle(contactId: number): Observable<ClienteDetalle> {
    return this.http.get<ClienteDetalle>(`${this.apiUrl}/${contactId}/cliente-detalle`);
  }
}
