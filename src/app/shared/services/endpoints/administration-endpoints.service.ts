import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { errorHandler } from '@utils/helpers/errorHandler';
import { getAuthHeaders } from '@utils/helpers/jwtTokenAuthHeader';
import { TRole } from 'app/shared/models/role.enum';
import { ILimitsResponse, IUserResponse } from '@api-models/user.models';
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
          `/api/Administration/${userId}/role?role=${TRole[role]}`,
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

  // eslint-disable-next-line complexity
  public getUsers(
    role: TRole,
    email?: string,
    studyCycleYearA?: number,
    studyCycleYearB?: number,
    group?: string,
    courseName?: string,
    sortDirection?: 'Asc' | 'Desc',
    sortBy?:
      | 'Id'
      | 'Email'
      | 'Name'
      | 'StudyYearCycleA'
      | 'StudyYearCycleB'
      | 'LastPlayed'
      | 'CourseName'
      | 'Group'
  ): Observable<IUserResponse[]> {
    const queryParams = new URLSearchParams({ role });

    if (email) queryParams.append('email', email);
    if (studyCycleYearA !== undefined)
      queryParams.append('studyCycleYearA', studyCycleYearA.toString());
    if (studyCycleYearB !== undefined)
      queryParams.append('studyCycleYearB', studyCycleYearB.toString());
    if (group) queryParams.append('group', group);
    if (courseName) queryParams.append('courseName', courseName);
    if (sortDirection) queryParams.append('sortDirection', sortDirection);
    if (sortBy) queryParams.append('sortBy', sortBy);

    return this._httpClient
      .get<IUserResponse[]>(
        environment.backendApiUrl +
          `/api/Administration/users?${queryParams.toString()}`,
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

  public getStorageLimits(): Observable<ILimitsResponse> {
    return this._httpClient
      .get<ILimitsResponse>(
        environment.backendApiUrl + `/api/Administration/limits`,
        {
          responseType: 'json',
          headers: getAuthHeaders(),
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Current storage limits retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }
}
