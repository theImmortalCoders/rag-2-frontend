import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { IUserEditRequest, IUserRequest } from 'app/shared/models/user.models';
import { errorHandler } from '@utils/helpers/errorHandler';
import { getAuthHeaders } from '@utils/helpers/jwtTokenAuthHeader';

@Injectable({
  providedIn: 'root',
})
export class UserEndpointsService {
  private _httpClient = inject(HttpClient);

  public register(userRequest: IUserRequest): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl + '/api/User/register',
        userRequest,
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('User registered successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public resendConfirmationEmail(email: string): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl +
          `/api/User/resend-confirmation-email?email=${email}`,
        {},
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Confirmation email resend successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public confirmAccount(token: string): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl + `/api/User/confirm-account?token=${token}`,
        {},
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Account confirmed successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public updateAccountInfo(
    editAccountData: IUserEditRequest
  ): Observable<void> {
    return this._httpClient
      .patch<void>(
        environment.backendApiUrl + `/api/User/update`,
        editAccountData,
        {
          headers: getAuthHeaders(),
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('User account data updated successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public requestPasswordReset(email: string): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl +
          `/api/User/request-password-reset?email=${email}`,
        {},
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Password reset requested successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public resetPassword(
    tokenValue: string,
    newPassword: string
  ): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl +
          `/api/User/reset-password?tokenValue=${tokenValue}&newPassword=${newPassword}`,
        {},
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Password reseted successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public changePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl +
          `/api/User/change-password?oldPassword=${oldPassword}&newPassword=${newPassword}`,
        {},
        {
          headers: getAuthHeaders(),
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Password changed successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public deleteAccount(): Observable<void> {
    return this._httpClient
      .delete<void>(environment.backendApiUrl + '/api/User/delete-account', {
        headers: getAuthHeaders(),
        responseType: 'text' as 'json',
      })
      .pipe(
        tap({
          next: () => {
            localStorage.removeItem('jwtToken');
            console.log('Account deleted successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }
}
