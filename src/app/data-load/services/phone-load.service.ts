import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PhoneRow {
  rowNumber: number;
  documento: string;
  telefono: string;
  fechaActivacion?: string; // "YYYY-MM-DD" o vacío
  operador?: string;
}

export interface PhoneBulkImportRequest {
  idInquilino: number;
  idCartera: number;
  idSubcartera: number;
  rows: PhoneRow[];
}

export interface RowError {
  rowNumber: number;
  documento: string;
  telefono: string;
  reason: string;
}

export interface RowSkipped {
  rowNumber: number;
  documento: string;
  telefono: string;
}

export interface RowUpdated {
  rowNumber: number;
  documento: string;
  telefono: string;
}

export interface PhoneBulkImportResult {
  totalRows: number;
  insertedCount: number;
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
  rowErrors: RowError[];
  rowSkipped: RowSkipped[];
  rowUpdated: RowUpdated[];
}

@Injectable({ providedIn: 'root' })
export class PhoneLoadService {
  private apiUrl = `${environment.apiUrl}/contacts/bulk-phone-import`;

  constructor(private http: HttpClient) {}

  importPhones(req: PhoneBulkImportRequest): Observable<PhoneBulkImportResult> {
    return this.http.post<PhoneBulkImportResult>(this.apiUrl, req);
  }
}
