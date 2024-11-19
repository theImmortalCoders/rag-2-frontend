import {
  AfterViewChecked,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { GameRecordEndpointsService } from '@endpoints/game-record-endpoints.service';
import { IGameResponse } from 'app/shared/models/game.models';
import { IRecordedGameResponse } from 'app/shared/models/recorded-game.models';
import { Subscription } from 'rxjs';
import { RecordedGameTableComponent } from '../components/shared/recorded-game-table.component';
import { NotificationService } from 'app/shared/services/notification.service';
import * as feather from 'feather-icons';
import { SelectedUserInfoComponent } from './selected-user-info.component';
import {
  IUserResponse,
  IUserStatsResponse,
} from 'app/shared/models/user.models';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [RecordedGameTableComponent, SelectedUserInfoComponent],
  template: `
    <div class="flex flex-col px-10 pt-6 pb-12 xl:pt-14">
      <h1
        class="text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start font-mono">
        {{ userInfo.email }} - account details
      </h1>
      <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
      <app-selected-user-info
        class="mb-4 ml-4 text-xl font-mono"
        [selectedUserData]="userInfo"
        [selectedUserStats]="userStats" />
      <h1
        class="text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start font-mono">
        Recorded games:
      </h1>
      <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
      <app-recorded-game-table
        [recordedGamesData]="recordedGamesData"
        (downloadEmitter)="downloadGameRecord($event)"
        (deleteEmitter)="deleteGameRecord($event)"
        class="w-full overflow-x-auto border-mainOrange border-2" />
      @if (errorMessage !== null) {
        <div class="text-red-500 mt-6">
          <p>{{ errorMessage }}</p>
        </div>
      }
    </div>
  `,
})
export class UserDetailsComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  private _route = inject(ActivatedRoute);
  private _gameRecordEndpointsService = inject(GameRecordEndpointsService);
  private _gameEndpointsService = inject(GameEndpointsService);
  private _adminEndpointsService = inject(AdministrationEndpointsService);
  private _statsEndpointsService = inject(StatsEndpointsService);
  private _notificationService = inject(NotificationService);

  private _getRecordedGamesSubscription = new Subscription();
  private _getGamesSubscription = new Subscription();
  private _getUserDetailsSubscription = new Subscription();
  private _getUserStatsSubsription = new Subscription();

  public avalaibleGamesList: IGameResponse[] = [];
  public recordedGamesData: IRecordedGameResponse[] = [];
  public errorMessage: string | null = null;

  public userInfo!: IUserResponse;
  public userStats!: IUserStatsResponse;

  public userId!: number;

  public ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.userId = params['id'];

      this._getGamesSubscription = this._gameEndpointsService
        .getGames()
        .subscribe({
          next: response => {
            this.avalaibleGamesList = response;
            this.errorMessage = null;
            this.getRecordedGames();
          },
          error: (error: string) => {
            this.errorMessage = error;
          },
        });

      this._getUserDetailsSubscription = this._adminEndpointsService
        .getUserDetails(this.userId)
        .subscribe({
          next: (response: IUserResponse) => {
            this.userInfo = response;
            this.errorMessage = null;
          },
          error: (error: string) => {
            this.errorMessage = error;
          },
        });

      this._getUserStatsSubsription = this._statsEndpointsService
        .getUserStats(this.userId)
        .subscribe({
          next: (response: IUserStatsResponse) => {
            this.userStats = response;
            this.errorMessage = null;
          },
          error: (error: string) => {
            this.errorMessage = error;
          },
        });
    });
  }

  public ngAfterViewChecked(): void {
    feather.replace(); //dodane, żeby feather-icons na nowo dodało się do DOM w pętli
  }

  public getRecordedGames(): void {
    this.recordedGamesData = [];
    for (const game of this.avalaibleGamesList) {
      this._getRecordedGamesSubscription = this._gameRecordEndpointsService
        .getAllRecordedGames(game.id, this.userId)
        .subscribe({
          next: response => {
            this.recordedGamesData.push(...response);
            this.errorMessage = null;
          },
          error: (error: string) => {
            this.errorMessage = error;
          },
        });
    }
  }

  public downloadGameRecord(recordedGameId: number): void {
    this._gameRecordEndpointsService
      .downloadSpecificRecordedGame(recordedGameId)
      .subscribe({
        next: () => {
          this._notificationService.addNotification(
            `The game record file is downloading`,
            4000
          );
          this.errorMessage = null;
        },
        error: (error: string) => {
          this.errorMessage = error;
        },
      });
  }

  public deleteGameRecord(recordedGameId: number): void {
    this._gameRecordEndpointsService
      .deleteGameRecording(recordedGameId)
      .subscribe({
        next: () => {
          this._notificationService.addNotification(
            `The game record has been removed`,
            3000
          );
          this.errorMessage = null;
          this.getRecordedGames();
        },
        error: (error: string) => {
          this.errorMessage = error;
        },
      });
  }

  public ngOnDestroy(): void {
    this._getGamesSubscription.unsubscribe();
    this._getRecordedGamesSubscription.unsubscribe();
    this._getUserDetailsSubscription.unsubscribe();
    this._getUserStatsSubsription.unsubscribe();
  }
}
