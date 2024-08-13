import { Component, Input } from '@angular/core';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { TExchangeData } from '../../models/exchange-data.type';
import { ExchangeDataPipe } from '@utils/pipes/exchange-data.pipe';

@Component({
  selector: 'app-console',
  standalone: true,
  template: `
    @for (data of logData | keyvalue; track data.key) {
      <div class="ml-4 max-w-60 lg:max-w-72 overflow-y-auto">
        <span class="font-bold text-base xl:text-lg font-mono"
          >{{ data.key }}:</span
        >
        @if (isTLogData(data.value)) {
          <app-console [logData]="data.value | exchange_data" />
        } @else {
          <span class="ml-2 text-sm xl:text-base text-mainCreme">{{
            data.value
          }}</span>
        }
      </div>
    }
  `,
  imports: [KeyValuePipe, ExchangeDataPipe],
})
export class ConsoleComponent {
  @Input({ required: true }) public logData: TExchangeData = {};

  public isTLogData(value: unknown): boolean {
    return value instanceof Object;
  }
}
