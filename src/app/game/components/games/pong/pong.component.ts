import { Component } from '@angular/core';
import { TExchangeData } from '../../../models/exchange-data.type';
import { BaseGameWindowComponent } from '../models/base-game.component';

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
      (input)="updateOutputData1(inputElement1.value, true)" />
    <input
      class="w-full h-10 border-2 border-gray-300 rounded-lg p-2"
      #inputElement2
      type="text"
      [value]="defaultText + '2'"
      (input)="updateOutputData2(inputElement2.value, false)" />
    <div>Ai input: {{ score }}</div>
  `,
})
export class PongGameWindowComponent extends BaseGameWindowComponent {
  public score = 0;
  public defaultText = 'PONG';

  protected override gameWindowOutputData: TExchangeData = {
    text: this.defaultText,
    text2: this.defaultText + '2',
    score: this.score,
  };
  protected override gameWindowInputData: TExchangeData = {
    score: this.score,
  };

  public override set onGameWindowInputChange(value: TExchangeData) {
    this.score = (value['aiMove'] as number) | 0;
    this.gameWindowInputData['score'] = this.score;
    this.gameWindowOutputData['score'] = this.score;
    this.emitOutputData();
  }

  public updateOutputData1(value: string, trigger: boolean): void {
    this.gameWindowOutputData['text'] = value;
    this.emitOutputData();
    if (trigger) {
      this.emitInputTriggerData();
    }
  }

  public updateOutputData2(value: string, trigger: boolean): void {
    this.gameWindowOutputData['text2'] = value;
    this.emitOutputData();
    if (trigger) {
      this.emitInputTriggerData();
    }
  }
}
