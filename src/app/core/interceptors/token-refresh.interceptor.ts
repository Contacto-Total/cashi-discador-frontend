import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SessionConfigService } from '../services/session-config.service';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const sessionConfig = inject(SessionConfigService);

  // No intentar renovar en las rutas de auth o web-service
  if (req.url.includes('/auth/login') ||
      req.url.includes('/auth/refresh-token') ||
      req.url.includes('/web-service/')) {
    return next(req);
  }

  // Verificar si el token está próximo a expirar y si auto-refresh está habilitado
  if (
    authService.isAuthenticated() &&
    authService.isTokenExpiringSoon() &&
    sessionConfig.isAutoRefreshEnabled() &&
    !isRefreshing
  ) {
    isRefreshing = true;

    return authService.refreshToken().pipe(
      switchMap(() => {
        isRefreshing = false;
        // Reintentar la solicitud original con el nuevo token
        const token = authService.getToken();
        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        return next(req);
      }),
      catchError((error) => {
        isRefreshing = false;
        // Si falla el refresh, cerrar sesión
        authService.logout();
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
