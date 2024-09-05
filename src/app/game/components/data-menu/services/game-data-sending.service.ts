import { inject, Injectable } from '@angular/core';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class GameDataSendingService {
  private _httpClient = inject(HttpClient);

  //maybe need to change location of this service + error handling in service instead of in component
  public sendGameData(gameId: number, data: TExchangeData[]): Observable<void> {
    return this._httpClient.post<void>(
      environment.backendApiUrl + '/api/gamerecord?gameId=' + gameId,
      { value: JSON.stringify(data) },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
        },
      }
    );
  }
}
