import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { AsyncPipe, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-data-menu',
  standalone: true,
  imports: [KeyValuePipe, AsyncPipe],
  template: `
    <div class="border-2 bg-white border-solid border-red-600 p-5">
      Select data to persist
      @for (variable of dataPossibleToPersist | keyvalue; track variable.key) {
        <span class="flex gap-2">
          @if (variable.key && variable.key !== '1') {
            <p>{{ variable.key }}</p>
          }
          <input
            #input
            type="checkbox"
            [defaultChecked]="true"
            (change)="
              updateDataToPersist(variable.key, variable.value, input.checked)
            " />
        </span>
      }
      <div class="flex flex-col">
        <button (click)="isDataCollectingActive = !isDataCollectingActive">
          @if (!isDataCollectingActive) {
            Start collecting data
          } @else {
            Stop collecting data
          }
        </button>
        @if (collectedData.length > 0 && !isDataCollectingActive) {
          <button (click)="downloadJson()">
            Download JSON ({{ collectedData.length }} records)
          </button>
        }
      </div>
    </div>
  `,
})
export class DataMenuComponent implements OnInit, DoCheck {
  @Input({ required: true }) public gameName = '';
  @Input({ required: true }) public dataPossibleToPersist: TExchangeData = {};
  @Output() public logDataEmitter = new EventEmitter<TExchangeData>();
  public logData: TExchangeData = { menu: 'menu' };
  public dataToPersist: TExchangeData = {};
  public collectedData: TExchangeData[] = [];
  public isDataCollectingActive = false;

  public ngOnInit(): void {
    this.logDataEmitter.emit(this.logData);
    this.dataToPersist = JSON.parse(JSON.stringify(this.dataPossibleToPersist));
  }

  public ngDoCheck(): void {
    if (this.isDataCollectingActive) {
      this.saveReceivedData();
    }
  }

  public updateDataToPersist(
    key: string,
    value: unknown,
    isPresent: boolean
  ): void {
    if (isPresent) {
      this.dataToPersist[key] = value as TExchangeData[keyof TExchangeData];
    } else {
      delete this.dataToPersist[key];
    }
  }

  public downloadJson(): void {
    const data = JSON.stringify(this.collectedData);
    const url = URL.createObjectURL(
      new Blob([data], { type: 'application/json' })
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.gameName}_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  //

  private saveReceivedData(): void {
    const newData = JSON.parse(JSON.stringify(this.dataToPersist));
    for (const key in newData) {
      newData[key] = this.dataPossibleToPersist[key];
    }
    if (JSON.stringify(newData) !== JSON.stringify(this.dataToPersist)) {
      //autodelete duplicates
      this.collectedData.push(newData);
      this.dataToPersist = newData;
    }
  }
}
