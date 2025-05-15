import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthEndpointsService } from '@endpoints/auth-endpoints.service';
import { TRole } from 'app/shared/models/role.enum';
import { AppStatusService } from 'app/shared/services/app-status.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-shortcut',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <button
      id="userShortcutButton"
      (click)="handleButtonClick()"
      class="mr-5 xs:mr-10">
      <i
        data-feather="users"
        class="hover:text-green-500 ease-in-out transition-all duration-500 size-8 2xs:size-9"></i>
    </button>
    <div
      id="userShortcutMenu"
      class="flex flex-col space-y-1 text-sm 2xs:text-base absolute h-24 2xs:h-28 overflow-y-hidden -z-10 transition-all ease-in-out duration-300 {{
        isUserInfoVisible
          ? 'right-0 opacity-100 w-48 md:w-52 lg:w-44 xl:w-56 p-3'
          : '-right-20 opacity-0 w-0 overflow-x-hidden p-0'
      }} top-[75px] 2xs:top-[83px] bg-mainGray shadow-userInfoShadow rounded-bl-lg">
      <span
        id="userShortcutMenuRole"
        class="text-center text-lightOragne font-bold uppercase"
        >Your role: {{ currentUserRole }}</span
      >
      <hr class="border-[1px] border-lightOragne" />
      <a
        id="userShortcutMenuDashboardButton"
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
  private _appStatusService = inject(AppStatusService);
  private _router = inject(Router);
  private _authEndpointsService = inject(AuthEndpointsService);
  private _notificationService = inject(NotificationService);

  private _authSubscription = new Subscription();
  private _roleSubscription = new Subscription();
  private _logoutSubscription = new Subscription();

  public isLoggedIn = false;
  public currentUserRole: TRole | null = null;
  public isUserInfoVisible = false;

  public ngOnInit(): void {
    this._authSubscription = this._appStatusService.authStatus$.subscribe(
      isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
      }
    );

    this._roleSubscription = this._appStatusService.currentRole$.subscribe(
      role => {
        this.currentUserRole = role;
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

  public logoutButtonClick(): void {
    if (this.isLoggedIn && this.currentUserRole !== null) {
      this._logoutSubscription = this._authEndpointsService.logout().subscribe({
        next: () => {
          this._router.navigate(['/']);
          this._notificationService.addNotification(
            "You've been logged out successfully!",
            3000
          );
          this.isLoggedIn = false;
          this.currentUserRole = null;
          this.isUserInfoVisible = false;
          this._appStatusService.setAuthStatus(false);
        },
      });
    }
  }

  public ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
    this._roleSubscription.unsubscribe();
    this._logoutSubscription.unsubscribe();
  }
}
