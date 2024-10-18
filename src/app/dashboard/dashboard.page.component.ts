import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { IUserResponse } from 'app/shared/models/user.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    class="flex flex-col space-y-10 font-mono w-full bg-mainGray pt-6 xl:pt-14">
    <div class="flex flex-row justify-stretch w-full">
      <div class="flex flex-col w-3/4 pl-12">
        <h1 class="text-4xl font-bold text-mainOrange">
          Hello, {{ aboutMeUserInfo?.name }}!
        </h1>
        <hr class="w-2/5 border-2 border-mainOrange mb-4" />
        <div class="flex flex-col pl-6">
          <h2 class="text-xl text-mainOrange">
            Your email address:
            <span class="text-mainCreme">
              {{ aboutMeUserInfo?.email }}
            </span>
          </h2>
          <h2 class="text-xl text-mainOrange">
            Logged in as:
            <span class="text-mainCreme">
              {{ aboutMeUserInfo?.role | uppercase }}
            </span>
          </h2>
          <h2 class="text-xl text-mainOrange">
            Your study cycle years:
            <span class="text-mainCreme">
              {{ aboutMeUserInfo?.studyCycleYearA }} /
              {{ aboutMeUserInfo?.studyCycleYearB }}
            </span>
          </h2>
        </div>
      </div>
      <div class="flex items-center justify-center w-1/4 pr-32">
        <div class="relative w-64 h-64 flex items-center justify-center">
          <svg class="w-full h-full" viewBox="0 0 64 64">
            <path
              class="text-lightGray"
              stroke-width="4"
              stroke="currentColor"
              fill="none"
              d="M32 4
             a 28 28 0 1 0 0 56
             a 28 28 0 1 0 0 -56" />
            <path
              class="text-mainOrange"
              stroke-width="4"
              stroke-dasharray="131.88, 175.84"
              stroke-linecap="round"
              stroke="currentColor"
              fill="none"
              transform="rotate(-90 32 32)"
              d="M32 4
             a 28 28 0 1 0 0 56
             a 28 28 0 1 0 0 -56" />
          </svg>
          <div
            class="flex flex-col items-center justify-center absolute text-2xl font-bold text-mainCreme">
            <span>75/100 MB</span>
            <span class="text-center text-wrap">used of your</span>
            <span class="text-center text-wrap">disk space</span>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="flex flex-col px-10">
      <h1 class="text-4xl font-bold text-mainOrange">User account settings</h1>
      <hr class="w-2/5 border-2 border-mainOrange mb-4" />
      <div class="flex flex-row space-x-8">
        <span>zmien haslo</span>
        <span>usun konto</span>
      </div>
    </div>
  </div>`,
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private _userEndpointsService = inject(UserEndpointsService);

  private _getMeSubscription: Subscription | null = null;

  public aboutMeUserInfo: IUserResponse | null = null;

  public ngOnInit(): void {
    this._getMeSubscription = this._userEndpointsService.getMe().subscribe({
      next: (response: IUserResponse) => {
        this.aboutMeUserInfo = response;
      },
      error: () => {
        this.aboutMeUserInfo = null;
      },
    });
  }

  public ngOnDestroy(): void {
    if (this._getMeSubscription) {
      this._getMeSubscription.unsubscribe();
    }
  }
}
