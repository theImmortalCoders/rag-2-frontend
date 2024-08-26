import { Component } from '@angular/core';
import { BaseGameWindowComponent } from '../base-game.component';
import { TExchangeData } from '../../../models/exchange-data.type';

@Component({
  selector: 'app-tictactoe',
  standalone: true,
  imports: [],
  template: ` <button (click)="onClick()">Click</button>
    <div>{{ clicks }}</div>
    <div>{{ input }}</div>`,
})
export class TictactoeGameWindowComponent extends BaseGameWindowComponent {
  public input = 0;
  public clicks = 0;

  protected override gameWindowOutputData: TExchangeData = {
    clicks: this.clicks,
  };

  public onClick(): void {
    this.clicks++;
    this.gameWindowOutputData['clicks'] = this.clicks;
    this.emitOutputData();
  }

  public override set setSocketInputDataReceive(value: TExchangeData) {
    this.input = (value['input'] as number) | 0;
  }
}
