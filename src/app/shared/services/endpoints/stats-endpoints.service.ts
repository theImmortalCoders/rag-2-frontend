import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { errorHandler } from '@utils/helpers/errorHandler';
import { getAuthHeaders } from '@utils/helpers/jwtTokenAuthHeader';
import { IGameStatsResponse } from 'app/shared/models/game.models';
import { IUserStatsResponse } from 'app/shared/models/user.models';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsEndpointsService {
  private _httpClient = inject(HttpClient);

  public getUserStats(userId: number): Observable<IUserStatsResponse> {
    return this._httpClient
      .get<IUserStatsResponse>(
        environment.backendApiUrl + `/api/Stats/user?userId=${userId}`,
        {
          headers: getAuthHeaders(),
          responseType: 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('User stats data retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public getGameStats(gameId: number): Observable<IGameStatsResponse> {
    return this._httpClient
      .get<IGameStatsResponse>(
        environment.backendApiUrl + `/api/Stats/game?gameId=${gameId}`,
        {
          responseType: 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Game stats data retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }
}
