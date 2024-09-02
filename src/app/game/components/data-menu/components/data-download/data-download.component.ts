import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameDataSendingService } from '../../services/game-data-sending.service';
import { TExchangeData } from 'app/game/models/exchange-data.type';

@Component({
  selector: 'app-data-download',
  standalone: true,
  template: `<div class="flex flex-col">
    <button
      class="font-bold mt-2 border-b-[1px] border-mainOrange w-full text-center"
      (click)="vIsDataCollectingActive.value = !vIsDataCollectingActive.value">
      @if (!vIsDataCollectingActive.value) {
        Start collecting data
      } @else {
        Stop collecting data
      }
    </button>
    @if (collectedDataArray.length > 0 && !vIsDataCollectingActive.value) {
      <button (click)="generateJSON()" class="mt-6 text-center text-mainCreme">
        Download JSON ({{ collectedDataArray.length }} records)
      </button>
      <button (click)="sendData()">Save data</button>
      <button
        (click)="deleteCollectedData()"
        class="mt-4 text-center font-bold text-red-500 border-red-500 border-[1px]">
        X
      </button>
    }
  </div>`,
})
export class DataDownloadComponent {
  @Input({ required: true }) public vIsDataCollectingActive = { value: false };
  @Input({ required: true }) public gameName = '';
  @Input({ required: true }) public collectedDataArray: TExchangeData[] = [];

  @Output() public deleteCollectedDataArrayEmitter = new EventEmitter<void>();

  public constructor(public gameDataSendingService: GameDataSendingService) {}

  public sendData(): void {
    this.gameDataSendingService.sendGameData(1, this.collectedDataArray);
  }

  public generateJSON(): void {
    this.downloadCsv(JSON.stringify(this.collectedDataArray));
  }

  public saveData(): void {
    this.gameDataSendingService
      .sendGameData(1, this.collectedDataArray)
      .subscribe({
        next: () => {
          console.log('Data saved');
        },
        error: error => {
          console.error('Error saving data', error);
        },
      });
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
      `${this.gameName}_${new Date().toISOString()}.json`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
