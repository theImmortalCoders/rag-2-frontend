import { Injectable } from '@angular/core';
import { TExchangeData } from '../../../models/exchange-data.type';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameDataSendingService {
  public backendApiUrl = 'http://localhost:5172';

  public constructor(private _httpClient: HttpClient) {}

  public sendGameData(gameId: number, data: TExchangeData[]): Observable<void> {
    return this._httpClient.post<void>(
      this.backendApiUrl + '/api/games?gameId=' + gameId,
      { value: data.toString() },
      {
        withCredentials: true,
      }
    );
  }
}
