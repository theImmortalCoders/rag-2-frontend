import { Component, Input, OnInit } from '@angular/core';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { KeyValuePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSelectCheckboxComponent } from './components/data-select-checkbox/data-select-checkbox.component';
import { DataDownloadComponent } from './components/data-download/data-download.component';
import { UrlParamService } from 'app/shared/services/url-param.service';

@Component({
  selector: 'app-data-menu',
  standalone: true,
  imports: [KeyValuePipe, DataSelectCheckboxComponent, DataDownloadComponent],
  template: `
    <button
      (click)="toggleDataMenu()"
      class="side-menu-right-button top-40 w-12 h-64 {{
        isDataMenuVisible ? 'right-72' : 'right-0'
      }}">
      <span
        class="[writing-mode:vertical-rl] [text-orientation:upright] tracking-[0.45em]"
        >DATA</span
      >
    </button>
    <div
      class="w-72 h-64 overflow-y-auto p-5 bg-lightGray font-mono text-sm side-menu-container top-40 {{
        isDataMenuVisible ? 'right-0' : '-right-72'
      }}">
      <span class="font-black">Select data to persist:</span>
      @for (variable of dataPossibleToPersist | keyvalue; track variable.key) {
        <app-data-select-checkbox
          [variable]="variable"
          [isDataCollectingActive]="vIsDataCollectingActive.value"
          [dataToPersist]="dataToPersist"
          [updateDataToPersist]="updateDataToPersist" />
      }
      <span class="font-black mt-2 pt-2 border-t-[1px] border-mainOrange"
        >Data saving interval limit:</span
      >
      <input
        type="number"
        #dataSavingIntervalLimitInput
        class="custom-input w-52 mb-2"
        min="10"
        max="1000"
        step="10"
        [defaultValue]="dataSavingIntervalLimit"
        (change)="onIntervalLimitChange($event)" />
      <app-data-download
        [vIsDataCollectingActive]="vIsDataCollectingActive"
        [gameName]="gameName"
        [collectedDataArray]="collectedDataArray"
        (deleteCollectedDataArrayEmitter)="collectedDataArray = []" />
    </div>
  `,
})
export class DataMenuComponent implements OnInit {
  @Input({ required: true }) public gameName = '';
  @Input({ required: true }) public set setDataPossibleToPersist(
    value: TExchangeData
  ) {
    this.dataPossibleToPersist = value;
    if (this.vIsDataCollectingActive.value) {
      this.updateCollectedData();
    }
  }

  private _lastSavedTime = 0;

  public dataPossibleToPersist: TExchangeData = {};
  public dataToPersist: TExchangeData = {};
  public collectedDataArray: TExchangeData[] = [];
  public vIsDataCollectingActive = { value: false };
  public isDataMenuVisible = false;
  public dataSavingIntervalLimit = 100;

  public constructor(private _urlParamService: UrlParamService) {}

  public ngOnInit(): void {
    setTimeout(() => {
      this.dataToPersist = JSON.parse(
        JSON.stringify(this.dataPossibleToPersist)
      );
      this.updateDataToPersistFromURL();
      this._urlParamService.setQueryParam('outputSpec', 'false');
    }, 50);
  }

  public toggleDataMenu(): void {
    this.isDataMenuVisible = !this.isDataMenuVisible;
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

    this._urlParamService.setQueryParam(key, isPresent ? 'true' : 'false');
  };

  public onIntervalLimitChange = (event: Event): void => {
    this.dataSavingIntervalLimit = (
      event.target as HTMLInputElement
    ).valueAsNumber;
    this._urlParamService.setQueryParam(
      'dataSavingIntervalLimit',
      this.dataSavingIntervalLimit.toString()
    );
  };

  //

  private updateDataToPersistFromURL(): void {
    for (const key in this.dataPossibleToPersist) {
      this.updateDataToPersist(
        key,
        this.dataPossibleToPersist[key],
        this._urlParamService.getQueryParam(key) !== 'false'
      );
    }

    const intervalLimit = this._urlParamService.getQueryParam(
      'dataSavingIntervalLimit'
    ) as unknown as number;

    if (intervalLimit !== null) {
      this.dataSavingIntervalLimit = intervalLimit;
    } else {
      this._urlParamService.setQueryParam(
        'dataSavingIntervalLimit',
        this.dataSavingIntervalLimit.toString()
      );
    }
  }

  private updateCollectedData(): void {
    const newData = JSON.parse(JSON.stringify(this.dataToPersist));
    for (const key in newData) {
      newData[key] = this.dataPossibleToPersist[key];
    }
    if (
      JSON.stringify(newData) !== JSON.stringify(this.dataToPersist) &&
      Date.now() - this._lastSavedTime > this.dataSavingIntervalLimit
    ) {
      newData['timestamp'] = new Date().toLocaleString('pl-PL');
      this.dataToPersist = newData;
      this.collectedDataArray.push(this.dataToPersist);
      this._lastSavedTime = Date.now();
    }
  }
}
