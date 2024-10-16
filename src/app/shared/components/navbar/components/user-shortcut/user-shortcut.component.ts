import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TRole } from 'app/shared/models/role.enum';
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
        class="flex flex-col space-y-1 text-base w-56 absolute -z-10 top-[82px] right-0 bg-mainGray shadow-userInfoShadow p-3 rounded-bl-lg">
        <span class="text-center text-lightOragne font-bold"
          >Your role: {{ currentUserRole }}</span
        >
        <hr class="border-[1px] border-lightOragne" />
        <span class="text-center">DASHBOARD</span>
        <hr class="border-mainOrange" />
        <span class="text-center">LOGOUT</span>
      </div>
    }
  `,
})
export class UserShortcutComponent implements OnInit, OnDestroy {
  private _authService = inject(AuthenticationService);
  private _router = inject(Router);

  private _authSubscription: Subscription | null = null;
  private _roleSubscription: Subscription | null = null;

  public isLoggedIn = false;
  public currentUserRole: TRole | null = null;
  public isUserInfoVisible = false;

  public ngOnInit(): void {
    this._authSubscription = this._authService.authStatus$.subscribe(
      isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
      }
    );

    this._roleSubscription = this._authService.currentRole$.subscribe(role => {
      this.currentUserRole = role;
    });
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
    if (this._roleSubscription) {
      this._roleSubscription.unsubscribe();
    }
  }
}
