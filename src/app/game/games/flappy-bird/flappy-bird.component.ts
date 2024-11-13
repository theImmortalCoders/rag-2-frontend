import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasComponent } from 'app/game/components/canvas/canvas.component';
import { BaseGameWindowComponent } from '../base-game.component';
import { FlappyBird, FlappyBirdState } from './models/flappy-bird.class';

@Component({
  selector: 'app-flappy-bird',
  standalone: true,
  imports: [CanvasComponent],
  template: `<div>score: {{ game.state.score }}</div>
    <app-canvas #gameCanvas></app-canvas> <b>FPS: {{ fps }}</b> `,
})
export class FlappyBirdComponent
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public override game!: FlappyBird;

  public override ngOnInit(): void {
    super.ngOnInit();

    this.game = this.game as FlappyBird;
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.resetGame();
  }

  public override restart(): void {
    this.game.state = new FlappyBirdState();

    this.resetGame();
  }

  protected override update(): void {
    super.update();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const player = this.game.players[0];
  }

  protected onKeyUp(event: KeyboardEvent): void {
    const player = this.game.players[0];
  }

  //

  private resetGame(): void {
    setTimeout(() => {
      this.game.state.birdY = 300;
      this.game.state.birdSpeedY = 0;
      this.game.state.obstacleDistanceX = 300;
      this.game.state.obstacleCenterGapY = 200;
      this.game.state.gravity = 0.5;
      this.game.state.jumpPowerY = 10;
      this.game.state.score = 0;
      this.game.state.isGameActive = false;
    });
  }
}
