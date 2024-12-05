import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { IRecordedGameResponse } from 'app/shared/models/endpoints/recorded-game.models';
import { LoadingSpinnerComponent } from 'app/shared/components/common/loading-spinner.component';

@Component({
  selector: 'app-recorded-game-table',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    @if (isLoading) {
      <app-loading-spinner />
    } @else {
      @if (recordedGamesData && recordedGamesData.length > 0) {
        <div
          class="flex flex-col min-w-[44rem] w-full justify-around space-y-0 font-mono">
          <div
            class="flex flex-row space-x-4 justify-between bg-mainGray text-mainOrange text-sm xs:text-base font-bold px-4 py-2">
            <span class="flex justify-center w-[5%]">No.</span>
            <span class="flex justify-center w-2/12">Game name</span>
            <span class="flex justify-center w-3/12">Game start date</span>
            <div
              class="flex flex-row gap-x-1 items-center justify-center w-3/12">
              <button (click)="setSortingBy('Ended')">Game end date</button>
              @if (sortBy === 'Ended') {
                <span
                  class="ease-in-out duration-150 transition-all {{
                    sortDirection === 'Desc' ? 'rotate-180' : ''
                  }}">
                  <i data-feather="chevron-down" class="size-4 "></i>
                </span>
              } @else {
                <span>
                  <i data-feather="minus" class="size-4 "></i>
                </span>
              }
            </div>
            <button
              class="flex flex-row gap-x-1 items-center justify-center w-1/12">
              <button (click)="setSortingBy('SizeMb')">Size</button>
              @if (sortBy === 'SizeMb') {
                <span
                  class="ease-in-out duration-150 transition-all {{
                    sortDirection === 'Desc' ? 'rotate-180' : ''
                  }}">
                  <i data-feather="chevron-down" class="size-4 "></i>
                </span>
              } @else {
                <span>
                  <i data-feather="minus" class="size-4 "></i>
                </span>
              }
            </button>
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
    }
  `,
})
export class RecordedGameTableComponent {
  @Input({ required: true }) public recordedGamesData:
    | IRecordedGameResponse[]
    | null = null;
  @Input({ required: true }) public isLoading = false;
  @Output() public downloadEmitter = new EventEmitter<number>();
  @Output() public deleteEmitter = new EventEmitter<number>();
  @Output() public sortByEmitter = new EventEmitter<'Ended' | 'SizeMb'>();
  @Output() public sortDirectionEmitter = new EventEmitter<'Asc' | 'Desc'>();

  public sortBy: 'Ended' | 'SizeMb' = 'Ended';
  public sortDirection: 'Asc' | 'Desc' = 'Asc';

  public setSortingBy(value: 'Ended' | 'SizeMb'): void {
    if (this.sortBy === value && this.sortDirection === 'Asc') {
      this.sortDirection = 'Desc';
    } else {
      this.sortDirection = 'Asc';
    }
    this.sortBy = value;
    this.sortByEmitter.emit(this.sortBy);
    this.sortDirectionEmitter.emit(this.sortDirection);
  }
}
