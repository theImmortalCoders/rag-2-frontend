import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Observable, catchError, throwError, switchMap } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private _userEndpointsService = inject(UserEndpointsService);
  private _notificationService = inject(NotificationService);

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = this.addTokenHeader(request);

    if (request.url.includes('refresh-token')) {
      return next.handle(request).pipe(
        catchError(errordata => {
          this._notificationService.addNotification(
            'Refresh failed, log in again. ',
            5000
          );

          this._userEndpointsService.logout();
          return throwError(() => errordata);
        })
      );
    }

    return next.handle(request).pipe(
      catchError(errordata => {
        if (errordata.status === 401) {
          return this.handleRefreshToken(request, next);
        }
        return throwError(() => errordata);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
    return request.clone({
      headers: request.headers.set(
        'Authorization',
        'Bearer ' + localStorage.getItem('jwtToken')
      ),
      withCredentials: true,
    });
  }

  private handleRefreshToken(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this._userEndpointsService.refreshToken().pipe(
      switchMap((token: string) => {
        localStorage.setItem('jwtToken', token);
        return next.handle(this.addTokenHeader(request));
      }),
      catchError(errordata => {
        if (request.headers.has('skip')) {
          return next.handle(request);
        }
        return throwError(() => errordata);
      })
    );
  }
}
