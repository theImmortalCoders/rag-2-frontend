import { Component, OnChanges, OnInit } from '@angular/core';
import { BaseGameWindowComponent } from '../base-game.component';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { Pong } from 'app/game/data/games';

@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [CanvasComponent],
  template: `
    <div class="w-2/3 pb-4 text-sm">
      PONG
      <div>P1 Move: {{ game.players[0].inputData['move'] }}</div>
      <div>P2 Move: {{ game.players[1].inputData['move'] }}</div>
    </div>
    <app-canvas #gameCanvas></app-canvas>
    <button (click)="draw()">Draw Something</button>
  `,
})
export class PongGameWindowComponent
  extends BaseGameWindowComponent
  implements OnInit
{
  public override ngOnInit(): void {
    super.ngOnInit();
    this.game = this.abstractGame as Pong;
  }

  public override restart(): void {
    this.game = new Pong('pong', PongGameWindowComponent);
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
