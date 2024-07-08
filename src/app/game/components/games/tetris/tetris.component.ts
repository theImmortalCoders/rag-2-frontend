import { Component } from '@angular/core';
import { TExchangeData } from '../../../models/exchange-data.type';
import { BaseGameWindowComponent } from '../models/base-game.component';

@Component({
  selector: 'app-tetris',
  standalone: true,
  template: ` retris`,
  styles: ``,
})
export class TetrisGameWindowComponent extends BaseGameWindowComponent {
  public override gameWindowOutputData: TExchangeData = {};
}
