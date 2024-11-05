import { inject, Injectable, OnDestroy } from '@angular/core';
import { TRole } from '../models/role.enum';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { IUserResponse } from '../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnDestroy {
  private _userEndpointsService = inject(UserEndpointsService);

  private _getMeSubscription: Subscription = new Subscription();

  private _authStatusSubject = new BehaviorSubject<boolean>(false);
  public authStatus$: Observable<boolean> =
    this._authStatusSubject.asObservable();

  private _currentRoleSubject = new BehaviorSubject<TRole | null>(null);
  public currentRole$: Observable<TRole | null> =
    this._currentRoleSubject.asObservable();

  private constructor() {
    const token = localStorage.getItem('jwtToken');
    if (!this._userEndpointsService.verifyJWTToken()) {
      this._userEndpointsService.logout();
      this._authStatusSubject.next(false);
      this._currentRoleSubject.next(null);
    } else if (token) {
      this._authStatusSubject.next(true);
      this.loadCurrentUser();
    }
  }

  public loadCurrentUser(): void {
    this._getMeSubscription = this._userEndpointsService.getMe().subscribe({
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
