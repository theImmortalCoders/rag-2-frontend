import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { errorHandler } from '@utils/helpers/errorHandler';
import { jwtTokenAuthHeader } from '@utils/helpers/jwtTokenAuthHeader';
import { IGameRequest, IGameResponse } from 'app/shared/models/game.models';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameEndpointsService {
  private _httpClient = inject(HttpClient);

  public getGames(): Observable<IGameResponse[]> {
    return this._httpClient
      .get<IGameResponse[]>(environment.backendApiUrl + `/api/Game`, {
        responseType: 'json',
      })
      .pipe(
        tap({
          next: () => {
            console.log('Games data retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public addGame(gameData: IGameRequest): Observable<void> {
    return this._httpClient
      .post<void>(environment.backendApiUrl + `/api/Game`, gameData, {
        headers: jwtTokenAuthHeader,
        responseType: 'text' as 'json',
      })
      .pipe(
        tap({
          next: () => {
            console.log('Game added successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public updateGame(gameId: number, gameData: IGameRequest): Observable<void> {
    return this._httpClient
      .put<void>(environment.backendApiUrl + `/api/Game/${gameId}`, gameData, {
        headers: jwtTokenAuthHeader,
        responseType: 'text' as 'json',
      })
      .pipe(
        tap({
          next: () => {
            console.log('Game updated successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public deleteGame(gameId: number): Observable<void> {
    return this._httpClient
      .delete<void>(environment.backendApiUrl + `/api/Game/${gameId}`, {
        headers: jwtTokenAuthHeader,
        responseType: 'text' as 'json',
      })
      .pipe(
        tap({
          next: () => {
            console.log('Game deleted successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }
}
