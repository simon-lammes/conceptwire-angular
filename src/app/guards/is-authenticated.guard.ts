import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated$.pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        return router.createUrlTree(['/auth']);
      }
    }),
  );
};
