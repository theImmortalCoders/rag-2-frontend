import { Component } from '@angular/core';
import { BaseGameWindowComponent } from '../base-game.component';
import { TExchangeData } from '../../../models/exchange-data.type';

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
      (input)="updateInputData(inputElement.value)" />
    <div>{{ score }}</div>
    <button (click)="update()">AI input</button>
  `,
})
export class PongGameWindowComponent extends BaseGameWindowComponent {
  public score = 0;
  public defaultText = 'PONG';

  public override gameWindowOutputData: TExchangeData = {
    text: this.defaultText,
    score: this.score,
  };
  public override gameWindowInputData: TExchangeData = {
    score: this.score,
  };
  public override gameWindowLogData = {
    output: this.gameWindowOutputData,
    input: this.gameWindowInputData,
  };

  public updateInputData(value: string): void {
    this.gameWindowLogData['output']['text'] = value;
  }

  public update(): void {
    this.score++;
    this.gameWindowLogData['input']['score'] = this.score;
    this.gameWindowLogData['output']['score'] = this.score;
  }
}
