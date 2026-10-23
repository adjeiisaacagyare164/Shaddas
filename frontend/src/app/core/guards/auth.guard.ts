import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.ready.then(() => {
    if (authService.isAuthenticated()) {
      return true;
    }

    return router.createUrlTree(['/owner/login'], {
      queryParams: { returnUrl: state.url }
    });
  }).catch(() => router.createUrlTree(['/owner/login'], {
    queryParams: { returnUrl: state.url }
  }));
};
