import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  IUserResponse,
  IUserStatsResponse,
} from 'app/shared/models/user.models';
import { ProgressCircleBarComponent } from './progress-circle-bar.component';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, ProgressCircleBarComponent],
  template: `
    <div class="flex flex-col lg:flex-row justify-stretch w-full">
      <div class="flex flex-col w-[90%] md:w-3/4 pl-4 xs:pl-8 sm:pl-12">
        <h1
          class="text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start">
          Hello, {{ aboutMeUserInfo?.name }}!
        </h1>
        <hr
          class="w-full xs:w-5/6 border-[1px] sm:border-2 border-mainOrange mb-4" />
        <div
          class="flex flex-col pl-2 xs:pl-6 text-sm xs:text-base sm:text-xl text-mainOrange">
          <h2>
            Logged in as:
            <span class="text-mainCreme uppercase">
              {{ aboutMeUserInfo?.role }}
            </span>
          </h2>
          <h2>
            Your email address:
            <span class="text-mainCreme">
              {{ aboutMeUserInfo?.email }}
            </span>
          </h2>
          <h2>
            Your study cycle years:
            <span class="text-mainCreme">
              {{ aboutMeUserInfo?.studyCycleYearA }}/{{
                aboutMeUserInfo?.studyCycleYearB
              }}
            </span>
          </h2>
          <h2>
            Your types of games played:
            <span class="text-mainCreme">
              {{ userStatsInfo?.games }}
            </span>
          </h2>
          <h2>
            Your total plays in all games:
            <span class="text-mainCreme">
              {{ userStatsInfo?.plays }}
            </span>
          </h2>
          <h2>
            Your first game was on:
            <span class="text-mainCreme">
              {{ userStatsInfo?.firstPlayed | date: 'dd/MM/yyyy, HH:mm' }}
            </span>
          </h2>
          <h2>
            Your last game was on:
            <span class="text-mainCreme">
              {{ userStatsInfo?.lastPlayed | date: 'dd/MM/yyyy, HH:mm' }}
            </span>
          </h2>
        </div>
      </div>
      <app-progress-circle-bar
        class="flex items-center justify-center w-full lg:w-1/3 xl:w-1/4 pr-0 lg:pr-32 pt-8 lg:pt-4"
        [usedSpace]="userStatsInfo?.totalStorageMb"
        [totalSpace]="10.0" />
    </div>
  `,
})
export class UserInfoComponent {
  @Input({ required: true }) public aboutMeUserInfo!: IUserResponse | null;
  @Input({ required: true }) public userStatsInfo!: IUserStatsResponse | null;
}
