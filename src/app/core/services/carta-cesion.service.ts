import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CartaCesionResponse {
  dni: string;
  filename: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartaCesionService {
  private apiUrl = `${environment.webServiceUrl}/cartas-cesion`;

  constructor(private http: HttpClient) {}

  /**
   * Buscar carta de cesión por DNI
   */
  searchByDni(dni: string): Observable<CartaCesionResponse> {
    return this.http.get<CartaCesionResponse>(`${this.apiUrl}/search`, {
      params: { dni }
    });
  }

  /**
   * Obtener URL para ver el PDF
   */
  getViewUrl(filename: string): string {
    return `${this.apiUrl}/view/${filename}`;
  }

  /**
   * Obtener URL para descargar el PDF
   */
  getDownloadUrl(filename: string): string {
    return `${this.apiUrl}/download/${filename}`;
  }

  /**
   * Descargar PDF como blob
   */
  downloadPdf(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${filename}`, {
      responseType: 'blob'
    });
  }
}
