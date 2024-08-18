import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { IUserRequest } from 'app/shared/models/user.models';

@Injectable({
  providedIn: 'root',
})
export class UserEndpointsService {
  private _httpClient = inject(HttpClient);

  public registerUser(userRequest: IUserRequest): Observable<void> {
    return this._httpClient
      .post<void>(
        environment.backendApiUrl + '/api/User/auth/register',
        userRequest,
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('User registered successfully:');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            console.error('User already exists or wrong study cycle year.');
          } else if (error.status === 401) {
            console.error('Unauthorized: Please check your credentials.');
          } else {
            console.error(`Unexpected error: ${error.message}`);
          }
          return throwError(() => error);
        })
      );
  }
}
