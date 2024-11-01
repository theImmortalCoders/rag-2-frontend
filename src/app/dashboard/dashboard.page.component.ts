import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as feather from 'feather-icons';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import {
  IUserResponse,
  IUserStatsResponse,
} from 'app/shared/models/user.models';
import { Subscription } from 'rxjs';
import { ProgressCircleBarComponent } from './components/sections/user-info/progress-circle-bar.component';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import { UserInfoComponent } from './components/sections/user-info/user-info.component';
import { UserAccountSettingsComponent } from './components/sections/user-account-settings/user-account-settings.component';
import { GameHandlingOptionsComponent } from './components/sections/game-handling-options/game-handling-options.component';
import { AdminSettingsComponent } from './components/sections/admin-settings/admin-settings.component';
import { RecordedGamesComponent } from './components/sections/recorded-games/recorded-games.component';
import { AllowedRolesDirective } from '@utils/directives/allowed-roles.directive';
import { TRole } from 'app/shared/models/role.enum';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    ProgressCircleBarComponent,
    UserInfoComponent,
    UserAccountSettingsComponent,
    GameHandlingOptionsComponent,
    AdminSettingsComponent,
    RecordedGamesComponent,
    AllowedRolesDirective,
  ],
  template: `<div
    class="flex flex-col space-y-10 sm:space-y-16 font-mono w-full bg-mainGray pt-6 pb-12 xl:pt-14">
    <app-user-info
      [aboutMeUserInfo]="aboutMeUserInfo"
      [userStatsInfo]="userStatsInfo"
      class="flex flex-row justify-stretch w-full" />
    <app-recorded-games class="flex flex-col px-10" />
    <div class="flex flex-row flex-wrap justify-between gap-y-8 sm:gap-y-12">
      <app-user-account-settings class="flex flex-col px-10 w-full sm:w-fit" />
      <app-game-handling-options
        *appAllowedRoles="allowedRoles"
        class="flex flex-col px-10 w-full sm:w-fit" />
      <app-admin-settings
        *appAllowedRoles="allowedRoles"
        class="flex flex-col px-10  w-full sm:w-fit" />
    </div>
  </div>`,
})
export class DashboardPageComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private _userEndpointsService = inject(UserEndpointsService);
  private _statsEndpointsService = inject(StatsEndpointsService);

  private _getMeSubscription: Subscription = new Subscription();
  private _getUserStatsSubscription: Subscription = new Subscription();

  public aboutMeUserInfo: IUserResponse | null = null;
  public userStatsInfo: IUserStatsResponse | null = null;

  public allowedRoles: TRole[] = [TRole.Admin];

  public ngOnInit(): void {
    this._getMeSubscription = this._userEndpointsService.getMe().subscribe({
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
    console.log('eee', userId);
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

  public ngOnDestroy(): void {
    this._getMeSubscription.unsubscribe();
    this._getUserStatsSubscription.unsubscribe();
  }
}
