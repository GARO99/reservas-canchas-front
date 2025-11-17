import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/auth-service.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // si no está autenticado → redirige a login
  return router.createUrlTree(
    ['/auth/login'],
    { queryParams: { returnUrl: state.url } }
  );
};
