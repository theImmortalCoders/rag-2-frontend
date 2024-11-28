import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { errorHandler } from '@utils/helpers/errorHandler';
import { getAuthHeaders } from '@utils/helpers/jwtTokenAuthHeader';
import {
  IRecordedGameRequest,
  IRecordedGameResponse,
} from 'app/shared/models/recorded-game.models';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class GameRecordEndpointsService {
  private _httpClient = inject(HttpClient);

  public getAllRecordedGames(
    gameId: number,
    userId: number,
    isEmptyRecord?: boolean,
    endDateFrom?: string,
    endDateTo?: string,
    sortDirection?: 'Asc' | 'Desc',
    sortBy?: 'Id' | 'Ended' | 'SizeMb'
  ): Observable<IRecordedGameResponse[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('gameId', gameId.toString());
    queryParams.append('userId', userId.toString());

    if (isEmptyRecord)
      queryParams.append('isEmptyRecord', isEmptyRecord.toString());
    if (endDateFrom) queryParams.append('endDateFrom', endDateFrom);
    if (endDateTo) queryParams.append('endDateTo', endDateTo);
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortDirection) queryParams.append('sortDirection', sortDirection);

    return this._httpClient
      .get<IRecordedGameResponse[]>(
        environment.backendApiUrl + `/api/GameRecord?${queryParams.toString()}`,
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
  ): Observable<HttpResponse<Blob>> {
    return this._httpClient
      .get<Blob>(
        environment.backendApiUrl + `/api/GameRecord/${recordedGameId}`,
        {
          headers: getAuthHeaders(),
          responseType: 'blob' as 'json',
          observe: 'response',
        }
      )
      .pipe(
        tap({
          next: (response: HttpResponse<Blob>) => {
            if (response.body) {
              const contentDisposition = response.headers.get(
                'content-disposition'
              );
              let fileName = `game_record_${recordedGameId}.json`;

              if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(
                  /filename[^;=\n]*=(['"]?)([^'"\n]*)\1/
                );
                // eslint-disable-next-line max-depth
                if (fileNameMatch && fileNameMatch[2]) {
                  fileName = fileNameMatch[2];
                }
              }
              saveAs(response.body, fileName);
              console.log('Recorded game downloaded successfully');
            } else {
              console.error('No file data in response');
            }
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }
}
