import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ConnectionStatus {
  status: string;
  hasQR: boolean;
  progress?: {
    total: number;
    processed: number;
    withWhatsApp: number;
  };
}

export interface QRResponse {
  status: string;
  qrCode: string | null;
}

export interface BatchResult {
  total: number;
  withWhatsApp: number;
  withoutWhatsApp: number;
  results?: VerificationResult[];
  error?: string;
}

export interface VerificationResult {
  phoneNumber: string;
  formattedNumber: string;
  hasWhatsApp: boolean;
  jid?: string;
  error?: string;
}

export interface LogoutResult {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {
  private http = inject(HttpClient);
  private baseUrl = (environment as any).scraperServiceUrl || 'http://localhost:8090';

  getStatus(): Observable<ConnectionStatus> {
    return this.http.get<ConnectionStatus>(`${this.baseUrl}/api/v1/whatsapp/status`);
  }

  connect(): Observable<QRResponse> {
    return this.http.post<QRResponse>(`${this.baseUrl}/api/v1/whatsapp/connect`, {});
  }

  getQR(): Observable<QRResponse> {
    return this.http.get<QRResponse>(`${this.baseUrl}/api/v1/whatsapp/qr`);
  }

  verifyPendingPhones(): Observable<BatchResult> {
    return this.http.post<BatchResult>(`${this.baseUrl}/api/v1/whatsapp/verify`, {});
  }

  logout(): Observable<LogoutResult> {
    return this.http.post<LogoutResult>(`${this.baseUrl}/api/v1/whatsapp/logout`, {});
  }
}
