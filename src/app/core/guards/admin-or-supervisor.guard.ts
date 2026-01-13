import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const adminOrSupervisorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[GUARD] adminOrSupervisorGuard - Verificando acceso a:', state.url);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    console.log('[GUARD] Usuario NO autenticado, redirigiendo a login');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if user has ADMIN or SUPERVISOR role
  const currentUser = authService.getCurrentUser();
  console.log('[GUARD] Usuario actual:', currentUser);
  console.log('[GUARD] Rol del usuario:', currentUser?.role);

  if (currentUser && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPERVISOR)) {
    console.log('[GUARD] Acceso PERMITIDO');
    return true;
  }

  // User is authenticated but doesn't have required role
  console.log('[GUARD] Acceso DENEGADO - Rol no permitido, redirigiendo a agent-dashboard');
  router.navigate(['/agent-dashboard']);
  return false;
};
