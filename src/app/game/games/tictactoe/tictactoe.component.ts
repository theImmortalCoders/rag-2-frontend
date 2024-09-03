import { Component } from '@angular/core';
import { BaseGameWindowComponent } from '../base-game.component';
import { TExchangeData } from '../../models/exchange-data.type';

@Component({
  selector: 'app-tictactoe',
  standalone: true,
  imports: [],
  template: ` <button (click)="onClick()">Click</button>
    <div>{{ clicks }}</div>
    <div>{{ input }}</div>`,
})
export class TictactoeGameWindowComponent extends BaseGameWindowComponent {
  public override restart(): void {
    console.log('reset');
  }
  public input = 0;
  public clicks = 0;

  public onClick(): void {
    this.clicks++;
  }

  public override set setSocketInputDataReceive(value: TExchangeData) {
    this.input = (value['input'] as number) | 0;
  }
}
