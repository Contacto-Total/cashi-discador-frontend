import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // X-Agent-Id: identidad del agente para el backend WhatsApp v2 (chats, send,
  // viewers). Se limita a esa API a propósito: mandarlo a todos los backends
  // obligaría a un preflight CORS que los demás no tienen permitido.
  const agentId = authService.getCurrentUser()?.id;
  if (agentId && req.url.includes('/v2/whatsapp')) {
    headers['X-Agent-Id'] = String(agentId);
  }

  if (Object.keys(headers).length > 0) {
    req = req.clone({ setHeaders: headers });
  }

  return next(req).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        console.error('[INTERCEPTOR] Error 401 en:', req.url);
        console.error('[INTERCEPTOR] Haciendo logout automático');
        authService.logout();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
