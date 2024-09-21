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

  private _getMeSubscription: Subscription | null = null;

  private _authStatusSubject = new BehaviorSubject<boolean>(false);
  public authStatus$: Observable<boolean> =
    this._authStatusSubject.asObservable();

  private _currentRoleSubject = new BehaviorSubject<TRole | null>(null);
  public currentRole$: Observable<TRole | null> =
    this._currentRoleSubject.asObservable();

  private constructor() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this._authStatusSubject.next(true);
      this.loadCurrentUser();
    } else {
      this._authStatusSubject.next(false);
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
      setTimeout(() => {
        this.loadCurrentUser();
      }, 1000); //time to wait for jwt being set
    } else {
      this._currentRoleSubject.next(null);
    }
  }

  public ngOnDestroy(): void {
    if (this._getMeSubscription) {
      this._getMeSubscription.unsubscribe();
    }
  }
}
