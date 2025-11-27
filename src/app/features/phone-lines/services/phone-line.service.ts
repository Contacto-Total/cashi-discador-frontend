import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhoneLineRequest } from '../models/phone-line.request';
import { PhoneLineResponse } from '../models/phone-line.response';
import { environment } from '../../../../environments/environment';

// Batch process response interfaces
export interface BatchProcessResponse {
  batchId: string;
  status: string;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  skippedRecords: number;
  startTime: string;
  endTime: string;
  message: string;
}

// WhatsApp response interfaces
export interface WhatsAppConnectionStatus {
  status: string;
  hasQR: boolean;
  progress?: {
    total: number;
    processed: number;
    withWhatsApp: number;
  };
}

export interface WhatsAppQRResponse {
  status: string;
  qrCode: string;
}

export interface WhatsAppVerificationResult {
  phoneNumber: string;
  formattedNumber: string;
  hasWhatsApp: boolean;
  jid: string;
  error?: string;
}

export interface WhatsAppBatchResult {
  total: number;
  withWhatsApp: number;
  withoutWhatsApp: number;
  results: WhatsAppVerificationResult[];
  error?: string;
}

export interface WhatsAppLogoutResult {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhoneLineService {
  private readonly baseUrl = environment.gatewayUrl || 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  // ========================================
  // Single Document Query
  // ========================================
  queryPhoneLines(request: PhoneLineRequest): Observable<PhoneLineResponse> {
    return this.http.post<PhoneLineResponse>(
      `${this.baseUrl}/api/v1/phone-lines/query`,
      request
    );
  }

  queryPhoneLinesForceRefresh(request: PhoneLineRequest): Observable<PhoneLineResponse> {
    return this.http.post<PhoneLineResponse>(
      `${this.baseUrl}/api/v1/phone-lines/query/refresh`,
      request
    );
  }

  queryPhoneLinesByDocument(documentNumber: string): Observable<PhoneLineResponse> {
    return this.http.get<PhoneLineResponse>(
      `${this.baseUrl}/api/v1/phone-lines/query/${documentNumber}`
    );
  }

  // ========================================
  // Batch Processing (OSIPTEL)
  // ========================================
  startBatch(skipWhatsApp: boolean = false): Observable<BatchProcessResponse> {
    return this.http.post<BatchProcessResponse>(
      `${this.baseUrl}/api/batch/phone-lines/start?skipWhatsApp=${skipWhatsApp}`,
      {}
    );
  }

  getBatchStatus(batchId: string): Observable<BatchProcessResponse> {
    return this.http.get<BatchProcessResponse>(
      `${this.baseUrl}/api/batch/phone-lines/status/${batchId}`
    );
  }

  isBatchRunning(): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/api/batch/phone-lines/running`
    );
  }

  stopBatch(batchId: string): Observable<BatchProcessResponse> {
    return this.http.post<BatchProcessResponse>(
      `${this.baseUrl}/api/batch/phone-lines/stop/${batchId}`,
      {}
    );
  }

  resetStuckBatches(): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/api/batch/phone-lines/reset`,
      {},
      { responseType: 'text' }
    );
  }

  // ========================================
  // WhatsApp Verification
  // ========================================
  getWhatsAppStatus(): Observable<WhatsAppConnectionStatus> {
    return this.http.get<WhatsAppConnectionStatus>(
      `${this.baseUrl}/api/v1/whatsapp/status`
    );
  }

  connectWhatsApp(): Observable<WhatsAppQRResponse> {
    return this.http.post<WhatsAppQRResponse>(
      `${this.baseUrl}/api/v1/whatsapp/connect`,
      {}
    );
  }

  getWhatsAppQR(): Observable<WhatsAppQRResponse> {
    return this.http.get<WhatsAppQRResponse>(
      `${this.baseUrl}/api/v1/whatsapp/qr`
    );
  }

  verifyPendingPhones(): Observable<WhatsAppBatchResult> {
    return this.http.post<WhatsAppBatchResult>(
      `${this.baseUrl}/api/v1/whatsapp/verify`,
      {}
    );
  }

  logoutWhatsApp(): Observable<WhatsAppLogoutResult> {
    return this.http.post<WhatsAppLogoutResult>(
      `${this.baseUrl}/api/v1/whatsapp/logout`,
      {}
    );
  }
}
