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
  private proactiveRefreshTimer: any;
  private isLoggingOut = false;
  private isRefreshing = false;

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

    // Programar renovación proactiva si ya hay token
    this.scheduleProactiveRefresh();
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

        // Si el token expiró, intentar refresh antes de hacer logout
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
    if (this.isLoggingOut || this.isRefreshing) return;

    console.log('[AUTH] Token expirado, intentando refresh...');

    // Intentar refresh antes de hacer logout
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.refreshWithRetry(3).subscribe({
        next: () => {
          console.log('[AUTH] Token renovado exitosamente después de expiración');
          this.scheduleProactiveRefresh();
        },
        error: () => {
          console.log('[AUTH] No se pudo renovar token, cerrando sesión');
          this.isLoggingOut = true;
          alert('Tu sesión ha expirado');
          this.logout();
          this.isLoggingOut = false;
        }
      });
    } else {
      this.isLoggingOut = true;
      alert('Tu sesión ha expirado');
      this.logout();
      this.isLoggingOut = false;
    }
  }

  /**
   * Programa renovación proactiva del token.
   * Se ejecuta 10 minutos antes de que expire, sin necesidad de actividad HTTP.
   */
  private scheduleProactiveRefresh(): void {
    // Limpiar timer anterior
    if (this.proactiveRefreshTimer) {
      clearTimeout(this.proactiveRefreshTimer);
      this.proactiveRefreshTimer = null;
    }

    const token = this.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const now = Date.now();
      // Renovar 10 minutos antes de que expire
      const refreshAt = expiry - (10 * 60 * 1000);
      const delay = refreshAt - now;

      if (delay <= 0) {
        // Ya debería haberse renovado, hacerlo ahora
        console.log('[AUTH] Token próximo a expirar, renovando ahora...');
        this.doProactiveRefresh();
        return;
      }

      console.log(`[AUTH] Renovación proactiva programada en ${Math.round(delay / 60000)} minutos`);

      this.ngZone.runOutsideAngular(() => {
        this.proactiveRefreshTimer = setTimeout(() => {
          this.ngZone.run(() => {
            this.doProactiveRefresh();
          });
        }, delay);
      });
    } catch (e) {
      console.error('[AUTH] Error programando renovación proactiva:', e);
    }
  }

  /**
   * Ejecuta la renovación proactiva con reintentos
   */
  private doProactiveRefresh(): void {
    if (this.isRefreshing || this.isLoggingOut) return;
    if (!this.isAuthenticated() && !this.getRefreshToken()) return;

    console.log('[AUTH] Ejecutando renovación proactiva del token...');

    this.refreshWithRetry(3).subscribe({
      next: () => {
        console.log('[AUTH] Renovación proactiva exitosa');
        // Programar la siguiente renovación
        this.scheduleProactiveRefresh();
      },
      error: (err) => {
        console.error('[AUTH] Renovación proactiva falló después de 3 intentos:', err);
        // Reprogramar un reintento en 1 minuto
        this.ngZone.runOutsideAngular(() => {
          this.proactiveRefreshTimer = setTimeout(() => {
            this.ngZone.run(() => {
              this.doProactiveRefresh();
            });
          }, 60000);
        });
      }
    });
  }

  /**
   * Intenta renovar el token con reintentos y backoff exponencial.
   * Intento 1: inmediato, Intento 2: 2s, Intento 3: 4s
   */
  private refreshWithRetry(maxRetries: number, attempt: number = 1): Observable<LoginResponse> {
    this.isRefreshing = true;

    return new Observable<LoginResponse>(subscriber => {
      this.refreshToken().subscribe({
        next: (response) => {
          this.isRefreshing = false;
          subscriber.next(response);
          subscriber.complete();
        },
        error: (error) => {
          if (attempt < maxRetries) {
            const backoffMs = Math.pow(2, attempt) * 1000; // 2s, 4s
            console.warn(`[AUTH] Refresh intento ${attempt}/${maxRetries} falló, reintentando en ${backoffMs}ms...`);
            setTimeout(() => {
              this.refreshWithRetry(maxRetries, attempt + 1).subscribe({
                next: (res) => { subscriber.next(res); subscriber.complete(); },
                error: (err) => { subscriber.error(err); }
              });
            }, backoffMs);
          } else {
            console.error(`[AUTH] Refresh falló después de ${maxRetries} intentos`);
            this.isRefreshing = false;
            subscriber.error(error);
          }
        }
      });
    });
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
          role: this.mapRoleToBase(response.roles?.[0]) as UserRole,
          sipExtension: response.extensionSip,
          sipPassword: response.sipPassword,
          active: true,
          tenantId: response.tenantId,
          portfolioId: response.portfolioId,
          subPortfolioId: response.subPortfolioId
        };

        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);

        // Programar renovación proactiva del nuevo token
        this.scheduleProactiveRefresh();
      })
    );
  }

  logout(): void {
    // Limpiar el intervalo de verificación para evitar múltiples alertas
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }

    // Limpiar timer de renovación proactiva
    if (this.proactiveRefreshTimer) {
      clearTimeout(this.proactiveRefreshTimer);
      this.proactiveRefreshTimer = null;
    }

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);

    // Reiniciar verificación de token después de logout
    this.startTokenCheck();
  }

  /**
   * Maps non-standard roles to base roles (ADMIN, SUPERVISOR, AGENT).
   * Any role not matching ADMIN or SUPERVISOR is treated as AGENT.
   */
  private mapRoleToBase(role?: string): string {
    if (!role) return 'AGENT';
    const upper = role.toUpperCase();
    if (upper === 'ADMIN') return 'ADMIN';
    if (upper.includes('SUPERVISOR') || upper === 'COORDINADOR') return 'SUPERVISOR';
    return 'AGENT';
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
