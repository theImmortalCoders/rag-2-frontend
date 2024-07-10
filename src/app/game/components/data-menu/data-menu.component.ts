import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { KeyValuePipe } from '@angular/common';
import { DataTransformService } from '../../../shared/services/data-transform.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataCollectingToggleButtonComponent } from './components/collect-toggle-button/collect-toggle-button.component';
import { DataSelectCheckboxComponent } from './components/data-select-checkbox/data-select-checkbox.component';

@Component({
  selector: 'app-data-menu',
  standalone: true,
  imports: [
    KeyValuePipe,
    DataCollectingToggleButtonComponent,
    DataSelectCheckboxComponent,
  ],
  template: `
    <div class="border-2 bg-white border-solid border-red-600 p-5">
      Select data to persist
      @for (variable of dataPossibleToPersist | keyvalue; track variable.key) {
        <app-data-select-checkbox
          [variable]="variable"
          [isDataCollectingActive]="vIsDataCollectingActive.value"
          [dataToPersist]="dataToPersist"
          [updateDataToPersist]="
            updateDataToPersist
          "></app-data-select-checkbox>
      }
      <div class="flex flex-col">
        <app-data-collecting-toggle-button
          [vIsDataCollectingActive]="
            vIsDataCollectingActive
          "></app-data-collecting-toggle-button>
        @if (collectedDataArray.length > 0 && !vIsDataCollectingActive.value) {
          <button #jsonDownloadButton (click)="generateCsv()">
            Download CSV ({{ collectedDataArray.length }} records)
          </button>
          <button (click)="deleteCollectedData()">X</button>
        }
      </div>
    </div>
  `,
})
export class DataMenuComponent implements OnInit {
  @Input({ required: true }) public gameName = '';
  public dataPossibleToPersist: TExchangeData = {};
  @Input({ required: true }) public set setDataPossibleToPersist(
    value: TExchangeData
  ) {
    this.dataPossibleToPersist = value;
    if (this.vIsDataCollectingActive.value) {
      this.updateCollectedData();
    }
  }
  @Output() public logDataEmitter = new EventEmitter<TExchangeData>();

  private _dataToPersistQueryParams: TExchangeData = {};

  public logData: TExchangeData = this._dataToPersistQueryParams;
  public dataToPersist: TExchangeData = {};
  public collectedDataArray: TExchangeData[] = [];
  public vIsDataCollectingActive = { value: false };

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

  public updateDataToPersist = (
    key: string,
    value: unknown,
    isPresent: boolean
  ): void => {
    if (isPresent) {
      this.dataToPersist[key] = value as TExchangeData[keyof TExchangeData];
    } else {
      delete this.dataToPersist[key];
    }

    this.updateURLByDataToPersist(key, isPresent);
  };

  public generateCsv(): void {
    const csvContent = this._dataTransformService.exchangeDataToCsv(
      this.collectedDataArray
    );
    this.downloadCsv(csvContent);
  }

  public deleteCollectedData(): void {
    this.collectedDataArray = [];
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
    delete this.dataToPersist['timestamp'];
    if (JSON.stringify(newData) !== JSON.stringify(this.dataToPersist)) {
      this.dataToPersist['timestamp'] = new Date().toISOString();
      this.dataToPersist = newData;
      this.collectedDataArray.push(this.dataToPersist);
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
