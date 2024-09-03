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
      <div>P1 Move: {{ players[0].inputData['move'] }}</div>
      <div>P2 Move: {{ players[1].inputData['move'] }}</div>
    </div>
    <app-canvas #gameCanvas></app-canvas>
    <button (click)="draw()">Draw Something</button>
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

  public draw(): void {
    const canvas = this.gameCanvas.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = 'red';
      context.fillRect(10, 10, 100, 100);
    }
  }
}
