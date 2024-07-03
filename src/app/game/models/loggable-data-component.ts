import { EventEmitter, Output } from '@angular/core';
import { TLogData } from './log-data.type';

export interface ILoggableDataComponent {
  logDataEmitter: EventEmitter<TLogData>;
  logData: TLogData;
}
