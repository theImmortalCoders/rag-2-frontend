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

  @Input() public set setGameWindowInput(value: TExchangeData) {
    this.emit();
  }

  @Output() public gameWindowOutputDataEmitter =
    new EventEmitter<TExchangeData>();

  public ngOnInit(): void {
    this.emit();
  }

  protected emit(): void {
    this.gameWindowOutputDataEmitter.emit({
      output: this.gameWindowOutputData,
      input: this.gameWindowInputData,
    });
  }
}
