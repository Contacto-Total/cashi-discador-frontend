import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
  private baseUrl = `${environment.apiUrl}/v2/whatsapp`;

  getStatus(): Observable<ConnectionStatus> {
    return this.http.get<{ serverConnected: boolean }>(`${this.baseUrl}/accounts/health`).pipe(
      map(resp => ({ status: resp.serverConnected ? 'CONNECTED' : 'DISCONNECTED', hasQR: false }))
    );
  }

  connect(): Observable<QRResponse> {
    return of({ status: 'UNSUPPORTED', qrCode: null });
  }

  getQR(): Observable<QRResponse> {
    return of({ status: 'UNSUPPORTED', qrCode: null });
  }

  verifyPendingPhones(): Observable<BatchResult> {
    return of({ total: 0, withWhatsApp: 0, withoutWhatsApp: 0, results: [] });
  }

  logout(): Observable<LogoutResult> {
    return of({ status: 'UNSUPPORTED' });
  }
}
