import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../../models/exchange-data.type';

@Component({
  selector: 'app-base-game-window',
  standalone: true,
  template: ` base-game-window`,
})
export class BaseGameWindowComponent implements OnInit {
  protected gameWindowOutputData: TExchangeData = {};
  protected gameWindowInputData: TExchangeData = {};
  protected gameWindowInputTriggerData: TExchangeData = {};

  @Input() public set socketInputData(value: TExchangeData) {
    this.emitOutputData();
  }

  @Output() public gameWindowOutputDataEmitter =
    new EventEmitter<TExchangeData>();
  @Output() public gameWindowInputTriggerDataEmitter =
    new EventEmitter<TExchangeData>();

  public ngOnInit(): void {
    this.emitOutputData();
  }

  protected emitOutputData(): void {
    this.gameWindowOutputDataEmitter.emit({
      output: this.gameWindowOutputData,
      input: this.gameWindowInputData,
    });
  }

  protected emitInputTriggerData(): void {
    this.gameWindowInputTriggerDataEmitter.emit(
      this.gameWindowInputTriggerData
    );
  }
}
