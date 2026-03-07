import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { APP_VERSIONS } from '@shared/constants/versions';

export interface IAppVersions {
  frontend: string;
  gamesLib: string;
}

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  public getVersions(): Observable<IAppVersions> {
    return of(APP_VERSIONS as IAppVersions);
  }
}
