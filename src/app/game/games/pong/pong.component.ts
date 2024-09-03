import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BaseGameWindowComponent } from '../base-game.component';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { Pong } from 'app/game/data/games';
import { PlayerSourceType } from 'app/game/models/player-source-type.enum';

@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [CanvasComponent],
  template: ` <app-canvas #gameCanvas></app-canvas> `,
})
export class PongGameWindowComponent
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
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

    this.update();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    window.removeEventListener('keydown', event => this.onKeyDown(event));
    window.removeEventListener('keyup', event => this.onKeyUp(event));
  }

  public override restart(): void {
    this.game = new Pong('pong', PongGameWindowComponent);
    this.game.leftPadleY = (this._canvas.height - this._paddleHeight) / 2;
    this.game.rightPadleY = (this._canvas.height - this._paddleHeight) / 2;
  }

  //

  private update(): void {
    if (!this.isPaused) {
      this.updatePaddlesSpeeds();
      this.updatePaddlesPositions();
      this.render();
    }
    requestAnimationFrame(() => this.update());
  }

  private render(): void {
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

  private updatePaddlesSpeeds(): void {
    switch (this.game.players[0].inputData['move']) {
      case 1:
        this.game.leftPaddleSpeed = -this._paddleJump;
        break;
      case -1:
        this.game.leftPaddleSpeed = this._paddleJump;
        break;
      default:
        this.game.leftPaddleSpeed = 0;
        break;
    }
    switch (this.game.players[1].inputData['move']) {
      case 1:
        this.game.rightPaddleSpeed = -this._paddleJump;
        break;
      case -1:
        this.game.rightPaddleSpeed = this._paddleJump;
        break;
      default:
        this.game.rightPaddleSpeed = 0;
        break;
    }
  }

  private updatePaddlesPositions(): void {
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
  }

  private onKeyDown(event: KeyboardEvent): void {
    const player1 = this.game.players[0];
    const player2 = this.game.players[1];

    if (player1.getPlayerType === PlayerSourceType.KEYBOARD) {
      switch (event.key) {
        case 'w':
          player1.inputData['move'] = 1;
          break;
        case 's':
          player1.inputData['move'] = -1;
          break;
      }
    }

    if (player2.getPlayerType === PlayerSourceType.KEYBOARD) {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          player2.inputData['move'] = 1;
          break;
        case 'ArrowDown':
          event.preventDefault();
          player2.inputData['move'] = -1;
          break;
      }
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    const player1 = this.game.players[0];
    const player2 = this.game.players[1];

    if (player1.getPlayerType === PlayerSourceType.KEYBOARD) {
      switch (event.key) {
        case 'w':
        case 's':
          player1.inputData['move'] = 0;
          break;
      }
    }

    if (player2.getPlayerType === PlayerSourceType.KEYBOARD) {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          player2.inputData['move'] = 0;
          break;
      }
    }
  }
}
