import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BaseGameWindowComponent } from '../base-game.component';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { Pong } from 'app/game/data/games';
import { PlayerSourceType } from 'app/game/models/player-source-type.enum';

@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [CanvasComponent],
  template: `<div>{{ game.scoreLeft }}:{{ game.scoreRight }}</div>
    <app-canvas #gameCanvas></app-canvas> `,
})
export class PongGameWindowComponent
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _paddleHeight = 150;
  private _paddleWidth = 10;
  private _paddleJump = 20;
  private _ballInitialSpeed = 7;
  private _canvas!: HTMLCanvasElement;

  public override game!: Pong;

  public override ngOnInit(): void {
    super.ngOnInit();
    this.game = this.abstractGame as Pong;
  }

  public ngAfterViewInit(): void {
    this._canvas = this.gameCanvas.canvasElement.nativeElement;

    window.addEventListener('keydown', event => this.onKeyDown(event));
    window.addEventListener('keyup', event => this.onKeyUp(event));

    this.resetPaddlesAndBall();
    this.update();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    window.removeEventListener('keydown', event => this.onKeyDown(event));
    window.removeEventListener('keyup', event => this.onKeyUp(event));
  }

  public override restart(): void {
    this.game = new Pong('pong', PongGameWindowComponent);
    this.resetPaddlesAndBall();
  }

  //

  private update(): void {
    if (!this.isPaused) {
      this.updatePaddlesSpeeds();
      this.updatePaddlesPositions();
      this.updateBallPosition();
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
        0,
        this.game.leftPadleY,
        this._paddleWidth,
        this._paddleHeight
      );
      context.fillRect(
        this._canvas.width - 10,
        this.game.rightPadleY,
        this._paddleWidth,
        this._paddleHeight
      );
      context.beginPath();
      context.arc(
        this.game.ballX,
        this.game.ballY,
        this._paddleWidth,
        0,
        2 * Math.PI
      );
      context.fillStyle = 'blue';
      context.fill();
    }
  }

  private resetPaddlesAndBall(): void {
    this.game.leftPadleY = (this._canvas.height - this._paddleHeight) / 2;
    this.game.rightPadleY = (this._canvas.height - this._paddleHeight) / 2;
    this.game.ballX = this._canvas.width / 2;
    this.game.ballY = this._canvas.height / 2;
  }

  private updateBallPosition(): void {
    this.game.ballX += this.game.ballSpeedX;
    this.game.ballY += this.game.ballSpeedY;

    if (this.game.ballSpeedX === 0 && this.game.ballSpeedY === 0) {
      this.initializeBallSpeed();
    }

    this.checkCollisionWithWalls();
    this.checkCollisionWithPaddles();

    if (this.game.ballX <= 0 - this._paddleWidth) {
      this.resetPaddlesAndBall();
      this.game.scoreRight++;
    }
    if (this.game.ballX >= this._canvas.width + this._paddleWidth) {
      this.resetPaddlesAndBall();
      this.game.scoreLeft++;
    }
  }

  private checkCollisionWithWalls(): void {
    if (
      this.game.ballY <= 0 + this._paddleWidth ||
      this.game.ballY >= this._canvas.height - this._paddleWidth
    ) {
      this.game.ballSpeedY = -this.game.ballSpeedY;
    }
  }

  private checkCollisionWithPaddles(): void {
    if (
      this.game.ballX <= this._paddleWidth * 2 &&
      this.game.ballY >= this.game.leftPadleY &&
      this.game.ballY <= this.game.leftPadleY + this._paddleHeight
    ) {
      this.game.ballSpeedX = -this.game.ballSpeedX;
    }

    if (
      this.game.ballX >= this._canvas.width - 2 * this._paddleWidth &&
      this.game.ballY >= this.game.rightPadleY &&
      this.game.ballY <= this.game.rightPadleY + this._paddleHeight
    ) {
      this.game.ballSpeedX = -this.game.ballSpeedX;
    }
  }

  private initializeBallSpeed(): void {
    this.game.ballSpeedX =
      this.random(0, 1) === 0
        ? this._ballInitialSpeed
        : -this._ballInitialSpeed;
    this.game.ballSpeedY =
      this.random(0, 1) === 0
        ? this._ballInitialSpeed
        : -this._ballInitialSpeed;
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
