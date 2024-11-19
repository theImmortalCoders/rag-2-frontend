import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const userIdGuard: CanActivateFn = route => {
  const adminEndpointsService = inject(AdministrationEndpointsService);
  const router = inject(Router);

  const userId = route.params['id'];

  return adminEndpointsService.getUserDetails(userId).pipe(
    map(response => {
      if (response) {
        return true;
      }
      return router.parseUrl('/');
    }),
    catchError(() => of(router.parseUrl('/')))
  );
};
