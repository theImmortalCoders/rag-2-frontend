import { KeyValuePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExchangeDataPipe } from '@utils/pipes/exchange-data.pipe';
import { TExchangeData } from '@gameModels/exchange-data.type';

@Component({
  selector: 'app-console-fieldset',
  standalone: true,
  imports: [KeyValuePipe, ExchangeDataPipe],
  template: `
    @for (data of logData | keyvalue; track data.key) {
      <div class="my-0 ml-8 mr-2 pl-2 py-1 border-l-[1px] border-mainOrange">
        <span class="font-bold text-base xl:text-lg font-mono relative -top-2">
          {{ data.key }}:
        </span>

        @if (isTLogData(data.value)) {
          <app-console-fieldset
            [logData]="data.value | exchange_data"></app-console-fieldset>
        } @else {
          <span class="text-sm xl:text-base text-mainCreme relative -top-2">
            {{ data.value }}
          </span>
        }
      </div>
    }
  `,
})
export class ConsoleFieldsetComponent {
  @Input({ required: true }) public logData: TExchangeData = {};

  public isTLogData(value: unknown): boolean {
    return value instanceof Object;
  }
}
