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
import { UserInfoComponent } from './components/user-info.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, ProgressCircleBarComponent, UserInfoComponent],
  template: `<div
    class="flex flex-col space-y-10 font-mono w-full bg-mainGray pt-6 xl:pt-14">
    <app-user-info
      [aboutMeUserInfo]="aboutMeUserInfo"
      [userStatsInfo]="userStatsInfo"
      class="flex flex-row justify-stretch w-full" />
    <!--  -->
    <div class="flex flex-col px-10">
      <h1 class="text-4xl font-bold text-mainOrange">User account settings</h1>
      <hr class="w-2/5 border-2 border-mainOrange mb-4" />
      <div class="flex flex-row justify-around space-x-8">
        <button
          type="button"
          class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
          <span>Change your password</span>
          <i
            data-feather="edit"
            class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
        </button>
        <button
          type="button"
          class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
          <span>Delete your account</span>
          <i
            data-feather="trash-2"
            class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
        </button>
      </div>
    </div>
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
