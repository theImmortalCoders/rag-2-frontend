import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';

@Component({
  selector: 'app-base-game-window',
  standalone: true,
  template: ``,
})
export abstract class BaseGameWindowComponent implements OnInit {
  protected gameWindowOutputData: TExchangeData = {};
  protected gameWindowInputData: TExchangeData = {};

  //called when received data from socket
  @Input() public set setSocketInputDataReceive(value: TExchangeData) {
    this.emitOutputData();
  }

  @Output() public gameWindowOutputDataEmitter =
    new EventEmitter<TExchangeData>();

  public ngOnInit(): void {
    this.emitOutputData();
  }

  //send data to data menu and socket menu
  protected emitOutputData(): void {
    this.gameWindowOutputDataEmitter.emit({
      output: this.gameWindowOutputData,
      input: this.gameWindowInputData,
    });
  }
}
