import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public backendApiUrl = 'http://localhost:5172';

  public constructor(private _httpClient: HttpClient) {}

  public logIn(email: string, password: string): Observable<string> {
    return this._httpClient.post<string>(
      this.backendApiUrl + '/api/user/login',
      { email, password },
      {
        responseType: 'text' as 'json',
      }
    );
  }
}
