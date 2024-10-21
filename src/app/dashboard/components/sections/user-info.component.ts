import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  IUserResponse,
  IUserStatsResponse,
} from 'app/shared/models/user.models';
import { ProgressCircleBarComponent } from '../progress-circle-bar.component';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, ProgressCircleBarComponent],
  template: `
    <div class="flex flex-row justify-stretch w-full">
      <div class="flex flex-col w-3/4 pl-12">
        <h1 class="text-4xl font-bold text-mainOrange">
          Hello, {{ aboutMeUserInfo?.name }}!
        </h1>
        <hr class="w-5/6 border-2 border-mainOrange mb-4" />
        <div class="flex flex-col pl-6">
          <h2 class="text-xl text-mainOrange">
            Logged in as:
            <span class="text-mainCreme">
              {{ aboutMeUserInfo?.role | uppercase }}
            </span>
          </h2>
          <h2 class="text-xl text-mainOrange">
            Your email address:
            <span class="text-mainCreme">
              {{ aboutMeUserInfo?.email }}
            </span>
          </h2>
          <h2 class="text-xl text-mainOrange">
            Your study cycle years:
            <span class="text-mainCreme">
              {{ aboutMeUserInfo?.studyCycleYearA }}/{{
                aboutMeUserInfo?.studyCycleYearB
              }}
            </span>
          </h2>
          <h2 class="text-xl text-mainOrange">
            Your types of games played:
            <span class="text-mainCreme">
              {{ userStatsInfo?.games }}
            </span>
          </h2>
          <h2 class="text-xl text-mainOrange">
            Your total plays in all games:
            <span class="text-mainCreme">
              {{ userStatsInfo?.plays }}
            </span>
          </h2>
          <h2 class="text-xl text-mainOrange">
            Your first game was on:
            <span class="text-mainCreme">
              {{ userStatsInfo?.firstPlayed | date: 'dd/MM/yyyy, HH:mm' }}
            </span>
          </h2>
          <h2 class="text-xl text-mainOrange">
            Your last game was on:
            <span class="text-mainCreme">
              {{ userStatsInfo?.lastPlayed | date: 'dd/MM/yyyy, HH:mm' }}
            </span>
          </h2>
        </div>
      </div>
      <app-progress-circle-bar
        class="flex items-center justify-center w-1/4 pr-32 pt-4"
        [usedSpace]="userStatsInfo?.totalStorageMb"
        [totalSpace]="10.0" />
    </div>
  `,
})
export class UserInfoComponent {
  @Input({ required: true }) public aboutMeUserInfo!: IUserResponse | null;
  @Input({ required: true }) public userStatsInfo!: IUserStatsResponse | null;
}
