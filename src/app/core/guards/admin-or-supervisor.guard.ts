import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const adminOrSupervisorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if user has ADMIN or SUPERVISOR role
  const currentUser = authService.getCurrentUser();
  if (currentUser && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPERVISOR)) {
    return true;
  }

  // User is authenticated but doesn't have required role
  router.navigate(['/agent-dashboard']);
  return false;
};
