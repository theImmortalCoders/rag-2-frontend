import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { errorHandler } from '@utils/helpers/errorHandler';
import { getAuthHeaders } from '@utils/helpers/jwtTokenAuthHeader';
import {
  IUserLoginRequest,
  IUserResponse,
} from 'app/shared/models/user.models';
import { Observable, map, catchError, of, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthEndpointsService {
  private _httpClient = inject(HttpClient);

  public verifyJWTToken(): Observable<boolean> {
    return this._httpClient
      .get<void>(environment.backendApiUrl + '/api/Auth/verify', {
        responseType: 'json',
      })
      .pipe(
        map(() => {
          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return of(false);
          }
          return throwError(() => error);
        })
      );
  }

  public login(userLoginRequest: IUserLoginRequest): Observable<string> {
    return this._httpClient
      .post<string>(
        environment.backendApiUrl + '/api/Auth/login',
        userLoginRequest,
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: (response: string) => {
            localStorage.setItem('jwtToken', response);
            console.log('User logged in successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = JSON.parse(error.error)['description'];
          console.error(errorMessage);
          return throwError(() => errorMessage);
        })
      );
  }

  public refreshToken(): Observable<string> {
    return this._httpClient
      .post<string>(
        environment.backendApiUrl + `/api/Auth/refresh-token`,
        {},
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Token refreshed successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public logout(): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl + '/api/Auth/logout',
        {},
        {
          headers: getAuthHeaders(),
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Logout successfully');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('errorCounter');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public getMe(): Observable<IUserResponse> {
    return this._httpClient
      .get<IUserResponse>(environment.backendApiUrl + '/api/Auth/me', {
        responseType: 'json',
        headers: getAuthHeaders(),
      })
      .pipe(
        tap({
          next: () => {
            console.log('Current user data retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }
}
