import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../../models/exchange-data.type';

@Component({
  selector: 'app-base-game-window',
  standalone: true,
  template: ` base-game-window`,
})
export class BaseGameWindowComponent implements OnInit {
  public gameWindowOutputData: TExchangeData = {};
  public gameWindowInputData: TExchangeData = {};

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
