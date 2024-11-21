import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IRecordedGameResponse } from 'app/shared/models/recorded-game.models';
import { LoadingSpinnerComponent } from '../../../shared/components/common/loading-spinner.component';

@Component({
  selector: 'app-recorded-game-table',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    @if (isEmptyTable(recordedGamesData)) {
      <app-loading-spinner />
    } @else {
      <div
        class="flex flex-col min-w-[44rem] w-full justify-around space-y-0 font-mono">
        <div
          class="flex flex-row space-x-4 justify-between bg-mainGray text-mainOrange text-sm xs:text-base font-bold px-4 py-2">
          <span class="flex justify-center w-[5%]">No.</span>
          <span class="flex justify-center w-2/12">Game name</span>
          <span class="flex justify-center w-3/12">Game start date</span>
          <span class="flex justify-center w-3/12">Game end date</span>
          <span class="flex justify-center w-1/12">Size</span>
          <span class="flex justify-center w-1/12">Download</span>
          <span class="flex justify-center w-1/12">Delete</span>
        </div>
        @for (recordedGame of recordedGamesData; track recordedGame.id) {
          <div
            class="flex flex-row space-x-4 justify-between px-4 py-2 text-mainCreme text-sm xs:text-base opacity-80 hover:opacity-100 {{
              $even ? 'bg-lightGray' : 'bg-darkGray'
            }}">
            <span class="flex justify-center w-[5%]">{{ $index + 1 }}.</span>
            <span class="flex justify-center w-2/12 uppercase">{{
              recordedGame.gameName
            }}</span>
            <span class="flex justify-center w-3/12">{{
              recordedGame.started | date: 'dd/MM/yyyy, HH:mm:ss'
            }}</span>
            <span class="flex justify-center w-3/12">{{
              recordedGame.ended | date: 'dd/MM/yyyy, HH:mm:ss'
            }}</span>
            <span class="flex justify-center w-1/12 text-nowrap">{{
              recordedGame.isEmptyRecord
                ? '-'
                : recordedGame.sizeMb.toPrecision(2) + ' MB'
            }}</span>
            @if (recordedGame.isEmptyRecord) {
              <span class="flex group justify-center w-1/12"> </span>
            } @else {
              <button
                class="flex group justify-center w-1/12"
                (click)="downloadEmitter.emit(recordedGame.id)">
                <i
                  data-feather="download"
                  class="text-mainCreme group-hover:text-green-500 size-4 xs:size-5"></i>
              </button>
            }
            <button
              class="flex group justify-center w-1/12"
              (click)="deleteEmitter.emit(recordedGame.id)">
              <i
                data-feather="x-square"
                class="text-mainCreme group-hover:text-red-500 size-4 xs:size-5"></i>
            </button>
          </div>
        }
      </div>
    }
  `,
})
export class RecordedGameTableComponent {
  @Input({ required: true }) public recordedGamesData!: IRecordedGameResponse[];
  @Output() public downloadEmitter = new EventEmitter<number>();
  @Output() public deleteEmitter = new EventEmitter<number>();

  public isEmptyTable(records: IRecordedGameResponse[]): boolean {
    return records.length === 0;
  }
}
