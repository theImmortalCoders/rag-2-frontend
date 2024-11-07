import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const userEndpointsService = inject(UserEndpointsService);
  const router = inject(Router);

  return userEndpointsService.verifyJWTToken().pipe(
    map(response => {
      if (response) {
        return true;
      }
      return router.parseUrl('/');
    }),
    catchError(() => of(router.parseUrl('/')))
  );
};
