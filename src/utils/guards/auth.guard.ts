import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthEndpointsService } from '@endpoints/auth-endpoints.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authEndpointsService = inject(AuthEndpointsService);
  const router = inject(Router);

  return authEndpointsService.verifyJWTToken().pipe(
    map(response => {
      if (response) {
        return true;
      }
      return router.parseUrl('/');
    }),
    catchError(() => of(router.parseUrl('/')))
  );
};
