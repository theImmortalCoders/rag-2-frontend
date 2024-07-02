import { Component, Input } from '@angular/core';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { TLogData } from '../../models/log-data.type';

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [JsonPipe, KeyValuePipe],
  template: `
    <p
      class="fixed bottom-0 p-10 bg-white border-y-red-600 border-solid border-2 left-0 w-full z-50">
      @for (record of logData | keyvalue; track record.key) {
        <p>{{ record.key }}</p>
        @for (data of record.value | keyvalue; track data.key) {
          <p class="ml-3">{{ data.key }}: {{ data.value }}</p>
        }
      }
    </p>
  `,
})
export class ConsoleComponent {
  @Input({ required: true }) public logData: Record<string, TLogData> = {};
}
