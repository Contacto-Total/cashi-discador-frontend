import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const adminOrOperacionesGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if user has ADMIN or an OPERACIONES role (e.g. "OPERACIONES TRAMO 5")
  const currentUser = authService.getCurrentUser();
  const esOperaciones = (currentUser?.roles ?? []).some(rol => rol.toUpperCase().includes('OPERACIONES'));
  if (currentUser && (currentUser.role === UserRole.ADMIN || esOperaciones)) {
    return true;
  }

  // User is authenticated but doesn't have required role
  router.navigate(['/agent-dashboard']);
  return false;
};
