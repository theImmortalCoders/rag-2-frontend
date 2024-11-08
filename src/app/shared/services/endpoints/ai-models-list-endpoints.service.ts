import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { IAiModel } from 'app/game/components/ai-socket-menu/sections/model-selection/models/ai-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiModelsListEndpointsService {
  private _httpClient = inject(HttpClient);

  public getAiModelsList(gameName: string): Observable<IAiModel[]> {
    return this._httpClient.get<IAiModel[]>(
      environment.aiApiUrl + '/ws/' + gameName + '/routes/'
    );
  }
}
