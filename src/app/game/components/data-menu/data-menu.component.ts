import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { ILoggableDataComponent } from '../../models/loggable-data-component';
import { AsyncPipe, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-data-menu',
  standalone: true,
  imports: [KeyValuePipe, AsyncPipe],
  template: `
    <div class="border-2 border-solid border-red-600 p-5">
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
      <button (click)="downloadJson()">Download JSON</button>
    </div>
  `,
})
export class DataMenuComponent implements OnInit {
  @Input({ required: true }) public gameName = '';
  @Input({ required: true }) public dataPossibleToPersist: TExchangeData = {};
  @Output() public logDataEmitter = new EventEmitter<TExchangeData>();
  public logData: TExchangeData = { menu: 'menu' };
  public dataToPersist: TExchangeData = {};

  public ngOnInit(): void {
    this.logDataEmitter.emit(this.logData);
    this.dataToPersist = { ...this.dataPossibleToPersist };
    console.log(this.dataPossibleToPersist);
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
    const data = JSON.stringify(this.dataToPersist);
    const url = URL.createObjectURL(
      new Blob([data], { type: 'application/json' })
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.gameName}_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
