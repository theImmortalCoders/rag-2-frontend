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
import { IGameResponse } from 'app/shared/models/game.models';
import { IRecordedGameResponse } from 'app/shared/models/recorded-game.models';
import { Subscription } from 'rxjs';
import * as feather from 'feather-icons';
import { NotificationService } from 'app/shared/services/notification.service';
import { RecordedGameTableComponent } from '../../shared/recorded-game-table.component';

@Component({
  selector: 'app-recorded-games',
  standalone: true,
  imports: [CommonModule, RecordedGameTableComponent],
  template: `
    <h1
      class="text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start">
      My recorded games
    </h1>
    <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
    <app-recorded-game-table
      [recordedGamesData]="recordedGamesData"
      (downloadEmitter)="downloadGameRecord($event)"
      (deleteEmitter)="deleteGameRecord($event)"
      class="w-full overflow-auto max-h-96 border-mainOrange border-2" />
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
    this.recordedGamesData = null;
  }

  public ngAfterViewChecked(): void {
    feather.replace(); //dodane, żeby feather-icons na nowo dodało się do DOM w pętli
  }

  public ngOnChanges(): void {
    this.getRecordedGames();
  }

  public getRecordedGames(): void {
    this.recordedGamesData = [];
    for (const game of this.avalaibleGamesList) {
      this._getRecordedGamesSubscription = this._gameRecordEndpointsService
        .getAllRecordedGames(game.id, this.userId)
        .subscribe({
          next: response => {
            if (this.recordedGamesData !== null) {
              this.recordedGamesData.push(...response);
              this.errorMessage = null;
            }
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
