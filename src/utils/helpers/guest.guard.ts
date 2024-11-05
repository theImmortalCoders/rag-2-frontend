import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const guestGuard: CanActivateFn = () => {
  const userEndpointsService = inject(UserEndpointsService);
  const router = inject(Router);

  return userEndpointsService.getMe().pipe(
    map(response => {
      if (response) {
        return router.parseUrl('/');
      }
      return true;
    }),
    catchError(() => of(true))
  );
};
