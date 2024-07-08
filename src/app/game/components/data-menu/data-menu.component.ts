import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { KeyValuePipe } from '@angular/common';
import { DataTransformService } from '../../../shared/services/data-transform.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-data-menu',
  standalone: true,
  imports: [KeyValuePipe],
  template: `
    <div class="border-2 bg-white border-solid border-red-600 p-5">
      Select data to persist
      @for (variable of dataPossibleToPersist | keyvalue; track variable.key) {
        <span class="flex gap-2">
          @if (variable.key && variable.key !== '1') {
            <p>{{ variable.key }}</p>
          }
          <input
            #dataInput
            [attr.disabled]="isDataCollectingActive ? 'disabled' : null"
            type="checkbox"
            [defaultChecked]="true"
            [checked]="isKeyInDataToPersist(variable.key)"
            (change)="
              updateDataToPersist(
                variable.key,
                variable.value,
                dataInput.checked
              )
            " />
        </span>
      }
      <div class="flex flex-col">
        <button
          #dataCollectingButton
          (click)="isDataCollectingActive = !isDataCollectingActive">
          @if (!isDataCollectingActive) {
            Start collecting data
          } @else {
            Stop collecting data
          }
        </button>
        @if (collectedDataArray.length > 0 && !isDataCollectingActive) {
          <button #jsonDownloadButton (click)="generateCsv()">
            Download CSV ({{ collectedDataArray.length }} records)
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

  private _dataToPersistQueryParams: TExchangeData = {};

  public logData: TExchangeData = this._dataToPersistQueryParams;
  public dataToPersist: TExchangeData = {};
  public collectedDataArray: TExchangeData[] = [];
  public isDataCollectingActive = false;

  public constructor(
    private _dataTransformService: DataTransformService,
    private _route$: ActivatedRoute,
    private _router: Router
  ) {}

  public ngOnInit(): void {
    this.logDataEmitter.emit(this.logData);
    this.dataToPersist = JSON.parse(JSON.stringify(this.dataPossibleToPersist));

    this.updateDataToPersistFromURL();
  }

  public ngDoCheck(): void {
    if (this.isDataCollectingActive) {
      this.updateCollectedData();
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

    this.updateURLByDataToPersist(key, isPresent);
  }

  public generateCsv(): void {
    const csvContent = this._dataTransformService.exchangeDataToCsv(
      this.collectedDataArray
    );
    this.downloadCsv(csvContent);
  }

  public isKeyInDataToPersist(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.dataToPersist, key);
  }

  //

  private updateDataToPersistFromURL(): void {
    this._route$.queryParams.subscribe(params => {
      for (const key in this.dataPossibleToPersist) {
        this.updateDataToPersist(
          key,
          this.dataPossibleToPersist[key],
          params[key] !== 'false'
        );
      }
    });
  }

  private updateCollectedData(): void {
    const newData = JSON.parse(JSON.stringify(this.dataToPersist));
    for (const key in newData) {
      newData[key] = this.dataPossibleToPersist[key];
    }
    if (JSON.stringify(newData) !== JSON.stringify(this.dataToPersist)) {
      this.collectedDataArray.push(newData);
      this.dataToPersist = newData;
      this.dataToPersist['timestamp'] = new Date().toISOString();
    }
  }

  private downloadCsv(csv: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute(
      'download',
      `${this.gameName}_${new Date().toISOString()}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private updateURLByDataToPersist(key: string, isPresent: boolean): void {
    this._dataToPersistQueryParams[key] = isPresent;
    this._router.navigate([], {
      queryParams: this._dataToPersistQueryParams,
    });
  }
}
