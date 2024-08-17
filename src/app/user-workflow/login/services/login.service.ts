import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _httpClient = inject(HttpClient);

  //tu bedzie wywolywanie endpointow z /shared, czyli tam napisany url do backendu itd a tu wywolanie + obsluga np localStorage (aktualnie w komponencie)

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
