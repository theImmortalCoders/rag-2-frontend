import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/shared/services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-shortcut',
  standalone: true,
  imports: [],
  template: `
    <button (click)="handleButtonClick()" class="mr-5 xs:mr-10">
      <i data-feather="users" class="size-8 2xs:size-9"></i>
    </button>
    @if (isUserInfoVisible) {
      <div
        class="flex flex-col text-lg w-40 absolute -z-10 top-[82px] right-0 bg-mainGray shadow-userInfoShadow px-2 py-1 rounded-bl-lg">
        <span class="text-center">ADMIN</span>
        <hr class="border-mainOrange" />
        <span class="text-center">DASHBOARD</span>
        <span class="text-center">LOGOUT</span>
      </div>
    }
  `,
})
export class UserShortcutComponent implements OnInit, OnDestroy {
  private _authService = inject(AuthenticationService);
  private _router = inject(Router);

  private _authSubscription: Subscription | null = null;

  public isLoggedIn = false;
  public isUserInfoVisible = false;

  public ngOnInit(): void {
    this._authSubscription = this._authService.authStatus$.subscribe(
      isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
      }
    );
  }

  public handleButtonClick(): void {
    if (this.isLoggedIn) {
      this.isUserInfoVisible = !this.isUserInfoVisible;
    } else {
      this._router.navigate(['/login']);
    }
  }

  public ngOnDestroy(): void {
    if (this._authSubscription) {
      this._authSubscription.unsubscribe();
    }
  }
}
