import { EventEmitter, Output } from '@angular/core';
import { TExchangeData } from './log-data.type';

export interface ILoggableDataComponent {
  logDataEmitter: EventEmitter<TExchangeData>;
  logData: TExchangeData;
}
