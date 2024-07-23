import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _httpClient = inject(HttpClient);

  public authenticateUser(email: string, password: string): Observable<string> {
    return this._httpClient.post<string>(
      environment.backendApiUrl + '/api/user',
      { email, password },
      {
        responseType: 'text' as 'json',
      }
    );
  }
}
