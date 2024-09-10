import { inject, Injectable } from '@angular/core';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class GameDataSendingService {
  private _httpClient = inject(HttpClient);

  //maybe need to change location of this service + error handling in service instead of in component
  public sendGameData(
    gameName: string,
    data: TExchangeData[]
  ): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl + '/api/gamerecord',
        { gameName: gameName, value: JSON.stringify(data) },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
          },
        }
      )
      .pipe(
        catchError(error => {
          console.error('Error occurred while sending game data:', error);
          return throwError(error);
        })
      );
  }
}
