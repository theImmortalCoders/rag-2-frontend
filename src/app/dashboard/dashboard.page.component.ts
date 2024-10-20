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
import { ProgressCircleBarComponent } from './components/progress-circle-bar.component';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import { UserInfoComponent } from './components/sections/user-info.component';
import { UserAccountSettingsComponent } from './components/sections/user-account-settings.component';
import { GameHandlingOptionsComponent } from './components/sections/game-handling-options.component';
import { AdminSettingsComponent } from './components/sections/admin-settings.component';

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
  ],
  template: `<div
    class="flex flex-col space-y-16 font-mono w-full bg-mainGray pt-6 pb-12 xl:pt-14">
    <app-user-info
      [aboutMeUserInfo]="aboutMeUserInfo"
      [userStatsInfo]="userStatsInfo"
      class="flex flex-row justify-stretch w-full" />
    <app-user-account-settings class="flex flex-col px-10" />
    <app-game-handling-options class="flex flex-col px-10" />
    <app-admin-settings class="flex flex-col px-10" />
  </div>`,
})
export class DashboardPageComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private _userEndpointsService = inject(UserEndpointsService);
  private _statsEndpointsService = inject(StatsEndpointsService);

  private _getMeSubscription: Subscription | null = null;
  private _getUserStats: Subscription | null = null;

  public aboutMeUserInfo: IUserResponse | null = null;
  public userStatsInfo: IUserStatsResponse | null = null;

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
    this._getUserStats = this._statsEndpointsService
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
    if (this._getMeSubscription) {
      this._getMeSubscription.unsubscribe();
    }
    if (this._getUserStats) {
      this._getUserStats.unsubscribe();
    }
  }
}
