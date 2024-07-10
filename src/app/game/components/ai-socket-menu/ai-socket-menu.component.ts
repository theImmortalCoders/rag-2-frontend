import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { ILoggableDataComponent } from '../../models/loggable-data-component';

@Component({
  selector: 'app-ai-socket-menu',
  standalone: true,
  imports: [],
  template: `
    <div class=" border-2 border-solid border-red-600 p-5">
      ai-socket-menu works!
    </div>
  `,
})
export class AiSocketMenuComponent implements OnInit, ILoggableDataComponent {
  @Output() public logDataEmitter = new EventEmitter<TExchangeData>();
  public logData: TExchangeData = {};

  public ngOnInit(): void {
    this.logDataEmitter.emit(this.logData);
  }
}
