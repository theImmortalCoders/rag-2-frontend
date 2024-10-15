import { KeyValuePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExchangeDataPipe } from '@utils/pipes/exchange-data.pipe';
import { TExchangeData } from '@gameModels/exchange-data.type';

@Component({
  selector: 'app-console-fieldset',
  standalone: true,
  imports: [KeyValuePipe, ExchangeDataPipe],
  template: `
    <!-- <div class="ml-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      @for (data of logData | keyvalue; track data.key) {
        <div
          class="p-2 border rounded-lg bg-gray-50
          }}">
          <span class="font-bold text-base xl:text-lg font-mono">
            {{ data.key }}:
          </span>

          @if (isTLogData(data.value)) {
            <app-console-fieldset
              [logData]="data.value | exchange_data"></app-console-fieldset>
          } @else {
            <span class="ml-2 text-sm xl:text-base text-mainCreme">
              {{ data.value }}
            </span>
          }
        </div>
      }
    </div> -->
    @for (data of logData | keyvalue; track data.key) {
      <div
        class="p-2 border rounded-lg bg-gray-50
          }}">
        <span class="font-bold text-base xl:text-lg font-mono">
          {{ data.key }}:
        </span>

        @if (isTLogData(data.value)) {
          <app-console-fieldset
            [logData]="data.value | exchange_data"></app-console-fieldset>
        } @else {
          <span class="ml-2 text-sm xl:text-base text-mainCreme">
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
