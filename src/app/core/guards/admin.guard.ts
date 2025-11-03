import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if user has ADMIN role
  const currentUser = authService.getCurrentUser();
  if (currentUser && currentUser.role === UserRole.ADMIN) {
    return true;
  }

  // User is authenticated but doesn't have ADMIN role
  // Redirect to a forbidden or dashboard page
  router.navigate(['/agent-dashboard']);
  return false;
};
