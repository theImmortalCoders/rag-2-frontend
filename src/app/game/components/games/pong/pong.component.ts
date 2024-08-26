import { Component, OnInit } from '@angular/core';
import { TExchangeData } from '../../../models/exchange-data.type';
import { BaseGameWindowComponent } from '../base-game.component';

@Component({
  selector: 'app-pong',
  standalone: true,
  template: `
    PONG
    <input
      class="w-full h-10 border-2 border-gray-300 rounded-lg p-2"
      #inputElement1
      type="text"
      [value]="defaultText"
      (input)="updateOutputData1(inputElement1.value)" />
    <input
      class="w-full h-10 border-2 border-gray-300 rounded-lg p-2"
      #inputElement2
      type="text"
      [value]="defaultText + '2'"
      (input)="updateOutputData2(inputElement2.value)" />
    <div>Ai input: {{ p1Move }}</div>
  `,
})
export class PongGameWindowComponent
  extends BaseGameWindowComponent
  implements OnInit
{
  public p1Move = 0;
  public defaultText = 'PONG';

  public override ngOnInit(): void {
    this.emitOutputData();
    // this.players[0].inputData = {
    //   p1Move: 0,
    // };
  }

  protected override gameWindowOutputData: TExchangeData = {
    text: this.defaultText,
    text2: this.defaultText + '2',
    score: this.p1Move,
  };

  public override set setSocketInputDataReceive(value: TExchangeData) {
    this.p1Move = (value['p1Move'] as number) | 0;
    this.gameWindowOutputData['p1Move'] = this.p1Move;
    this.emitOutputData();
  }

  public updateOutputData1(value: string): void {
    this.gameWindowOutputData['text'] = value;
    this.emitOutputData();
  }

  public updateOutputData2(value: string): void {
    this.gameWindowOutputData['text2'] = value;
    this.emitOutputData();
  }
}
