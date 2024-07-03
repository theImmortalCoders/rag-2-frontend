import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TLogData } from '../../models/log-data.type';
import { ILoggableDataComponent } from '../../models/loggable-data-component';

@Component({
  selector: 'app-data-menu',
  standalone: true,
  imports: [],
  template: `
    <div class="fixed right-0 top-20 border-2 border-solid border-red-600 p-5">
      data-menu works!
    </div>
  `,
})
export class DataMenuComponent implements OnInit, ILoggableDataComponent {
  @Output() public logDataEmitter = new EventEmitter<TLogData>();
  public logData: TLogData = {};

  public ngOnInit(): void {
    this.logDataEmitter.emit(this.logData);
  }
}
