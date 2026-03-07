import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay, switchMap } from 'rxjs/operators';

interface IPackageJson {
  version: string;
  dependencies?: Record<string, string>;
}

export interface IAppVersions {
  frontend: string;
  gamesLib: string;
}

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private readonly _frontendPackageUrl = 'package.json';
  private readonly _gamesLibPackageUrl = 'rag-2-games-lib-package.json';
  private _versions$: Observable<IAppVersions> | null = null;

  public constructor(private _httpClient: HttpClient) {}

  public getVersions(): Observable<IAppVersions> {
    if (!this._versions$) {
      this._versions$ = this._httpClient.get<IPackageJson>(this._frontendPackageUrl).pipe(
        switchMap(frontendPkg => {
          return this._httpClient.get<IPackageJson>(this._gamesLibPackageUrl).pipe(
            map(gamesLibPkg => {
              return {
                frontend: frontendPkg.version,
                gamesLib: gamesLibPkg.version,
              };
            }),
            catchError(() => {
              return of({
                frontend: frontendPkg.version,
                gamesLib: 'unknown',
              });
            })
          );
        }),
        catchError(() => {
          return of({
            frontend: 'unknown',
            gamesLib: 'unknown',
          });
        }),
        shareReplay(1)
      );
    }
    return this._versions$;
  }
}
