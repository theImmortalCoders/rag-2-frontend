import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { errorHandler } from '@utils/helpers/errorHandler';
import { getAuthHeaders } from '@utils/helpers/jwtTokenAuthHeader';
import {
  IRecordedGameRequest,
  IRecordedGameResponse,
} from 'app/shared/models/recorded-game.models';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameRecordEndpointsService {
  private _httpClient = inject(HttpClient);

  public getAllRecordedGames(
    gameId: number
  ): Observable<IRecordedGameResponse[]> {
    return this._httpClient
      .get<IRecordedGameResponse[]>(
        environment.backendApiUrl + `/api/GameRecord?gameId=${gameId}`,
        {
          headers: getAuthHeaders(),
          responseType: 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Game records data retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public addGameRecording(
    gameRecordData: IRecordedGameRequest
  ): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl + `/api/GameRecord`,
        gameRecordData,
        {
          headers: getAuthHeaders(),
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Game recording added successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public deleteGameRecording(recordedGameId: number): Observable<void> {
    return this._httpClient
      .delete<void>(
        environment.backendApiUrl +
          `/api/GameRecord?recordedGameId=${recordedGameId}`,
        {
          headers: getAuthHeaders(),
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Game recording deleted successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public downloadSpecificRecordedGame(
    recordedGameId: number
  ): Observable<void> {
    return this._httpClient
      .get<void>(
        environment.backendApiUrl + `/api/GameRecord/${recordedGameId}`,
        {
          headers: getAuthHeaders(),
          responseType: 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Recorded game downloaded successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }
}
