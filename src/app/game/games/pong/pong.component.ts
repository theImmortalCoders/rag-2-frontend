/* eslint-disable complexity */
/* eslint-disable max-lines */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { PlayerSourceType } from 'app/game/models/player-source-type.enum';
import { BaseGameWindowComponent } from '../base-game.component';
import { Pong } from '../models/pong.class';

@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [CanvasComponent],
  template: `<div>{{ game.state.scoreLeft }}:{{ game.state.scoreRight }}</div>
    <app-canvas #gameCanvas></app-canvas> `,
})
export class PongGameWindowComponent
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _paddleHeight = 150;
  private _paddleWidth = 10;
  private _paddleJump = 20;
  private _ballWidth = 10;
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
    this.game = new Pong();
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
        this.game.state.leftPaddleY,
        this._paddleWidth,
        this._paddleHeight
      );
      context.fillRect(
        this._canvas.width - this._paddleWidth,
        this.game.state.rightPaddleY,
        this._paddleWidth,
        this._paddleHeight
      );
      context.beginPath();
      context.arc(
        this.game.state.ballX,
        this.game.state.ballY,
        this._ballWidth,
        0,
        2 * Math.PI
      );
      context.fillStyle = 'blue';
      context.fill();
    }
  }

  private resetPaddlesAndBall(): void {
    this.game.state.leftPaddleY =
      (this._canvas.height - this._paddleHeight) / 2;
    this.game.state.rightPaddleY =
      (this._canvas.height - this._paddleHeight) / 2;
    this.game.state.ballX = this._canvas.width / 2;
    this.game.state.ballY = this._canvas.height / 2;
    this.game.state.ballSpeedX = 0;
    this.game.state.ballSpeedY = 0;
    this.game.state.ballSpeedMultiplier = 1;
  }

  private updateBallPosition(): void {
    this.game.state.ballX +=
      this.game.state.ballSpeedX * this.game.state.ballSpeedMultiplier;
    this.game.state.ballY += this.game.state.ballSpeedY;

    if (this.game.state.ballSpeedX === 0 && this.game.state.ballSpeedY === 0) {
      this.initializeBallSpeed();
    }

    if (this.game.state.ballSpeedY == 0) {
      this.game.state.ballSpeedY = this.random(-1, 1);
    }

    this.checkCollisionWithPaddles();
    this.checkCollisionWithWalls();
    this.checkPointScored();
  }

  private checkPointScored(): void {
    if (
      this.game.state.ballX <= 0 - this._ballWidth ||
      Math.abs(this.game.state.ballSpeedX) < 1
    ) {
      this.resetPaddlesAndBall();
      this.game.state.scoreRight++;
    }
    if (
      this.game.state.ballX >= this._canvas.width + this._ballWidth ||
      Math.abs(this.game.state.ballSpeedX) < 1
    ) {
      this.resetPaddlesAndBall();
      this.game.state.scoreLeft++;
    }
  }

  private checkCollisionWithWalls(): void {
    if (
      this.game.state.ballY <= 0 + this._ballWidth ||
      this.game.state.ballY >= this._canvas.height - this._ballWidth
    ) {
      this.game.state.ballSpeedY = -this.game.state.ballSpeedY;
    }
  }

  private checkCollisionWithPaddles(): void {
    if (
      this.game.state.ballX <= this._ballWidth * 2 &&
      this.game.state.ballY >= this.game.state.leftPaddleY &&
      this.game.state.ballY <= this.game.state.leftPaddleY + this._paddleHeight
    ) {
      const rotation = this.game.state.leftPaddleSpeed / 6;
      this.game.state.ballSpeedY = this.game.state.ballSpeedY + rotation;
      this.game.state.ballSpeedX = -this.game.state.ballSpeedX;
      this.game.state.ballSpeedMultiplier += 0.05;
    }

    if (
      this.game.state.ballX >= this._canvas.width - 2 * this._ballWidth &&
      this.game.state.ballY >= this.game.state.rightPaddleY &&
      this.game.state.ballY <= this.game.state.rightPaddleY + this._paddleHeight
    ) {
      const rotation = this.game.state.rightPaddleSpeed / 4;
      this.game.state.ballSpeedY = this.game.state.ballSpeedY + rotation;
      this.game.state.ballSpeedX = -this.game.state.ballSpeedX;
      this.game.state.ballSpeedMultiplier += 0.05;
    }
  }

  private initializeBallSpeed(): void {
    const ballXInitialSpeed = this.random(5, 8);
    const ballYInitialSpeed = this.random(3, 5);

    this.game.state.ballSpeedX =
      this.random(0, 1) === 0 ? ballXInitialSpeed : -ballXInitialSpeed;
    this.game.state.ballSpeedY =
      this.random(0, 1) === 0 ? ballYInitialSpeed : -ballYInitialSpeed;
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private updatePaddlesSpeeds(): void {
    switch (this.game.players[0].inputData['move']) {
      case 1:
        this.game.state.leftPaddleSpeed = -this._paddleJump;
        break;
      case -1:
        this.game.state.leftPaddleSpeed = this._paddleJump;
        break;
      default:
        this.game.state.leftPaddleSpeed = 0;
        break;
    }
    switch (this.game.players[1].inputData['move']) {
      case 1:
        this.game.state.rightPaddleSpeed = -this._paddleJump;
        break;
      case -1:
        this.game.state.rightPaddleSpeed = this._paddleJump;
        break;
      default:
        this.game.state.rightPaddleSpeed = 0;
        break;
    }
  }

  private updatePaddlesPositions(): void {
    this.game.state.rightPaddleY = Math.max(
      0,
      Math.min(
        this._canvas.height - this._paddleHeight,
        this.game.state.rightPaddleY + this.game.state.rightPaddleSpeed
      )
    );

    this.game.state.leftPaddleY = Math.max(
      0,
      Math.min(
        this._canvas.height - this._paddleHeight,
        this.game.state.leftPaddleY + this.game.state.leftPaddleSpeed
      )
    );
  }

  private onKeyDown(event: KeyboardEvent): void {
    const player1 = this.game.players[0];
    const player2 = this.game.players[1];

    if (player1.playerType === PlayerSourceType.KEYBOARD) {
      switch (event.key) {
        case 'w':
        case 'W':
          player1.inputData['move'] = 1;
          break;
        case 's':
        case 'S':
          player1.inputData['move'] = -1;
          break;
      }
    }

    if (player2.playerType === PlayerSourceType.KEYBOARD) {
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

    if (player1.playerType === PlayerSourceType.KEYBOARD) {
      switch (event.key) {
        case 'w':
        case 'W':
        case 's':
        case 'S':
          player1.inputData['move'] = 0;
          break;
      }
    }

    if (player2.playerType === PlayerSourceType.KEYBOARD) {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          player2.inputData['move'] = 0;
          break;
      }
    }
  }
}
