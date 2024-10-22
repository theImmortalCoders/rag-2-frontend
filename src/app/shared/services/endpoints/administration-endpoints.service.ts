import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { errorHandler } from '@utils/helpers/errorHandler';
import { getAuthHeaders } from '@utils/helpers/jwtTokenAuthHeader';
import { TRole } from 'app/shared/models/role.enum';
import { IUserResponse } from 'app/shared/models/user.models';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdministrationEndpointsService {
  private _httpClient = inject(HttpClient);

  public banStatus(userId: number, isBanned: boolean): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl +
          `/api/Administration/${userId}/ban-status?isBanned=${isBanned}`,
        {},
        {
          headers: getAuthHeaders(),
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Ban status changed successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public changeRole(userId: number, role: TRole): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl +
          `/api/Administration/${userId}/role=${TRole[role]}`,
        {},
        {
          headers: getAuthHeaders(),
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Role changed successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public getUserDetails(userId: number): Observable<IUserResponse> {
    return this._httpClient
      .get<IUserResponse>(
        environment.backendApiUrl + `/api/Administration/${userId}/details`,
        {
          responseType: 'json',
          headers: getAuthHeaders(),
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('User data retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public getUsers(): Observable<IUserResponse[]> {
    return this._httpClient
      .get<IUserResponse[]>(
        environment.backendApiUrl + `/api/Administration/users`,
        {
          responseType: 'json',
          headers: getAuthHeaders(),
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Users data retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }
}
