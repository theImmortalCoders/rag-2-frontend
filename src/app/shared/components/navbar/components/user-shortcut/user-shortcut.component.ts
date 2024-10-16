import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { TRole } from 'app/shared/models/role.enum';
import { AuthenticationService } from 'app/shared/services/authentication.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-shortcut',
  standalone: true,
  imports: [RouterModule],
  template: `
    <button (click)="handleButtonClick()" class="mr-5 xs:mr-10">
      <i
        data-feather="users"
        class="hover:text-green-500 ease-in-out transition-all duration-500 size-8 2xs:size-9"></i>
    </button>
    <div
      class="flex flex-col space-y-1 text-sm 2xs:text-base w-48 md:w-52 lg:w-44 xl:w-56 absolute -z-10 transition-all ease-in-out duration-300 {{
        isUserInfoVisible ? 'right-0 opacity-100' : '-right-20 opacity-0'
      }} top-[75px] 2xs:top-[83px] bg-mainGray shadow-userInfoShadow p-3 rounded-bl-lg">
      <span class="text-center text-lightOragne font-bold"
        >Your role: {{ currentUserRole }}</span
      >
      <hr class="border-[1px] border-lightOragne" />
      <a
        [routerLink]="['dashboard']"
        (click)="isUserInfoVisible = false"
        class="flex flex-row items-center justify-center space-x-2 text-center hover:text-green-500 ease-in-out transition-all duration-500">
        <span>DASHBOARD</span>
        <i data-feather="grid" class="size-3 2xs:size-4"></i>
      </a>
      <hr class="border-mainOrange" />
      <button
        (click)="logoutButtonClick()"
        class="flex flex-row items-center justify-center space-x-2 text-center hover:text-green-500 ease-in-out transition-all duration-500">
        <span>LOGOUT</span>
        <i data-feather="log-out" class="size-3 2xs:size-4"></i>
      </button>
    </div>
  `,
})
export class UserShortcutComponent implements OnInit, OnDestroy {
  private _authService = inject(AuthenticationService);
  private _router = inject(Router);
  private _userEndpointsService = inject(UserEndpointsService);
  private _notificationService = inject(NotificationService);

  private _authSubscription: Subscription | null = null;
  private _roleSubscription: Subscription | null = null;
  private _logoutSubscription: Subscription | null = null;

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

  public logoutButtonClick(): void {
    if (this.isLoggedIn && this.currentUserRole !== null) {
      this._logoutSubscription = this._userEndpointsService.logout().subscribe({
        next: () => {
          this._router.navigate(['/']);
          this._notificationService.addNotification(
            "You've been logged out successfully!",
            3000
          );
          this.isLoggedIn = false;
          this.currentUserRole = null;
          this.isUserInfoVisible = false;
          this._authService.setAuthStatus(false);
        },
      });
    }
  }

  public ngOnDestroy(): void {
    if (this._authSubscription) {
      this._authSubscription.unsubscribe();
    }
    if (this._roleSubscription) {
      this._roleSubscription.unsubscribe();
    }
    if (this._logoutSubscription) {
      this._logoutSubscription.unsubscribe();
    }
  }
}
