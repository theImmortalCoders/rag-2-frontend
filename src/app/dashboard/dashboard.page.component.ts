import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as feather from 'feather-icons';
import { AuthEndpointsService } from '@endpoints/auth-endpoints.service';
import { IUserResponse, IUserStatsResponse } from '@api-models/user.models';
import { Subscription } from 'rxjs';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import { UserInfoComponent } from './components/sections/user-info/user-info.component';
import { UserAccountSettingsComponent } from './components/sections/user-account-settings/user-account-settings.component';
import { GameHandlingOptionsComponent } from './components/sections/game-handling-options/game-handling-options.component';
import { AdminSettingsComponent } from './components/sections/admin-settings/admin-settings.component';
import { RecordedGamesComponent } from './components/sections/recorded-games/recorded-games.component';
import { AllowedRolesDirective } from '@utils/directives/allowed-roles.directive';
import { TRole } from 'app/shared/models/role.enum';
import { CoursesSettingsComponent } from './components/sections/courses-settings/courses-settings.component';
import { AuthRequiredDirective } from '@utils/directives/auth-required.directive';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    UserInfoComponent,
    UserAccountSettingsComponent,
    GameHandlingOptionsComponent,
    AdminSettingsComponent,
    RecordedGamesComponent,
    AllowedRolesDirective,
    AuthRequiredDirective,
    CoursesSettingsComponent,
  ],
  template: `<div
    class="flex flex-col overflow-y-hidden space-y-10 sm:space-y-16 font-mono w-full bg-mainGray pt-6 pb-12 xl:pt-14">
    <app-user-info
      [aboutMeUserInfo]="aboutMeUserInfo"
      [userStatsInfo]="userStatsInfo"
      class="flex flex-row justify-stretch w-full" />
    <app-recorded-games
      *appAuthRequired
      [userId]="aboutMeUserInfo ? aboutMeUserInfo.id : -1"
      (refreshDataEmitter)="userStatsRefresh($event)"
      class="flex flex-col px-10" />
    <div class="flex flex-row flex-wrap justify-stretch gap-y-8 sm:gap-y-12">
      <app-user-account-settings
        *appAuthRequired
        [isOptionsVisible]="optionChoosen === 'user-account'"
        (optionsVisibleEmitter)="changeOptionsVisibility($event)"
        (refreshUserData)="userDataRefresh($event)"
        class="flex flex-col px-10 w-full" />
      <app-courses-settings
        *appAllowedRoles="allowedRolesAdminTeacher"
        [isOptionsVisible]="optionChoosen === 'courses'"
        (optionsVisibleEmitter)="changeOptionsVisibility($event)"
        class="flex flex-col px-10 w-full" />
      <app-game-handling-options
        *appAllowedRoles="allowedRolesAdmin"
        [isOptionsVisible]="optionChoosen === 'game-handling'"
        (optionsVisibleEmitter)="changeOptionsVisibility($event)"
        class="flex flex-col px-10 w-full" />
      <app-admin-settings
        *appAllowedRoles="allowedRolesAdminTeacher"
        [isOptionsVisible]="optionChoosen === 'admin'"
        (optionsVisibleEmitter)="changeOptionsVisibility($event)"
        class="flex flex-col px-10  w-full" />
    </div>
  </div>`,
})
export class DashboardPageComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private _authEndpointsService = inject(AuthEndpointsService);
  private _statsEndpointsService = inject(StatsEndpointsService);

  private _getMeSubscription = new Subscription();
  private _getUserStatsSubscription = new Subscription();

  public aboutMeUserInfo: IUserResponse | null = null;
  public userStatsInfo: IUserStatsResponse | null = null;

  public allowedRolesAdmin: TRole[] = [TRole.Admin];
  public allowedRolesAdminTeacher: TRole[] = [TRole.Admin, TRole.Teacher];

  public optionChoosen:
    | 'user-account'
    | 'courses'
    | 'game-handling'
    | 'admin'
    | null = null;

  public ngOnInit(): void {
    this.getMeData();
  }

  public changeOptionsVisibility(option: string): void {
    switch (option) {
      case 'user-account':
        this.optionChoosen = 'user-account';
        break;
      case 'courses':
        this.optionChoosen = 'courses';
        break;
      case 'game-handling':
        this.optionChoosen = 'game-handling';
        break;
      case 'admin':
        this.optionChoosen = 'admin';
        break;
      default:
        break;
    }
  }

  public getMeData(): void {
    this._getMeSubscription = this._authEndpointsService.getMe().subscribe({
      next: (response: IUserResponse) => {
        this.aboutMeUserInfo = response;
        this.getUserStats(this.aboutMeUserInfo.id);
      },
      error: () => {
        this.aboutMeUserInfo = null;
      },
    });
  }

  public ngAfterViewInit(): void {
    feather.replace();
  }

  public getUserStats(userId: number): void {
    this._getUserStatsSubscription = this._statsEndpointsService
      .getUserStats(userId)
      .subscribe({
        next: (response: IUserStatsResponse) => {
          this.userStatsInfo = response;
        },
        error: () => {
          this.userStatsInfo = null;
        },
      });
  }

  public userStatsRefresh(isRefreshNeeded: boolean): void {
    if (isRefreshNeeded && this.aboutMeUserInfo) {
      this.getUserStats(this.aboutMeUserInfo.id);
    }
  }

  public userDataRefresh(isRefreshNeeded: boolean): void {
    if (isRefreshNeeded) {
      this.getMeData();
    }
  }

  public ngOnDestroy(): void {
    this._getMeSubscription.unsubscribe();
    this._getUserStatsSubscription.unsubscribe();
  }
}
