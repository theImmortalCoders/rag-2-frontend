import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TGameDataSendingType } from '../../models/game-data-sending-type.enum';
import { TLogData } from '../../models/log-data.type';
import { ILoggableDataComponent } from '../../models/loggable-data-component';

@Component({
  selector: 'app-game-menu',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center space-y-4 pb-4">
      <div class="flex flex-row items-center justify-center space-x-4">
        <label for="socketDomain">Custom AI steering websocket domain</label
        ><input
          #socketDomainInput
          [placeholder]="defaultSocketDomain"
          class="border-mainOrange border-2 px-4 py-1 w-52 bg-mainGray text-mainCreme focus:bg-mainOrange focus:text-mainGray"
          type="text"
          id="socketDomainInput"
          min="3"
          max="50"
          [value]="defaultSocketDomain"
          (input)="onInputChange('socketDomain', socketDomainInput.value)" />
        <button
          class="border-mainOrange border-2 p-1 w-52 bg-mainGray text-mainCreme hover:bg-mainOrange hover:text-mainGray"
          (click)="onInputChange('applySocketDomain', 'yes', true)">
          Apply
        </button>
      </div>
      <button
        class="border-mainOrange border-2 p-1 w-28 bg-mainGray text-mainCreme hover:bg-mainOrange hover:text-mainGray"
        id="reset"
        (click)="onInputChange('reset', 'yes', true)">
        Reset
      </button>
      <div class="flex flex-row items-center justify-center space-x-4">
        <label for="sendData">Send data?</label>
        <input
          #sendData
          type="checkbox"
          [value]="isSendData"
          (change)="onInputChange('sendData', sendData.checked.toString())"
          class="border-mainOrange border-2 p-1 bg-mainGray text-mainCreme hover:bg-mainOrange hover:text-mainGray checked:bg-mainOrange checked:text-mainGray" />
      </div>
      @if (gameDataSendingType === tgameDataSendingType.TimeGame) {
        <div class="flex flex-row items-center justify-center space-x-4">
          <label for="log-interval"></label
          ><input
            class="border-mainOrange border-2 px-4 py-1 w-52 bg-mainGray text-mainCreme focus:bg-mainOrange focus:text-mainGray"
            type="number"
            #logInterval
            min="50"
            [value]="defaultLogInterval"
            step="10"
            max="1000"
            (input)="onInputChange('logInterval', logInterval.value)" />

          <button
            class="border-mainOrange border-2 p-1 w-52 bg-mainGray text-mainCreme hover:bg-mainOrange hover:text-mainGray"
            id="save-log"
            (click)="onInputChange('saveLogInterval', 'yes', true)">
            Save Log Interval
          </button>
        </div>
      }
    </div>
  `,
})
export class GameMenuComponent implements OnInit, ILoggableDataComponent {
  @Input() public gameDataSendingType: TGameDataSendingType =
    TGameDataSendingType.EventGame;
  public tgameDataSendingType = TGameDataSendingType;
  public defaultSocketDomain = 'localhost:8001';
  public isSendData = false;
  public defaultLogInterval = 100;

  @Output() public logDataEmitter = new EventEmitter<TLogData>();
  public logData: TLogData = {
    socketDomain: this.defaultSocketDomain,
    reset: 'no',
    sendData: this.isSendData,
    logInterval: this.defaultLogInterval,
    saveLogInterval: 'no',
    applySocketDomain: 'no',
  };

  public ngOnInit(): void {
    this.logDataEmitter.emit(this.logData);
  }

  public onInputChange(
    inputName: string,
    value: string,
    temporary = false
  ): void {
    if (temporary) {
      this.updateTemporarily(inputName, value);
    } else {
      this.updateLogData(inputName, value);
    }
  }

  //

  private updateTemporarily(inputName: string, value: string): void {
    const previousValue = 'no';

    this.updateLogData(inputName, value);

    setTimeout(() => {
      this.updateLogData(inputName, previousValue);
    }, 1000);
  }

  private updateLogData(inputName: string, value: unknown): void {
    this.logData[inputName] = value;
    this.logDataEmitter.emit(this.logData);
  }
}
