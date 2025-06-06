import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { GameRecordEndpointsService } from '@endpoints/game-record-endpoints.service';
import { Game, TExchangeData } from 'rag-2-games-lib';
import { IRecordedGameRequest } from '@api-models/recorded-game.models';
import { NotificationService } from 'app/shared/services/notification.service';
import { formatFileSize } from '@utils/helpers/formatFileSize';

@Component({
  selector: 'app-data-download',
  standalone: true,
  template: `<div class="flex flex-col">
    <button
      id="gameCollectingDataButton"
      class="font-bold mt-2 border-b-[1px] border-mainOrange w-full text-center"
      (click)="handleCollectingData()">
      @if (!isDataCollectingActive) {
        Start collecting data
      } @else {
        Stop collecting data
      }
    </button>
    @if (collectedDataArray.length > 0 && !isDataCollectingActive) {
      <button
        (click)="generateJSON()"
        class="flex flex-col mt-4 py-1 text-center text-mainCreme border-mainCreme border-[1px] hover:bg-mainCreme hover:text-darkGray transition-all ease-in-out duration-300">
        <span>Download JSON</span>
        <span
          >({{ downloadedJSONSize }},
          {{ collectedDataArray.length }} records)</span
        >
      </button>
      <button
        (click)="deleteCollectedData()"
        class="mt-3 py-1 text-center font-bold text-red-500 border-red-500 border-[1px] hover:bg-red-500 hover:text-darkGray transition-all ease-in-out duration-300">
        X
      </button>
    }
  </div>`,
})
export class DataDownloadComponent implements OnDestroy {
  @Input({ required: true }) public game!: Game;
  @Input({ required: true }) public collectedDataArray: TExchangeData[] = [];
  @Input({ required: true }) public isStateChanged = false;

  @Output() public deleteCollectedDataArrayEmitter = new EventEmitter<void>();
  @Output() public collectingActiveEmitter = new EventEmitter<boolean>();

  private _gameRecordEndpointsService = inject(GameRecordEndpointsService);
  private _notificationService = inject(NotificationService);
  public isDataCollectingActive = false;
  public downloadedJSONSize?: string;

  private isGameAlreadySaved = false;

  public ngOnDestroy(): void {
    if (!this.isGameAlreadySaved && this.isStateChanged) {
      const gameRecordData: IRecordedGameRequest = {
        gameName: this.game.name,
        players: this.game.players,
        values: [],
        outputSpec: this.game.outputSpec,
      };

      this._gameRecordEndpointsService
        .addGameRecording(gameRecordData)
        .subscribe({});
    }
  }

  public handleCollectingData(): void {
    this.isDataCollectingActive = !this.isDataCollectingActive;
    this.collectingActiveEmitter.emit(this.isDataCollectingActive);

    if (!this.isDataCollectingActive) {
      const gameRecordData: IRecordedGameRequest = {
        gameName: this.game.name,
        players: this.game.players,
        values: this.mapToSaveableData(this.collectedDataArray),
        outputSpec: this.game.outputSpec,
      };
      console.log(gameRecordData);
      this.downloadedJSONSize = formatFileSize(
        this.getJsonSize(
          JSON.stringify(this.mapToSaveableData(this.collectedDataArray))
        )
      );
      this._gameRecordEndpointsService
        .addGameRecording(gameRecordData)
        .subscribe({
          next: () => {
            this._notificationService.addNotification(
              'Game record data has been saved correctly',
              5000
            );
          },
          error: (error: string) => {
            this._notificationService.addNotification(error, 5000);
            this.spaceExceeded(gameRecordData);
          },
        });
      this.isGameAlreadySaved = true;
    }
  }

  private spaceExceeded(data: IRecordedGameRequest): void {
    const gameRecordData = data;
    gameRecordData.values = [];
    this._gameRecordEndpointsService
      .addGameRecording(gameRecordData)
      .subscribe({});
  }

  public generateJSON(): void {
    this.downloadJson(
      JSON.stringify(this.mapToSaveableData(this.collectedDataArray))
    );
  }

  public deleteCollectedData(): void {
    this.deleteCollectedDataArrayEmitter.emit();
  }

  //

  private mapToSaveableData(collectedData: TExchangeData[]): TExchangeData[] {
    return collectedData.slice(1).map(data => {
      const { timestamp, players, ...rest } = data;
      return {
        name: this.game.name,
        state: rest,
        players: players,
        timestamp: timestamp,
      } as TExchangeData;
    });
  }

  private downloadJson(csv: string): void {
    const blob = new Blob([csv], { type: 'text/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute(
      'download',
      `${this.game.name}_${new Date().toISOString()}.json`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private getJsonSize(csv: string): number {
    const blob = new Blob([csv], { type: 'text/json' });
    return blob.size;
  }
}
