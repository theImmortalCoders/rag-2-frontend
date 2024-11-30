/* eslint-disable max-lines */
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
import { ProgressCircleBarComponent } from '../components/shared/progress-circle-bar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    RecordedGameTableComponent,
    SelectedUserInfoComponent,
    ProgressCircleBarComponent,
    ReactiveFormsModule,
  ],
  template: `
    <div class="flex flex-col px-10 pt-6 pb-12 xl:pt-14">
      <div class="flex flex-col lg:flex-row justify-stretch w-full pb-4">
        <div class="flex flex-col w-[90%] md:w-3/4 pl-2">
          <h1
            class="text-lg 2xs:text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start font-mono">
            {{ userInfo?.email }}
          </h1>
          <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
          <app-selected-user-info
            class="mb-4 pl-2 xs:pl-6 text-base 2xs:text-lg sm:text-xl font-mono"
            [selectedUserData]="userInfo"
            [selectedUserStats]="userStats" />
        </div>
        <app-progress-circle-bar
          class="flex items-center justify-center w-full lg:w-1/3 xl:w-1/4 ml-0 lg:ml-24 pt-8 lg:pt-4"
          [usedSpace]="userStats?.totalStorageMb"
          [currentUserRole]="userInfo?.role"
          [isForCurrentUser]="false" />
      </div>
      <h1
        class="text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start font-mono">
        Recorded games:
      </h1>
      <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
      <form
        [formGroup]="filterForm"
        (ngSubmit)="applyFilters()"
        class="w-full flex-col space-y-4 text-mainOrange pb-6 font-mono">
        <div
          class="w-full flex flex-row gap-x-6 gap-y-2 flex-wrap justify-start">
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="gameId">Game:</label>
            <select
              id="gameId"
              formControlName="gameId"
              class="custom-input uppercase">
              @for (game of avalaibleGamesList; track game.id) {
                <option [value]="game.id" class="uppercase">
                  {{ game.name }}
                </option>
              }
            </select>
          </div>
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="endDateFrom">Game end date from:</label>
            <input
              id="endDateFrom"
              type="datetime-local"
              formControlName="endDateFrom"
              class="custom-input"
              placeholder="Type endDateFrom" />
          </div>
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="endDateTo">Game end date to:</label>
            <input
              id="endDateTo"
              type="datetime-local"
              formControlName="endDateTo"
              class="custom-input"
              placeholder="Type endDateTo" />
          </div>
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="includeEmptyRecords">Include empty records:</label>
            <span class="h-1">&nbsp;</span>
            <input
              id="includeEmptyRecords"
              type="checkbox"
              formControlName="includeEmptyRecords"
              class="accent-mainOrange h-5 pt-6"
              placeholder="Type includeEmptyRecords" />
          </div>
        </div>
        <div class="w-full flex flex-row gap-x-6 flex-wrap items-end">
          <button
            type="submit"
            class="flex flex-row h-fit w-full xs:w-60 items-center justify-center gap-x-2 font-bold bg-darkGray hover:bg-mainCreme text-mainCreme hover:text-darkGray border-2 border-mainCreme rounded-md px-2 py-1 ease-in-out duration-150 transition-all">
            <i data-feather="search" class="size-4"> </i>
            <span>APPLY FILTERS</span>
          </button>
        </div>
      </form>
      <app-recorded-game-table
        [recordedGamesData]="recordedGamesData"
        [isLoading]="isLoading"
        (downloadEmitter)="downloadGameRecord($event)"
        (deleteEmitter)="deleteGameRecord($event)"
        (sortByEmitter)="sortBy = $event; applyFilters()"
        (sortDirectionEmitter)="sortDirection = $event; applyFilters()"
        class="w-full overflow-auto max-h-96 border-mainOrange border-2" />
      @if (!isLoading && recordedGamesData && recordedGamesData.length === 0) {
        <span class="w-full text-mainOrange">No records found.</span>
      }
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
  public recordedGamesData: IRecordedGameResponse[] | null = null;
  public isLoading = false;
  public errorMessage: string | null = null;

  public filterForm!: FormGroup;

  public sortBy: 'Ended' | 'SizeMb' = 'Ended';
  public sortDirection: 'Asc' | 'Desc' = 'Asc';

  public userInfo: IUserResponse | null = null;
  public userStats: IUserStatsResponse | null = null;

  public userId!: number;

  public constructor(private _fb: FormBuilder) {
    this.filterForm = this._fb.group({
      gameId: [1],
      includeEmptyRecords: [''],
      endDateFrom: [''],
      endDateTo: [''],
    });
  }

  public ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.userId = params['id'];
    });
    this._getGamesSubscription = this._gameEndpointsService
      .getGames()
      .subscribe({
        next: response => {
          this.avalaibleGamesList = response;
          this.errorMessage = null;
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
          this.userInfo = null;
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
          this.userStats = null;
          this.errorMessage = error;
        },
      });

    this.applyFilters();
  }

  public ngAfterViewChecked(): void {
    feather.replace(); //dodane, żeby feather-icons na nowo dodało się do DOM w pętli
  }

  public applyFilters(): void {
    this.isLoading = true;
    const filters = this.filterForm.value;
    this._getRecordedGamesSubscription = this._gameRecordEndpointsService
      .getAllRecordedGames(
        filters.gameId,
        this.userId,
        filters.includeEmptyRecords,
        filters.endDateFrom,
        filters.endDateTo,
        this.sortDirection,
        this.sortBy
      )
      .subscribe({
        next: response => {
          this.recordedGamesData = response;
          this.errorMessage = null;
          this.isLoading = false;
        },
        error: (error: string) => {
          this.recordedGamesData = null;
          this.errorMessage = error;
          this.isLoading = false;
        },
      });
  }

  public downloadGameRecord(recordedGameId: number): void {
    this._gameRecordEndpointsService
      .downloadSpecificRecordedGame(recordedGameId)
      .subscribe({
        next: () => {
          this._notificationService.addNotification(
            `The game record file is downloading`,
            3000
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
          this.applyFilters();
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
