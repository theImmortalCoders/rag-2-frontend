import { EventEmitter } from '@angular/core';
import { TExchangeData } from './exchange-data.type';

export interface ILoggableDataComponent {
  logDataEmitter: EventEmitter<TExchangeData>;
  logData: TExchangeData;
}
