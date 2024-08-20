/* eslint-disable max-lines */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '@env/environment';
import {
  IUserLoginRequest,
  IUserRequest,
  IUserResponse,
} from 'app/shared/models/user.models';
import { errorHandler } from '@utils/helpers/errorHandler';
import { jwtTokenAuthHeader } from '@utils/helpers/jwtTokenAuthHeader';

@Injectable({
  providedIn: 'root',
})
export class UserEndpointsService {
  private _httpClient = inject(HttpClient);

  public register(userRequest: IUserRequest): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl + '/api/User/auth/register',
        userRequest
      )
      .pipe(
        tap({
          next: () => {
            console.log('User registered successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          errorHandler(error);
          return throwError(() => error);
        })
      );
  }

  public login(userLoginRequest: IUserLoginRequest): Observable<string> {
    return this._httpClient
      .post<string>(
        environment.backendApiUrl + '/api/User/auth/login',
        userLoginRequest,
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('User logged in successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(JSON.parse(error.error)['description']);
          return throwError(() => error);
        })
      );
  }

  public resendConfirmationEmail(email: string): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl + '/api/User/auth/resend-confirmation-email',
        { email }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Confirmation email resend successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          errorHandler(error);
          return throwError(() => error);
        })
      );
  }

  public confirmAccount(token: string): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl + '/api/User/auth/confirm-account',
        { token }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Account confirmed successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          errorHandler(error);
          return throwError(() => error);
        })
      );
  }

  public requestPasswordReset(email: string): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl + '/api/User/auth/request-password-reset',
        { email }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Password reset requested successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          errorHandler(error);
          return throwError(() => error);
        })
      );
  }

  public resetPassword(
    tokenValue: string,
    newPassword: string
  ): Observable<void> {
    return this._httpClient
      .post<void>(environment.backendApiUrl + '/api/User/auth/reset-password', {
        tokenValue,
        newPassword,
      })
      .pipe(
        tap({
          next: () => {
            console.log('Password reseted successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          errorHandler(error);
          return throwError(() => error);
        })
      );
  }

  public logout(): Observable<void> {
    return this._httpClient
      .post<void>(environment.backendApiUrl + '/api/User/auth/logout', {
        headers: jwtTokenAuthHeader,
      })
      .pipe(
        tap({
          next: () => {
            console.log('Logout successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          errorHandler(error);
          return throwError(() => error);
        })
      );
  }

  public me(): Observable<IUserResponse> {
    return this._httpClient
      .get<IUserResponse>(environment.backendApiUrl + '/api/User/auth/me', {
        responseType: 'json',
        headers: jwtTokenAuthHeader,
      })
      .pipe(
        tap({
          next: () => {
            console.log('User data retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          errorHandler(error);
          return throwError(() => error);
        })
      );
  }

  public changePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl + '/api/User/auth/change-password',
        { oldPassword, newPassword },
        {
          headers: jwtTokenAuthHeader,
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Password changed successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          errorHandler(error);
          return throwError(() => error);
        })
      );
  }

  public deleteAccount(): Observable<void> {
    return this._httpClient
      .delete<void>(
        environment.backendApiUrl + '/api/User/auth/delete-account',
        {
          headers: jwtTokenAuthHeader,
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Account deleted successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          errorHandler(error);
          return throwError(() => error);
        })
      );
  }
}
