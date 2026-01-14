import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[AUTH-GUARD] ========================================');
  console.log('[AUTH-GUARD] Verificando acceso a:', state.url);
  console.log('[AUTH-GUARD] Token existe:', !!authService.getToken());
  console.log('[AUTH-GUARD] isAuthenticated:', authService.isAuthenticated());
  console.log('[AUTH-GUARD] Usuario actual:', authService.getCurrentUser());

  if (authService.isAuthenticated()) {
    console.log('[AUTH-GUARD] ✅ ACCESO PERMITIDO');
    return true;
  }

  console.log('[AUTH-GUARD] ❌ NO AUTENTICADO - Redirigiendo a /login');
  // Redirect to login page with return url
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
