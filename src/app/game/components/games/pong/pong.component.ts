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
      #inputElement
      type="text"
      [value]="defaultText"
      (input)="updateOutputData(inputElement.value)" />
    <div>Ai input: {{ score }}</div>
  `,
})
export class PongGameWindowComponent extends BaseGameWindowComponent {
  public score = 0;
  public defaultText = 'PONG';

  protected override gameWindowOutputData: TExchangeData = {
    text: this.defaultText,
    score: this.score,
  };
  protected override gameWindowInputData: TExchangeData = {
    score: this.score,
  };

  public override set setGameWindowInput(value: TExchangeData) {
    this.score = (value['aiMove'] as number) | 0;
    this.gameWindowInputData['score'] = this.score;
    this.gameWindowOutputData['score'] = this.score;
    this.emit();
  }

  public updateOutputData(value: string): void {
    this.gameWindowOutputData['text'] = value;
    this.emit();
  }
}
