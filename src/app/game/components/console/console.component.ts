import { Component, Input } from '@angular/core';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { TExchangeData } from '../../models/exchange-data.type';
import { RecordPipe } from '../../../shared/pipes/record.pipe';

@Component({
  selector: 'app-console',
  standalone: true,
  template: `
    @for (data of logData | keyvalue; track data.key) {
      <p class="ml-3">
        {{ data.key }}:
        @if (isTLogData(data.value)) {
          <app-console [logData]="data.value | record"></app-console>
        } @else {
          {{ data.value }}
        }
      </p>
    }
  `,
  imports: [JsonPipe, KeyValuePipe, RecordPipe],
})
export class ConsoleComponent {
  @Input({ required: true }) public logData: TExchangeData = {};

  public isTLogData(value: unknown): boolean {
    return value instanceof Object;
  }
}
