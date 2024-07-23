import { inject, Injectable } from '@angular/core';
import { TExchangeData } from '../../../models/exchange-data.type';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class GameDataSendingService {
  public backendApiUrl = 'http://localhost:5172';

  private _httpClient = inject(HttpClient);

  public sendGameData(gameId: number, data: TExchangeData[]): Observable<void> {
    return this._httpClient.post<void>(
      this.backendApiUrl + '/api/gamerecord?gameId=' + gameId,
      { value: JSON.stringify(data) },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
        },
      }
    );
  }
}
