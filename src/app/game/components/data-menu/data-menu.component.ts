import { Component, Input, OnInit } from '@angular/core';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { KeyValuePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSelectCheckboxComponent } from './sections/data-select-checkbox/data-select-checkbox.component';
import { DataDownloadComponent } from './sections/data-download/data-download.component';
import { UrlParamService } from 'app/shared/services/url-param.service';
import { Game } from '@gameModels/game.class';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-data-menu',
  standalone: true,
  imports: [KeyValuePipe, DataSelectCheckboxComponent, DataDownloadComponent],
  template: `
    <button
      (click)="toggleDataMenu()"
      class="side-menu-right-button top-44 w-12 h-72 {{
        isDataMenuVisible ? 'right-72' : 'right-0'
      }}">
      <span
        class="[writing-mode:vertical-rl] [text-orientation:upright] tracking-[0.45em]"
        >DATA</span
      >
    </button>
    <div
      class="w-72 h-72 overflow-y-auto p-5 bg-lightGray font-mono text-sm side-menu-container top-44 {{
        isDataMenuVisible ? 'right-0' : '-right-72'
      }}">
      <span class="font-bold text-mainCreme">Select data to persist:</span>
      @for (variable of dataPossibleToPersist | keyvalue; track variable.key) {
        <app-data-select-checkbox
          [variable]="variable"
          [isDataCollectingActive]="isDataCollectingActive"
          [dataToPersist]="dataToPersist"
          [updateDataToPersist]="updateDataToPersist" />
      }
      <span
        class="font-bold text-mainCreme mt-3 pt-3 pb-1 border-t-[1px] border-mainOrange"
        >Data saving interval limit:</span
      >
      <input
        type="number"
        #dataSavingIntervalLimitInput
        class="custom-input w-full mb-2"
        min="10"
        max="1000"
        step="10"
        [defaultValue]="dataSavingIntervalLimit"
        (change)="onIntervalLimitChange($event)" />
      <app-data-download
        (collectingActiveEmitter)="isDataCollectingActive = $event"
        [game]="game"
        [collectedDataArray]="collectedDataArray"
        (deleteCollectedDataArrayEmitter)="collectedDataArray = []" />
    </div>
  `,
})
export class DataMenuComponent implements OnInit {
  @Input({ required: true }) public game!: Game;
  @Input({ required: true }) public gamePause = new Observable<boolean>();
  @Input({ required: true }) public set setDataPossibleToPersist(
    value: TExchangeData
  ) {
    this.dataPossibleToPersist = value;
    if (this.isDataCollectingActive) {
      this.updateCollectedData();
    }
  }

  private _lastSavedTime = 0;
  private _pauseSubscription = new Subscription();
  private isPaused = false;
  public dataPossibleToPersist: TExchangeData = {};
  public dataToPersist: TExchangeData = {};
  public collectedDataArray: TExchangeData[] = [];
  public isDataCollectingActive = false;
  public isDataMenuVisible = false;
  public dataSavingIntervalLimit = 100;

  public constructor(private _urlParamService: UrlParamService) {}

  public ngOnInit(): void {
    this._pauseSubscription = this.gamePause.subscribe(
      isPaused => (this.isPaused = isPaused)
    );
    setTimeout(() => {
      this.dataToPersist = JSON.parse(
        JSON.stringify(this.dataPossibleToPersist)
      );

      this.updateDataToPersistFromURL();
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
      Date.now() - this._lastSavedTime > this.dataSavingIntervalLimit &&
      !this.isPaused
    ) {
      newData['timestamp'] = new Date().toLocaleString('pl-PL');
      this.dataToPersist = newData;
      this.collectedDataArray.push(this.dataToPersist);
      this._lastSavedTime = Date.now();
    }
  }
}
