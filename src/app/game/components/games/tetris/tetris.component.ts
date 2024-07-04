import { Component } from '@angular/core';
import { TExchangeData } from '../../../models/exchange-data.type';
import { IBaseGameWindowComponent } from '../models/base-game-component';

@Component({
  selector: 'app-tetris',
  standalone: true,
  template: ` retris`,
  styles: ``,
})
export class TetrisGameWindowComponent implements IBaseGameWindowComponent {
  public gameWindowLogData: Record<string, TExchangeData> = {};
  public gameWindowOutputData: TExchangeData = {};
  public gameWindowInputData: TExchangeData = {};
}
