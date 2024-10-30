import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  IUserResponse,
  IUserStatsResponse,
} from 'app/shared/models/user.models';

@Component({
  selector: 'app-selected-user-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-xl text-mainCreme font-bold">User's info:</h2>
    <h3 class="text-lg text-mainOrange">
      Name:
      <span class="text-mainCreme">
        {{ selectedUserData.name }}
      </span>
    </h3>
    <h3 class="text-lg text-mainOrange">
      Email:
      <span class="text-mainCreme">
        {{ selectedUserData.email }}
      </span>
    </h3>
    <h3 class="text-lg text-mainOrange">
      Role:
      <span class="text-mainCreme">
        {{ selectedUserData.role }}
      </span>
    </h3>
    <h3 class="text-lg text-mainOrange">
      Study cycle years:
      <span class="text-mainCreme">
        {{ selectedUserData.studyCycleYearA }}/{{
          selectedUserData.studyCycleYearB
        }}
      </span>
    </h3>
    <h3 class="text-lg text-mainOrange">
      Ban status:
      <span class="text-mainCreme">
        {{ selectedUserData.banned ? 'BANNED' : 'NOT BANNED' }}
      </span>
    </h3>
    <h3 class="text-lg text-mainOrange">
      Types of games played:
      <span class="text-mainCreme">
        {{ selectedUserStats.games }}
      </span>
    </h3>
    <h3 class="text-lg text-mainOrange">
      Total plays in all games:
      <span class="text-mainCreme">
        {{ selectedUserStats.plays }}
      </span>
    </h3>
    <h3 class="text-lg text-mainOrange">
      Total disk space used:
      <span class="text-mainCreme">
        {{ selectedUserStats.totalStorageMb.toPrecision(2) }}MB
      </span>
    </h3>
    <h3 class="text-lg text-mainOrange">
      First game was on:
      <span class="text-mainCreme">
        {{ selectedUserStats.firstPlayed | date: 'dd/MM/yyyy, HH:mm' }}
      </span>
    </h3>
    <h3 class="text-lg text-mainOrange">
      Last game was on:
      <span class="text-mainCreme">
        {{ selectedUserStats.lastPlayed | date: 'dd/MM/yyyy, HH:mm' }}
      </span>
    </h3>
  `,
})
export class SelectedUserInfoComponent {
  @Input({ required: true }) public selectedUserData!: IUserResponse;
  @Input({ required: true }) public selectedUserStats!: IUserStatsResponse;
}
