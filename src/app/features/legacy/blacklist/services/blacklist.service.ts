import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BlacklistRequest } from '../models/blacklist.request';
import { BlacklistResponse } from '../models/blacklist.response';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService {
  private baseUrl = environment.webServiceUrl + '/blacklist';

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    console.error(`Código de error: ${error.status}, mensaje: ${errorMessage}`);
    return throwError(() => ({ status: error.status, message: errorMessage }));
  }

  insertBlacklist(blacklist: BlacklistRequest): Observable<string> {
    return this.http
      .post(this.baseUrl, blacklist, { ...this.httpOptions, responseType: 'text' })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getAllBlacklist(): Observable<BlacklistResponse[]> {
    return this.http
      .get<BlacklistResponse[]>(this.baseUrl + '/all', this.httpOptions)
      .pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      );
  }
}
