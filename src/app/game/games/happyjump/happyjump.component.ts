/* eslint-disable max-depth */
/* eslint-disable complexity */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasComponent } from 'app/game/components/canvas/canvas.component';
import { BaseGameWindowComponent } from '../base-game.component';
import { HappyJump, HappyJumpState } from './models/happyjump.class';

@Component({
  selector: 'app-happyjump',
  standalone: true,
  imports: [CanvasComponent],
  template: `
    <div>
      Score: <b>{{ game.state.score }}</b> | Jump Power:
      <b>{{ game.state.jumpPowerY }}</b> | Gravity:
      <b>{{ game.state.gravity }}</b> | Platform Speed:
      <b>{{ game.state.platformSpeed }}</b>
    </div>
    <app-canvas [displayMode]="'vertical'" class="bg-zinc-300" #gameCanvas>
    </app-canvas>
    <b>FPS: {{ fps }}</b>
  `,
})
export class HappyJumpComponent
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _playerWidth = 30;
  private _playerHeight = 30;
  private _platformHeight = 10;
  private _platformWidth = 100;
  private _minPlatformGap = 120;
  private _visitedPlatforms: boolean[] = new Array(5).fill(false);

  public override game!: HappyJump;

  public override ngOnInit(): void {
    super.ngOnInit();
    this.game = new HappyJump();
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.resetGame();
    this.render();
  }

  public override restart(): void {
    this.game.state = new HappyJumpState();
    this.game.state.isGameStarted = false;
    this.resetGame();
  }

  protected override update(): void {
    super.update();

    if (
      (!this.game.state.isGameStarted &&
        this.game.players[0].inputData['jump'] === 1) ||
      this.game.players[0].inputData['start'] === 1
    ) {
      this.game.state.isGameStarted = true;
      this.game.state.playerSpeedY = this.game.state.jumpPowerY;
    }

    if (!this.isPaused && this.game.state.isGameStarted) {
      this.updatePlayerPosition();
      this.updatePlatforms();
      this.checkCollisions();
    }

    this.render();
  }

  private resetGame(): void {
    this.game.state.playerX = this._canvas.width / 2 - this._playerWidth / 2;
    this.game.state.playerY = 570;
    this.game.state.playerSpeedY = 0;

    this.game.state.platforms.forEach((platform, index) => {
      platform.y = index * this._minPlatformGap;
      platform.x = this.random(50, this._canvas.width - this._platformWidth);
    });

    this.game.state.score = 0;
    this._visitedPlatforms = Array(4).fill(false);
  }

  private updatePlayerPosition(): void {
    const input = this.game.players[0].inputData;

    if (input['left'] === 1) {
      this.game.state.playerX -= 5;
    }
    if (input['right'] === 1) {
      this.game.state.playerX += 5;
    }

    this.game.state.playerSpeedY += this.game.state.gravity;
    this.game.state.playerY += this.game.state.playerSpeedY;

    if (this.game.state.playerY > this._canvas.height) {
      this.restart();
    }

    this.game.state.playerX = Math.max(
      0,
      Math.min(this._canvas.width - this._playerWidth, this.game.state.playerX)
    );
  }

  private updatePlatforms(): void {
    this.game.state.platforms.forEach((platform, index) => {
      platform.y += this.game.state.platformSpeed;

      if (platform.y > this._canvas.height) {
        platform.y = -this._platformHeight;
        platform.x = this.random(50, this._canvas.width - this._platformWidth);
        this._visitedPlatforms[index] = false;
      }
    });
  }

  private checkCollisions(): void {
    const playerBottom = this.game.state.playerY + this._playerHeight;
    const playerLeft = this.game.state.playerX;
    const playerRight = this.game.state.playerX + this._playerWidth;

    let isOnPlatform = false;

    for (const [index, platform] of this.game.state.platforms.entries()) {
      const platformTop = platform.y;
      const platformBottom = platform.y + this._platformHeight;
      const platformLeft = platform.x;
      const platformRight = platform.x + this._platformWidth;

      if (
        playerBottom >= platformTop &&
        playerBottom <= platformBottom + 5 &&
        playerRight > platformLeft &&
        playerLeft < platformRight &&
        this.game.state.playerSpeedY >= 0
      ) {
        this.game.state.playerSpeedY = 0;
        this.game.state.playerY = platformTop - this._playerHeight;

        isOnPlatform = true;

        if (!this._visitedPlatforms[index]) {
          this.game.state.score++;
          this._visitedPlatforms[index] = true;
        }

        break;
      }
    }

    if (isOnPlatform && this.game.players[0].inputData['jump'] === 0) {
      this.game.state.playerSpeedY = 2;
    }

    if (isOnPlatform && this.game.players[0].inputData['jump'] === 1) {
      this.game.state.playerSpeedY = this.game.state.jumpPowerY;
    }
  }

  private render(): void {
    const context = this._canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, this._canvas.width, this._canvas.height);

      context.fillStyle = 'red';
      context.fillRect(
        this.game.state.playerX,
        this.game.state.playerY,
        this._playerWidth,
        this._playerHeight
      );

      context.fillStyle = 'blue';
      this.game.state.platforms.forEach(platform => {
        context.fillRect(
          platform.x,
          platform.y,
          this._platformWidth,
          this._platformHeight
        );
      });
    }
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
