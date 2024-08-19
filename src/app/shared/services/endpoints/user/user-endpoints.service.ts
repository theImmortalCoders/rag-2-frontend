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
          if (error.status === 400) {
            console.error('User already exists or wrong study cycle year');
          } else {
            console.error(`Unexpected error: ${error.message}`);
          }
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
          withCredentials: true,
          // headers: {
          //   Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),

          // },
        }
      )
      .pipe(
        tap({
          next: (response: string) => {
            console.log('User logged in successfully:', response);
          },
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error(
              'Invalid password or mail not confirmed or user banned'
            );
          } else {
            console.error(`Unexpected error: ${error.message}`);
          }
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
          if (error.status === 400) {
            console.error('User is already confirmed');
          } else {
            console.error(`Unexpected error: ${error.message}`);
          }
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
          if (error.status === 400) {
            console.error('Invalid token');
          } else {
            console.error(`Unexpected error: ${error.message}`);
          }
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
          console.error(`Unexpected error: ${error.message}`);
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
          if (error.status === 400) {
            console.error('Invalid token');
          } else {
            console.error(`Unexpected error: ${error.message}`);
          }
          return throwError(() => error);
        })
      );
  }

  public logout(): Observable<void> {
    return this._httpClient
      .post<void>(environment.backendApiUrl + '/api/User/auth/logout', {})
      .pipe(
        tap({
          next: () => {
            console.log('Logout successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized, you have to be logged in');
          } else {
            console.error(`Unexpected error: ${error.message}`);
          }
          return throwError(() => error);
        })
      );
  }

  public me(): Observable<IUserResponse> {
    return this._httpClient
      .get<IUserResponse>(environment.backendApiUrl + '/api/User/auth/me', {
        responseType: 'json',
      })
      .pipe(
        tap({
          next: () => {
            console.log('User data retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized, you have to be logged in.');
          } else {
            console.error(`Unexpected error: ${error.message}`);
          }
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
        { oldPassword, newPassword }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Password changed successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            console.error(
              'Invalid old password or given the same password as old'
            );
          } else if (error.status === 401) {
            console.error('Unauthorized, you have to be logged in');
          } else {
            console.error(`Unexpected error: ${error.message}`);
          }
          return throwError(() => error);
        })
      );
  }

  public deleteAccount(): Observable<void> {
    return this._httpClient
      .delete<void>(environment.backendApiUrl + '/api/User/auth/delete-account')
      .pipe(
        tap({
          next: () => {
            console.log('Account deleted successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized, you have to be logged in.');
          } else {
            console.error(`Unexpected error: ${error.message}`);
          }
          return throwError(() => error);
        })
      );
  }
}
