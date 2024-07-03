import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../models/log-data.type';
import { ILoggableDataComponent } from '../../models/loggable-data-component';

@Component({
  selector: 'app-data-menu',
  standalone: true,
  imports: [],
  template: `
    <div class="border-2 border-solid border-red-600 p-5">data-menu works!</div>
  `,
})
export class DataMenuComponent implements OnInit, ILoggableDataComponent {
  @Output() public logDataEmitter = new EventEmitter<TExchangeData>();
  public logData: TExchangeData = {};

  public ngOnInit(): void {
    this.logDataEmitter.emit(this.logData);
  }
}
