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
    this.resetGame();
  }

  protected override update(): void {
    super.update();

    if (!this.isPaused) {
      this.updatePlayerPosition();
      this.updatePlatforms();
      this.checkCollisions();
    }

    this.render();
  }

  private resetGame(): void {
    this.game.state.playerX = this._canvas.width / 2 - this._playerWidth / 2;
    this.game.state.playerY = this._canvas.height / 2;
    this.game.state.playerSpeedY = 0;

    // Reset platform positions
    this.game.state.platforms.forEach((platform, index) => {
      platform.y = index * this._minPlatformGap;
      platform.x = this.random(50, this._canvas.width - this._platformWidth);
    });

    this.game.state.score = 0;
  }

  private updatePlayerPosition(): void {
    const input = this.game.players[0].inputData;

    // Ruch poziomy gracza
    if (input['left'] === 1) {
      this.game.state.playerX -= 5;
    }
    if (input['right'] === 1) {
      this.game.state.playerX += 5;
    }

    // Aktualizacja prędkości i pozycji gracza
    this.game.state.playerSpeedY += this.game.state.gravity;
    this.game.state.playerY += this.game.state.playerSpeedY;

    // Sprawdzenie, czy gracz spadł poza ekran
    if (this.game.state.playerY > this._canvas.height) {
      this.restart();
    }

    // Ograniczenie ruchu poziomego do krawędzi ekranu
    this.game.state.playerX = Math.max(
      0,
      Math.min(this._canvas.width - this._playerWidth, this.game.state.playerX)
    );
  }

  private updatePlatforms(): void {
    this.game.state.platforms.forEach(platform => {
      platform.y += this.game.state.platformSpeed;

      // Jeśli platforma wyjdzie poza dolną krawędź ekranu, resetuj ją
      if (platform.y > this._canvas.height) {
        platform.y = -this._platformHeight;
        platform.x = this.random(50, this._canvas.width - this._platformWidth);
        this.game.state.score++;
      }
    });
  }

  private checkCollisions(): void {
    const playerBottom = this.game.state.playerY + this._playerHeight;
    const playerLeft = this.game.state.playerX;
    const playerRight = this.game.state.playerX + this._playerWidth;

    let isOnPlatform = false;

    for (const platform of this.game.state.platforms) {
      const platformTop = platform.y;
      const platformBottom = platform.y + this._platformHeight;
      const platformLeft = platform.x;
      const platformRight = platform.x + this._platformWidth;

      // Tolerancja na minimalne podskakiwanie
      // Sprawdzamy, czy gracz jest "w pobliżu" platformy, zamiast sprawdzać dokładne krawędzie
      if (
        playerBottom >= platformTop && // Gracz nie jest poniżej platformy
        playerBottom <= platformBottom + 5 && // Dodajemy tolerancję 5 pikseli, aby dać szansę na wykrycie
        playerRight > platformLeft &&
        playerLeft < platformRight &&
        this.game.state.playerSpeedY >= 0 // Gracz nie leci w górę (czyli jest na platformie)
      ) {
        // Jeśli gracz dotyka platformy, ustawiamy go dokładnie na jej górnej krawędzi
        this.game.state.playerSpeedY = 0; // Resetowanie prędkości w osi Y (żeby nie było minimalnego podskakiwania)
        this.game.state.playerY = platformTop - this._playerHeight; // Pozycja Y gracza na platformie

        isOnPlatform = true;
        break;
      }
    }

    if (isOnPlatform && this.game.players[0].inputData['jump'] === 0) {
      this.game.state.playerSpeedY = 2;
    }

    // Tylko jeśli gracz jest na platformie, może wykonać skok
    if (isOnPlatform && this.game.players[0].inputData['jump'] === 1) {
      this.game.state.playerSpeedY = this.game.state.jumpPowerY; // Skok
    }
  }

  private render(): void {
    const context = this._canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, this._canvas.width, this._canvas.height);

      // Rysowanie gracza
      context.fillStyle = 'green';
      context.fillRect(
        this.game.state.playerX,
        this.game.state.playerY,
        this._playerWidth,
        this._playerHeight
      );

      // Rysowanie platform
      context.fillStyle = 'brown';
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
