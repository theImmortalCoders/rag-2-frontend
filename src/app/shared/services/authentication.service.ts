import { Injectable, OnDestroy } from '@angular/core';
import { TRole } from '../models/role.enum';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnDestroy {
  private _getMeSubscription: Subscription | null = null;

  private _authStatusSubject = new BehaviorSubject<boolean>(false);
  public authStatus$: Observable<boolean> =
    this._authStatusSubject.asObservable();

  public setAuthStatus(isAuthenticated: boolean): void {
    this._authStatusSubject.next(isAuthenticated);
  }

  public async getCurrentRole(): Promise<TRole> {
    return new Promise<TRole>(resolve => {
      setTimeout(() => {
        resolve(TRole.Admin);
      }, 500);
    });
  }

  public ngOnDestroy(): void {
    if (this._getMeSubscription) {
      this._getMeSubscription.unsubscribe();
    }
  }
}
