import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasComponent } from 'app/game/components/canvas/canvas.component';
import { BaseGameWindowComponent } from '../base-game.component';
import { FlappyBird, FlappyBirdState } from './models/flappy-bird.class';
import { PlayerSourceType } from 'app/shared/models/player-source-type.enum';

@Component({
  selector: 'app-flappy-bird',
  standalone: true,
  imports: [CanvasComponent],
  template: `<div>
      score: <b>{{ game.state.score }}</b
      >, difficulty: <b>{{ game.state.difficulty }}</b
      >, jumpPower: <b>{{ game.state.jumpPowerY }}</b
      >, gravity: <b>{{ game.state.gravity }}</b>
    </div>
    <app-canvas #gameCanvas></app-canvas> <b>FPS: {{ fps }}</b> `,
})
export class FlappyBirdComponent
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _birdWidth = 20;
  private _birdHeight = 20;
  private _obstacleWidth = 50;
  private _obstacleGapHeight = 200;
  private _minDistanceBetweenObstacles = 200;

  public override game!: FlappyBird;

  public override ngOnInit(): void {
    super.ngOnInit();

    this.game = this.game as FlappyBird;
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.resetBirdAndObstacle();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public override restart(): void {
    this.game.state = new FlappyBirdState();

    this.resetBirdAndObstacle();
    this.resetScoreAndDifficulty();
  }

  protected override update(): void {
    super.update();

    if (!this.isPaused) {
      this.updateBirdPosition();
      this.updateObstaclePosition();
      this.updateBirdSpeed();
      this.checkCollision();
      this.render();
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const player = this.game.players[0];

    if (player.playerType === PlayerSourceType.KEYBOARD) {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          this.game.players[0].inputData['jump'] = 1;
          break;
      }
    }
  }

  protected onKeyUp(event: KeyboardEvent): void {
    const player = this.game.players[0];

    if (player.playerType === PlayerSourceType.KEYBOARD) {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          this.game.players[0].inputData['jump'] = 0;
          break;
      }
    }
  }

  //

  private resetBirdAndObstacle(): void {
    this.game.state.birdY = this._canvas.height / 2;
    this.game.state.birdSpeedY = 0;
    this.game.state.jumpPowerY = 10;
    this.game.state.gravity = 0.5;

    const gapBetweenObstacles = 300;
    this.game.state.obstacles.forEach((obstacle, index) => {
      obstacle.distanceX = this._canvas.width + index * gapBetweenObstacles;
      obstacle.centerGapY = this.random(100, 400);
    });
  }

  private resetScoreAndDifficulty(): void {
    this.game.state.score = 0;
    this.game.state.difficulty = 1;
  }

  // eslint-disable-next-line complexity
  private checkCollision(): void {
    const birdBottom = this.game.state.birdY + this._birdHeight;
    const birdTop = this.game.state.birdY;

    for (const obstacle of this.game.state.obstacles) {
      if (
        obstacle.distanceX < 120 &&
        obstacle.distanceX + this._obstacleWidth > 100
      ) {
        // eslint-disable-next-line max-depth
        if (
          birdTop < obstacle.centerGapY - this._obstacleGapHeight / 2 ||
          birdBottom > obstacle.centerGapY + this._obstacleGapHeight / 2
        ) {
          this.restart();
        }
        break;
      }
    }

    if (birdTop < 0 || birdBottom > this._canvas.height) {
      this.restart();
    }
  }

  private updateBirdSpeed(): void {
    if (this.game.players[0].inputData['jump'] === 1) {
      this.game.state.birdSpeedY = -this.game.state.jumpPowerY;
    }
  }

  private updateBirdPosition(): void {
    this.game.state.birdSpeedY += this.game.state.gravity;
    this.game.state.birdY += this.game.state.birdSpeedY;

    if (this.game.state.birdY > this._canvas.height - this._birdHeight) {
      this.restart();
    }

    if (this.game.state.birdY < 0) {
      this.restart();
    }
  }

  private updateObstaclePosition(): void {
    this.game.state.obstacles.forEach((obstacle, index) => {
      obstacle.distanceX -= 2;

      if (obstacle.distanceX < -this._obstacleWidth) {
        const previousObstacle =
          this.game.state.obstacles[
            (index - 1 + this.game.state.obstacles.length) %
              this.game.state.obstacles.length
          ];

        obstacle.distanceX =
          previousObstacle.distanceX +
          this._minDistanceBetweenObstacles +
          this.random(50, 150);
        obstacle.centerGapY = this.random(100, 400);
        this.game.state.score++;
      }
    });
  }

  private render(): void {
    const context = this._canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, this._canvas.width, this._canvas.height);

      context.fillStyle = 'red';
      context.fillRect(
        100,
        this.game.state.birdY,
        this._birdWidth,
        this._birdHeight
      );

      context.fillStyle = 'blue';
      this.game.state.obstacles.forEach(obstacle => {
        context.fillRect(
          obstacle.distanceX,
          0,
          this._obstacleWidth,
          obstacle.centerGapY - this._obstacleGapHeight / 2
        );
        context.fillRect(
          obstacle.distanceX,
          obstacle.centerGapY + this._obstacleGapHeight / 2,
          this._obstacleWidth,
          this._canvas.height - obstacle.centerGapY
        );
      });
    }
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
