import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IUserResponse, IUserStatsResponse } from '@api-models/user.models';
import { ProgressCircleBarComponent } from '@dashboardComponents/progress-circle-bar/progress-circle-bar.component';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, ProgressCircleBarComponent],
  template: `
    <div class="flex flex-col lg:flex-row justify-stretch w-full">
      <div class="flex flex-col w-[90%] md:w-3/4 pl-4 xs:pl-8 sm:pl-12">
        <h1
          id="dashboardNameHeader"
          class="text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start">
          Hello, {{ aboutMeUserInfo?.name }}!
        </h1>
        <hr
          class="w-full xs:w-5/6 border-[1px] sm:border-2 border-mainOrange mb-4" />
        <div
          class="flex flex-col pl-2 xs:pl-6 text-sm xs:text-base sm:text-xl text-mainOrange">
          <h2 id="dashboardRoleHeader">
            Logged in as:
            <span class="text-mainCreme uppercase">
              {{ aboutMeUserInfo?.role }}
            </span>
          </h2>
          <h2 id="dashboardEmailHeader">
            Your email address:
            <span class="text-mainCreme">
              {{ aboutMeUserInfo?.email }}
            </span>
          </h2>
          @if (
            aboutMeUserInfo?.studyCycleYearA !== null &&
            aboutMeUserInfo?.studyCycleYearB !== null
          ) {
            <h2 id="dashboardYearsHeader">
              Your study cycle years:
              <span class="text-mainCreme">
                {{ aboutMeUserInfo?.studyCycleYearA }}/{{
                  aboutMeUserInfo?.studyCycleYearB
                }}
              </span>
            </h2>
          }
          @if (aboutMeUserInfo?.course !== null) {
            <h2 id="dashboardCourseHeader">
              Your course of study:
              <span class="text-mainCreme">
                {{ aboutMeUserInfo?.course?.name }}
              </span>
            </h2>
          }
          @if (aboutMeUserInfo?.group !== null) {
            <h2 id="dashboardGroupHeader">
              Your group:
              <span class="text-mainCreme">
                {{ aboutMeUserInfo?.group }}
              </span>
            </h2>
          }
          <h2 id="dashboardGamesHeader">
            Your types of games played:
            <span class="text-mainCreme">
              {{ userStatsInfo?.games }}
            </span>
          </h2>
          <h2 id="dashboardPlaysHeader">
            Your total plays in all games:
            <span class="text-mainCreme">
              {{ userStatsInfo?.plays }}
            </span>
          </h2>
          <h2 id="dashboardFirstGameHeader">
            Your first game was on:
            <span class="text-mainCreme">
              {{ userStatsInfo?.firstPlayed | date: 'dd/MM/yyyy, HH:mm' }}
            </span>
          </h2>
          <h2 id="dashboardLastGameHeader">
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
        [currentUserRole]="aboutMeUserInfo?.role"
        [isForCurrentUser]="true" />
    </div>
  `,
})
export class UserInfoComponent {
  @Input({ required: true }) public aboutMeUserInfo!: IUserResponse | null;
  @Input({ required: true }) public userStatsInfo!: IUserStatsResponse | null;
}
