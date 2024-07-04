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

  public updateInputData(value: string): void {
    this.gameWindowOutputData['text'] = value;
    this.emit();
  }

  public update(): void {
    this.score++;
    this.gameWindowInputData['score'] = this.score;
    this.gameWindowOutputData['score'] = this.score;
    this.emit();
  }
}
