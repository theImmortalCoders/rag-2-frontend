import { Component } from '@angular/core';
import { BaseGameWindowComponent } from '../base-game.component';
import { CanvasComponent } from '../../components/canvas/canvas.component';

@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [CanvasComponent],
  template: `
    <div class="w-2/3 pb-4 text-sm">
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
      <div>P1 Move: {{ players[0].inputData['move'] }}</div>
      <div>P2 Move: {{ players[1].inputData['move'] }}</div>
    </div>
    <app-canvas #gameCanvas [width]="1000" [height]="600"></app-canvas>
    <button (click)="gameCanvas.drawSomething()">Draw Something</button>
  `,
})
export class PongGameWindowComponent extends BaseGameWindowComponent {
  public defaultText = 'PONG';

  public override restart(): void {
    this.gameStateData['text'] = this.defaultText;
    this.gameStateData['text2'] = this.defaultText + '2';

    this.players[0].inputData = {
      move: 0,
    };
    this.players[0].expectedDataDescription =
      'Value of {-1, 0, 1}, -1: down, 0: stop, 1: up';
    this.players[1].inputData = {
      move: 0,
    };
    this.players[1].expectedDataDescription =
      'Value of {-1, 0, 1}, -1: down, 0: stop, 1: up';

    this.emitOutputData();
  }

  public updateOutputData1(value: string): void {
    this.gameStateData['text'] = value;
    this.emitOutputData();
  }

  public updateOutputData2(value: string): void {
    this.gameStateData['text2'] = value;
    this.emitOutputData();
  }
}
