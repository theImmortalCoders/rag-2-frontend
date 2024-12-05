/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { GameRecordEndpointsService } from '@endpoints/game-record-endpoints.service';
import { IGameResponse } from '@api-models/game.models';
import { IRecordedGameResponse } from '@api-models/recorded-game.models';
import { Subscription } from 'rxjs';
import * as feather from 'feather-icons';
import { NotificationService } from 'app/shared/services/notification.service';
import { RecordedGameTableComponent } from '@dashboardComponents/recorded-game-table/recorded-game-table.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recorded-games',
  standalone: true,
  imports: [CommonModule, RecordedGameTableComponent, ReactiveFormsModule],
  template: `
    <h1
      class="text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start">
      My recorded games
    </h1>
    <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
    <form
      [formGroup]="filterForm"
      (ngSubmit)="applyFilters()"
      class="w-full flex-col space-y-4 text-mainOrange pb-6 font-mono">
      <div class="w-full flex flex-row gap-x-6 gap-y-2 flex-wrap justify-start">
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
  `,
})
export class RecordedGamesComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewChecked
{
  @Input({ required: true }) public userId!: number;
  @Output() public refreshDataEmitter = new EventEmitter<boolean>(false);

  private _gameRecordEndpointsService = inject(GameRecordEndpointsService);
  private _gameEndpointsService = inject(GameEndpointsService);
  private _notificationService = inject(NotificationService);

  private _getRecordedGamesSubscription = new Subscription();
  private _getGamesSubscription = new Subscription();

  public avalaibleGamesList: IGameResponse[] = [];
  public recordedGamesData: IRecordedGameResponse[] | null = null;
  public isLoading = false;
  public errorMessage: string | null = null;

  public filterForm!: FormGroup;

  public sortBy: 'Ended' | 'SizeMb' = 'Ended';
  public sortDirection: 'Asc' | 'Desc' = 'Asc';

  public constructor(private _fb: FormBuilder) {
    this.filterForm = this._fb.group({
      gameId: [1],
      includeEmptyRecords: [''],
      endDateFrom: [''],
      endDateTo: [''],
    });
  }

  public ngOnInit(): void {
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
  }

  public ngAfterViewChecked(): void {
    feather.replace(); //dodane, żeby feather-icons na nowo dodało się do DOM w pętli
  }

  public ngOnChanges(): void {
    if (this.userId !== -1) this.applyFilters();
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
          this.refreshDataEmitter.emit(true);
          this.applyFilters();
        },
        error: (error: string) => {
          this.errorMessage = error;
        },
      });
  }

  public ngOnDestroy(): void {
    this._getRecordedGamesSubscription.unsubscribe();
    this._getGamesSubscription.unsubscribe();
  }
}
