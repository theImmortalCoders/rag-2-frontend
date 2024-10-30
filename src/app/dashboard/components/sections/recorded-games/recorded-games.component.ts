import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { GameRecordEndpointsService } from '@endpoints/game-record-endpoints.service';
import { IGameResponse } from 'app/shared/models/game.models';
import { IRecordedGameResponse } from 'app/shared/models/recorded-game.models';
import { Subscription } from 'rxjs';
import * as feather from 'feather-icons';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-recorded-games',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange">
      User recorded games
    </h1>
    <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
    <div
      class="flex flex-col justify-around space-y-0 border-mainOrange border-2">
      <div
        class="flex flex-row space-x-4 justify-between bg-mainGray text-mainOrange font-bold px-4 py-2">
        <span class="flex justify-center w-[5%]">No.</span>
        <span class="flex justify-center w-2/12">Game name</span>
        <span class="flex justify-center w-3/12">Game start date</span>
        <span class="flex justify-center w-3/12">Game end date</span>
        <div class="flex flex-row space-x-2 w-2/12">
          <span class="flex justify-center w-1/2">Download</span>
          <span class="flex justify-center w-1/2">Delete</span>
        </div>
      </div>
      @for (recordedGame of recordedGamesData; track recordedGame.id) {
        <div
          class="flex flex-row space-x-4 justify-between px-4 py-2 text-mainCreme opacity-80 hover:opacity-100 {{
            $even ? 'bg-lightGray' : 'bg-darkGray'
          }}">
          <span class="flex justify-center w-[5%]">{{ $index + 1 }}.</span>
          <span class="flex justify-center w-2/12">nazwa gry</span>
          <span class="flex justify-center w-3/12">{{
            recordedGame.started | date: 'dd/MM/yyyy, HH:mm'
          }}</span>
          <span class="flex justify-center w-3/12">{{
            recordedGame.ended | date: 'dd/MM/yyyy, HH:mm'
          }}</span>
          <div class="flex flex-row space-x-2 w-2/12">
            <button
              class="flex justify-center w-1/2"
              (click)="downloadGameRecord(recordedGame.id)">
              <i
                data-feather="download"
                class="text-mainCreme hover:text-green-500 size-4 xs:size-5"></i>
            </button>
            <button
              class="flex justify-center w-1/2"
              (click)="deleteGameRecord(recordedGame.id)">
              <i
                data-feather="x-square"
                class="text-mainCreme hover:text-red-500 size-4 xs:size-5"></i>
            </button>
          </div>
        </div>
      }
    </div>
    <div class="text-red-500 mt-6">
      @if (errorMessage !== null) {
        <p>{{ errorMessage }}</p>
      }
    </div>
  `,
})
export class RecordedGamesComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  private _gameRecordEndpointsService = inject(GameRecordEndpointsService);
  private _gameEndpointsService = inject(GameEndpointsService);
  private _notificationService = inject(NotificationService);

  private _getRecordedGamesSubscription: Subscription = new Subscription();
  private _getGamesSubscription: Subscription = new Subscription();

  public avalaibleGamesList: IGameResponse[] = [];
  public recordedGamesData: IRecordedGameResponse[] = [];
  public errorMessage: string | null = null;

  public ngOnInit(): void {
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
  }

  public ngAfterViewChecked(): void {
    feather.replace(); //dodane, żeby feather-icons na nowo dodało się do DOM w pętli
  }

  public getRecordedGames(): void {
    this.recordedGamesData = [];
    for (const game of this.avalaibleGamesList) {
      this._getRecordedGamesSubscription = this._gameRecordEndpointsService
        .getAllRecordedGames(game.id)
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
    this._getRecordedGamesSubscription.unsubscribe();
    this._getGamesSubscription.unsubscribe();
  }
}
