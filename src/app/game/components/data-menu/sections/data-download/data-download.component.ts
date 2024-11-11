import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { GameRecordEndpointsService } from '@endpoints/game-record-endpoints.service';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { Game } from '@gameModels/game.class';
import { IRecordedGameRequest } from 'app/shared/models/recorded-game.models';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-data-download',
  standalone: true,
  template: `<div class="flex flex-col">
    <button
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
        class="mt-4 py-1 text-center text-mainCreme border-mainCreme border-[1px] hover:bg-mainCreme hover:text-darkGray transition-all ease-in-out duration-300">
        Download JSON ({{ collectedDataArray.length }} records)
      </button>
      <button
        (click)="deleteCollectedData()"
        class="mt-3 py-1 text-center font-bold text-red-500 border-red-500 border-[1px] hover:bg-red-500 hover:text-darkGray transition-all ease-in-out duration-300">
        X
      </button>
    }
  </div>`,
})
export class DataDownloadComponent {
  @Input({ required: true }) public game!: Game;
  @Input({ required: true }) public collectedDataArray: TExchangeData[] = [];

  @Output() public deleteCollectedDataArrayEmitter = new EventEmitter<void>();
  @Output() public collectingActiveEmitter = new EventEmitter<boolean>();

  private _gameRecordEndpointsService = inject(GameRecordEndpointsService);
  private _notificationService = inject(NotificationService);
  public isDataCollectingActive = false;

  public handleCollectingData(): void {
    this.isDataCollectingActive = !this.isDataCollectingActive;
    this.collectingActiveEmitter.emit(this.isDataCollectingActive);

    if (!this.isDataCollectingActive) {
      const gameRecordData: IRecordedGameRequest = {
        gameName: this.game.name,
        values: this.collectedDataArray.map(data => {
          const { timestamp, ...rest } = data;
          return {
            name: this.game.name,
            state: rest,
            players: this.game.players,
            timestamp: timestamp,
          } as TExchangeData;
        }),
        outputSpec: this.game.outputSpec,
      };
      this._gameRecordEndpointsService
        .addGameRecording(gameRecordData)
        .subscribe({
          next: () => {
            this._notificationService.addNotification(
              'Game record data has been saved correctly'
            );
          },
          error: (error: string) => {
            this._notificationService.addNotification(error);
          },
        });
    }
  }

  public generateJSON(): void {
    this.downloadCsv(JSON.stringify(this.collectedDataArray));
  }

  public deleteCollectedData(): void {
    this.deleteCollectedDataArrayEmitter.emit();
  }

  //

  private downloadCsv(csv: string): void {
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
}
