import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PingService {
  public constructor(private _http: HttpClient) {}

  public measurePing(url: string): Observable<number> {
    const start = Date.now();
    return new Observable(observer => {
      this._http.get(url, { observe: 'response' }).subscribe({
        next: () => {
          const end = Date.now();
          observer.next(end - start);
          observer.complete();
        },
        error: () => {
          observer.next(-1);
          observer.complete();
        },
      });
    });
  }
}
