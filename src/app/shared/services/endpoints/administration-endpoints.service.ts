import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { errorHandler } from '@utils/helpers/errorHandler';
import { jwtTokenAuthHeader } from '@utils/helpers/jwtTokenAuthHeader';
import { TRole } from 'app/shared/models/role.enum';
import {
  IUserDetailsResponse,
  IUserResponse,
} from 'app/shared/models/user.models';
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
          headers: jwtTokenAuthHeader,
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
          headers: jwtTokenAuthHeader,
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

  public getUserDetails(userId: number): Observable<IUserDetailsResponse> {
    return this._httpClient
      .get<IUserDetailsResponse>(
        environment.backendApiUrl + `/api/Administration/${userId}/details`,
        {
          responseType: 'json',
          headers: jwtTokenAuthHeader,
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

  public getStudents(
    studyCycleYearA: number,
    studyCycleYearB: number
  ): Observable<IUserResponse[]> {
    return this._httpClient
      .get<IUserResponse[]>(
        environment.backendApiUrl +
          `/api/Administration/students?studyCycleYearA=${studyCycleYearA}&studyCycleYearB=${studyCycleYearB}`,
        {
          responseType: 'json',
          headers: jwtTokenAuthHeader,
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Students data retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }
}
