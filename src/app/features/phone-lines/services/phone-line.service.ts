import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhoneLineRequest } from '../models/phone-line.request';
import { PhoneLineResponse } from '../models/phone-line.response';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhoneLineService {
  private readonly baseUrl = environment.scraperServiceUrl || 'http://localhost:8090';

  constructor(private http: HttpClient) {}

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
}
