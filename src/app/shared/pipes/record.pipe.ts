import { Pipe, PipeTransform } from '@angular/core';
import { TExchangeData } from '../../game/models/exchange-data.type';

@Pipe({
  name: 'record',
  standalone: true,
})
export class RecordPipe implements PipeTransform {
  public transform(value: unknown): Record<string, TExchangeData> {
    return value as Record<string, TExchangeData>;
  }
}
