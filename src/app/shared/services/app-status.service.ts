import { inject, Injectable, OnDestroy } from '@angular/core';
import { TRole } from '../models/role.enum';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IUserResponse } from '@api-models/user.models';
import { AuthEndpointsService } from '@endpoints/auth-endpoints.service';

@Injectable({
  providedIn: 'root',
})
export class AppStatusService implements OnDestroy {
  private _authEndpointsService = inject(AuthEndpointsService);

  private _getMeSubscription = new Subscription();

  private _authStatusSubject = new BehaviorSubject<boolean>(false);
  public authStatus$: Observable<boolean> =
    this._authStatusSubject.asObservable();

  private _currentRoleSubject = new BehaviorSubject<TRole | null>(null);
  public currentRole$: Observable<TRole | null> =
    this._currentRoleSubject.asObservable();

  private constructor() {
    this._authEndpointsService
      .verifyJWTToken()
      .subscribe((isValid: boolean) => {
        if (isValid) {
          this._authStatusSubject.next(true);
          this.loadCurrentUser();
        } else {
          this._authEndpointsService.logout();
          this._authStatusSubject.next(false);
          this._currentRoleSubject.next(null);
        }
      });
  }

  public loadCurrentUser(): void {
    this._getMeSubscription = this._authEndpointsService.getMe().subscribe({
      next: (response: IUserResponse) => {
        this._currentRoleSubject.next(response.role);
      },
      error: () => {
        this._currentRoleSubject.next(null);
      },
    });
  }

  public setAuthStatus(isAuthenticated: boolean): void {
    this._authStatusSubject.next(isAuthenticated);
    if (isAuthenticated) {
      this.loadCurrentUser();
    }
  }

  public ngOnDestroy(): void {
    this._getMeSubscription.unsubscribe();
  }
}
