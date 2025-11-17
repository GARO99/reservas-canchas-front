import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/auth-service.service';

export const adminGuard: CanActivateFn = (state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated() && auth.isAdmin()) {
    return true;
  }

  // si no es admin, mandamos a login con returnUrl
  return router.createUrlTree(
    ['/auth/login'],
    { queryParams: { returnUrl: state.url } }
  );
};
