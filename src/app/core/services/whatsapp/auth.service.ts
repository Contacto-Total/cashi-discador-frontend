import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../../models/auth.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE = environment.apiUrl;
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'user_data';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_BASE}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('🔍 Respuesta del backend:', response);
          console.log('🔍 accessToken:', response.accessToken);
          console.log('🔍 nombreUsuario:', response.nombreUsuario);
          console.log('🔍 nombreCompleto:', response.nombreCompleto);
          console.log('🔍 roles:', response.roles);
          this.storeAuthData(response);
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_BASE}/auth/register`, data)
      .pipe(
        tap(response => {
          this.storeAuthData(response);
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

  private storeAuthData(response: AuthResponse): void {
    // El backend devuelve accessToken, nombreUsuario y nombreCompleto
    const token = response.accessToken || response.token || '';
    localStorage.setItem(this.TOKEN_KEY, token);

    const user: User = {
      username: response.nombreUsuario || response.username || 'Usuario',
      fullName: response.nombreCompleto || response.nombreUsuario || 'Usuario',
      role: response.roles?.[0] || response.role || 'AGENT'
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);

    console.log('✅ Usuario autenticado:', user.fullName || user.username);
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
