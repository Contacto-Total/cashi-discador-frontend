import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {User, LoginRequest, LoginResponse, UserRole} from '../models/user.model';

export interface RolResponse {
  idRol: number;
  nombreRol: string;
  descripcion: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'callcenter_token';
  private readonly USER_KEY = 'callcenter_user';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private tokenCheckInterval: any;
  private isLoggingOut = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    let user: User | null = null;
    try {
      const storedUser = localStorage.getItem(this.USER_KEY);
      if (storedUser && storedUser !== 'undefined') {
        user = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error('Error parsing stored user', e);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();

    // Escuchar cambios en localStorage (desde otras pestañas)
    window.addEventListener('storage', (event) => {
      if (event.key === this.TOKEN_KEY && !event.newValue) {
        this.ngZone.run(() => {
          this.handleTokenRemoved();
        });
      }
    });

    // Verificar periódicamente el estado del token (cada 5 segundos)
    this.startTokenCheck();
  }

  private startTokenCheck(): void {
    this.ngZone.runOutsideAngular(() => {
      this.tokenCheckInterval = setInterval(() => {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const currentUser = this.currentUserSubject.value;

        // Si hay usuario en memoria pero no hay token, redirigir
        if (currentUser && !token) {
          this.ngZone.run(() => {
            this.handleTokenRemoved();
          });
        }

        // Si el token expiró, redirigir
        if (token && !this.isAuthenticated()) {
          this.ngZone.run(() => {
            this.handleTokenExpired();
          });
        }
      }, 5000);
    });
  }

  private handleTokenRemoved(): void {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;

    console.log('[AUTH] Token eliminado del localStorage');
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('refresh_token');

    if (this.router.url !== '/login') {
      alert('Tu sesión ha finalizado');
      this.router.navigate(['/login']).then(() => {
        this.isLoggingOut = false;
      });
    } else {
      this.isLoggingOut = false;
    }
  }

  private handleTokenExpired(): void {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;

    console.log('[AUTH] Token expirado');
    alert('Tu sesión ha expirado');
    this.logout();
    this.isLoggingOut = false;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    // Mapear parámetros (inglés) a request del backend (español)
    const request: LoginRequest = {
      nombreUsuario: username,
      contrasena: password
    };
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(response => {
        // Guardar access token y refresh token
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        localStorage.setItem('refresh_token', response.refreshToken);

        // Dividir nombreCompleto en firstName y lastName
        const nameParts = response.nombreCompleto?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Mapear respuesta del backend (español) al modelo User (inglés)
        const user: User = {
          id: response.idUsuario,
          username: response.nombreUsuario,
          email: response.email,
          firstName: firstName,
          lastName: lastName,
          role: (response.roles?.[0] || 'AGENT') as UserRole,
          sipExtension: response.extensionSip,
          sipPassword: response.sipPassword,
          active: true,
          tenantId: response.tenantId,
          portfolioId: response.portfolioId,
          subPortfolioId: response.subPortfolioId
        };

        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    // Limpiar el intervalo de verificación para evitar múltiples alertas
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);

    // Reiniciar verificación de token después de logout
    this.startTokenCheck();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() < expiry;
    } catch (e) {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh-token`, {
      refreshToken: refreshToken
    }).pipe(
      tap(response => {
        // Actualizar access token
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        // El refresh token no cambia, pero si viene uno nuevo, actualizarlo
        if (response.refreshToken) {
          localStorage.setItem('refresh_token', response.refreshToken);
        }
      })
    );
  }

  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const now = Date.now();
      // Renovar si falta menos de 5 minutos para expirar
      const fiveMinutes = 5 * 60 * 1000;
      return (expiry - now) < fiveMinutes && expiry > now;
    } catch (e) {
      return false;
    }
  }

  /**
   * Obtiene todos los roles disponibles desde el auth backend
   */
  getRoles(): Observable<RolResponse[]> {
    return this.http.get<RolResponse[]>(`${environment.apiUrl}/roles`);
  }
}
