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
      <div class="ml-4 overflow-y-auto">
        <span class="font-bold text-base xl:text-lg font-mono"
          >{{ data.key }}:</span
        >
        @if (isTLogData(data.value)) {
          <app-console-fieldset [logData]="data.value | exchange_data" />
        } @else {
          <span class="ml-2 text-sm xl:text-base text-mainCreme">{{
            data.value
          }}</span>
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
