import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, LoginResponse } from '../../models/user.model';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../models/auth.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE = environment.apiUrl;
  private readonly TOKEN_KEY = 'callcenter_token';
  private readonly USER_KEY = 'callcenter_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.storeAuthData(response as any);
        })
      );
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE}/auth/register`, data)
      .pipe(
        tap(response => {
          this.storeAuthData(response as any);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private storeAuthData(response: any): void {
    // El backend devuelve accessToken, nombreUsuario y nombreCompleto
    const token = response.accessToken || response.token || '';
    localStorage.setItem(this.TOKEN_KEY, token);

    // Dividir nombreCompleto en firstName y lastName
    const nameParts = response.nombreCompleto?.split(' ') || ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const user: User = {
      id: response.idUsuario || 0,
      username: response.nombreUsuario || response.username || 'Usuario',
      email: response.email || '',
      firstName: firstName,
      lastName: lastName,
      role: (response.roles?.[0] || response.role || 'AGENT') as any,
      sipExtension: response.extensionSip || '',
      active: true
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);

    console.log('✅ Usuario autenticado:', `${firstName} ${lastName}`.trim() || user.username);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return Math.floor(new Date().getTime() / 1000) >= expiry;
    } catch {
      return true;
    }
  }
}
