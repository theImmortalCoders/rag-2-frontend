import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from 'app/shared/services/authentication.service';
import { map, take } from 'rxjs/operators';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.authStatus$.pipe(
    take(1), // funkcja bierze tylko 1 wartość i się kończy
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return true;
      }
      return router.parseUrl('/');
    })
  );
};
