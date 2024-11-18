import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IUserResponse,
  IUserStatsResponse,
} from 'app/shared/models/user.models';

@Component({
  selector: 'app-selected-user-info',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2 class="text-base 2xs:text-lg sm:text-xl text-mainCreme font-bold">
      User's info:
    </h2>
    <h3 class="text-mainOrange">
      Name:
      <span class="text-mainCreme">
        {{ selectedUserData.name }}
      </span>
    </h3>
    <h3 class="text-mainOrange">
      Email:
      <span class="text-mainCreme">
        {{ selectedUserData.email }}
      </span>
    </h3>
    <h3 class="text-mainOrange">
      Role:
      <span class="text-mainCreme">
        {{ selectedUserData.role }}
      </span>
    </h3>
    <h3 class="text-mainOrange">
      Study cycle years:
      <span class="text-mainCreme">
        {{ selectedUserData.studyCycleYearA }}/{{
          selectedUserData.studyCycleYearB
        }}
      </span>
    </h3>
    <h3 class="text-mainOrange">
      Course of study:
      <span class="text-mainCreme">
        {{ selectedUserData.course }}
      </span>
    </h3>
    <h3 class="text-mainOrange">
      Group:
      <span class="text-mainCreme">
        {{ selectedUserData.group }}
      </span>
    </h3>
    <h3 class="text-mainOrange">
      Ban status:
      <span class="text-mainCreme">
        {{ selectedUserData.banned ? 'BANNED' : 'NOT BANNED' }}
      </span>
    </h3>
    <h3 class="text-mainOrange">
      Types of games played:
      <span class="text-mainCreme">
        {{ selectedUserStats.games }}
      </span>
    </h3>
    <h3 class="text-mainOrange">
      Total plays in all games:
      <span class="text-mainCreme">
        {{ selectedUserStats.plays }}
      </span>
    </h3>
    <h3 class="text-mainOrange">
      Total disk space used:
      <span class="text-mainCreme">
        {{ selectedUserStats.totalStorageMb.toPrecision(2) }}MB
      </span>
    </h3>
    <h3 class="text-mainOrange text-wrap text-start">
      First game was on:
      <span class="text-mainCreme">
        {{ selectedUserStats.firstPlayed | date: 'dd/MM/yyyy, HH:mm' }}
      </span>
    </h3>
    <h3 class="text-mainOrange text-wrap text-start">
      Last game was on:
      <span class="text-mainCreme">
        {{ selectedUserStats.lastPlayed | date: 'dd/MM/yyyy, HH:mm' }}
      </span>
    </h3>
    <a
      [routerLink]="['/dashboard/user', selectedUserData.id]"
      class="flex flex-row w-full items-center justify-center group space-x-2 rounded-lg mt-1 xs:mt-2 px-2 xs:px-3 py-1 xs:py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
      Check user game records
    </a>
  `,
})
export class SelectedUserInfoComponent {
  @Input({ required: true }) public selectedUserData!: IUserResponse;
  @Input({ required: true }) public selectedUserStats!: IUserStatsResponse;
}
