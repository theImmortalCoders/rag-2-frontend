import { inject, Injectable, OnDestroy } from '@angular/core';
import { TRole } from '../models/role.enum';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnDestroy {
  private _userEndpointsService = inject(UserEndpointsService);

  private _getMeSubscription: Subscription | null = null;

  public async isAuthenticated(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this._getMeSubscription = this._userEndpointsService.getMe().subscribe({
        next: () => {
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
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
