import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  `,
})
export class PongGameWindowComponent
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit
{
  private _paddleHeight = 100;
  private _paddleWidth = 10;
  private _paddleJump = 20;
  private _canvas!: HTMLCanvasElement;

  public override game!: Pong;

  public override ngOnInit(): void {
    super.ngOnInit();
    this.game = this.abstractGame as Pong;
  }

  public ngAfterViewInit(): void {
    this._canvas = this.gameCanvas.canvasElement.nativeElement;

    this.game.leftPadleY = (this._canvas.height - this._paddleHeight) / 2;
    this.game.rightPadleY = (this._canvas.height - this._paddleHeight) / 2;

    window.addEventListener('keydown', event => this.onKeyDown(event));
    window.addEventListener('keyup', event => this.onKeyUp(event));

    this.animate();
  }

  public override restart(): void {
    this.game = new Pong('pong', PongGameWindowComponent);
  }

  private onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'w':
        this.game.leftPaddleSpeed = -this._paddleJump;
        break;
      case 's':
        this.game.leftPaddleSpeed = this._paddleJump;
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.game.rightPaddleSpeed = -this._paddleJump;
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.game.rightPaddleSpeed = this._paddleJump;
        break;
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    switch (event.key) {
      case 'w':
      case 's':
        this.game.leftPaddleSpeed = 0;
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        this.game.rightPaddleSpeed = 0;
        break;
    }
  }

  private animate(): void {
    this.game.rightPadleY = Math.max(
      0,
      Math.min(
        this._canvas.height - this._paddleHeight,
        this.game.rightPadleY + this.game.rightPaddleSpeed
      )
    );

    this.game.leftPadleY = Math.max(
      0,
      Math.min(
        this._canvas.height - this._paddleHeight,
        this.game.leftPadleY + this.game.leftPaddleSpeed
      )
    );

    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  private draw(): void {
    const context = this._canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, this._canvas.width, this._canvas.height);
      context.fillStyle = 'red';
      context.fillRect(
        10,
        this.game.leftPadleY,
        this._paddleWidth,
        this._paddleHeight
      );
      context.fillRect(
        this._canvas.width - 20,
        this.game.rightPadleY,
        this._paddleWidth,
        this._paddleHeight
      );
    }
  }
}
