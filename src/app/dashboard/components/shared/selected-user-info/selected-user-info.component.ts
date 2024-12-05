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
    <h3 class="flex flex-col xs:flex-row space-x-2 text-mainOrange">
      <span> Name: </span>
      <span class="text-mainCreme">
        {{ selectedUserData?.name }}
      </span>
    </h3>
    <h3 class="flex flex-col xs:flex-row space-x-2 text-mainOrange">
      <span> Email: </span>
      <span class="text-mainCreme">
        {{ selectedUserData?.email }}
      </span>
    </h3>
    <h3 class="flex flex-col xs:flex-row space-x-2 text-mainOrange">
      <span> Role: </span>
      <span class="text-mainCreme uppercase">
        {{ selectedUserData?.role }}
      </span>
    </h3>
    <h3 class="flex flex-col xs:flex-row space-x-2 text-mainOrange">
      <span> Study cycle years: </span>
      <span class="text-mainCreme">
        {{ selectedUserData?.studyCycleYearA }}/{{
          selectedUserData?.studyCycleYearB
        }}
      </span>
    </h3>
    <h3 class="flex flex-col xs:flex-row space-x-2 text-mainOrange">
      <span> Course of study: </span>
      <span class="text-mainCreme">
        {{ selectedUserData?.course?.name }}
      </span>
    </h3>
    <h3 class="flex flex-col xs:flex-row space-x-2 text-mainOrange">
      <span> Group: </span>
      <span class="text-mainCreme">
        {{ selectedUserData?.group }}
      </span>
    </h3>
    <h3 class="flex flex-col xs:flex-row space-x-2 text-mainOrange">
      <span> Ban status: </span>
      <span class="text-mainCreme">
        {{ selectedUserData?.banned ? 'BANNED' : 'NOT BANNED' }}
      </span>
    </h3>
    <h3 class="flex flex-col xs:flex-row space-x-2 text-mainOrange">
      <span> Types of games played: </span>
      <span class="text-mainCreme">
        {{ selectedUserStats?.games }}
      </span>
    </h3>
    <h3 class="flex flex-col xs:flex-row space-x-2 text-mainOrange">
      <span> Total plays in all games: </span>
      <span class="text-mainCreme">
        {{ selectedUserStats?.plays }}
      </span>
    </h3>
    <h3 class="flex flex-col xs:flex-row space-x-2 text-mainOrange">
      <span> Total disk space used: </span>
      <span class="text-mainCreme">
        {{
          selectedUserStats
            ? selectedUserStats.totalStorageMb.toPrecision(2)
            : 0
        }}
        MB
      </span>
    </h3>
    <h3
      class="flex flex-col xs:flex-row space-x-2 text-mainOrange text-wrap text-start">
      <span> First game was on: </span>
      <span class="text-mainCreme">
        {{ selectedUserStats?.firstPlayed | date: 'dd/MM/yyyy, HH:mm' }}
      </span>
    </h3>
    <h3
      class="flex flex-col xs:flex-row space-x-2 text-mainOrange text-wrap text-start">
      <span> Last game was on: </span>
      <span class="text-mainCreme">
        {{ selectedUserStats?.lastPlayed | date: 'dd/MM/yyyy, HH:mm' }}
      </span>
    </h3>
  `,
})
export class SelectedUserInfoComponent {
  @Input({ required: true }) public selectedUserData!: IUserResponse | null;
  @Input({ required: true })
  public selectedUserStats!: IUserStatsResponse | null;
}
