/* eslint-disable max-depth */
/* eslint-disable complexity */
/* eslint-disable max-lines */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { PlayerSourceType } from 'app/shared/models/player-source-type.enum';
import { BaseGameWindowComponent } from '../base-game.component';
import { SkiJump, SkiJumpState } from './models/ski-jump.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ski-jump',
  standalone: true,
  imports: [CanvasComponent, CommonModule],
  template: `<div>
      Distance: <b>{{ game.state.distance | number: '1.0-1' }}</b> m, wind:
      <b>{{ game.state.wind | number: '1.0-1' }} m/s </b> to the
      <b>{{ game.state.windDirection }}</b>
    </div>
    <app-canvas #gameCanvas></app-canvas> <b>FPS: {{ fps }}</b> `,
})
export class SkiJumpGameWindowComponent
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _jumperWidth = 10;
  private _jumperHeight = 10;
  private _jumperRideVelocity = 0;
  private _towerEndX = 250;
  private _jumped = false;
  private _landed = false;

  private _windInterval: ReturnType<typeof setTimeout> | undefined;

  public override game!: SkiJump;

  public override ngOnInit(): void {
    super.ngOnInit();
    this.game = this.game as SkiJump;
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.resetGame();
    this.updateWind();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this._windInterval) {
      clearInterval(this._windInterval);
    }
  }

  public override restart(): void {
    this.game.state = new SkiJumpState();
    this.resetGame();
  }

  protected override update(): void {
    super.update();

    if (!this.isPaused) {
      this.updatePhysics();
      this.render();
    }
  }

  private render(): void {
    const context = this._canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, this._canvas.width, this._canvas.height);

      context.fillStyle = 'red';
      context.fillRect(
        this.game.state.jumperX,
        this.game.state.jumperY,
        this._jumperWidth,
        this._jumperHeight
      );

      context.strokeStyle = 'black';
      context.beginPath();
      context.moveTo(0, 0);
      for (let x = 0; x <= this._towerEndX; x++) {
        const y = this.towerParabola(x);
        context.lineTo(x, y);
      }
      context.stroke();

      context.strokeStyle = 'black';
      context.beginPath();
      context.moveTo(this._towerEndX, this.towerParabola(this._towerEndX));
      for (let x = this._towerEndX; x <= this._canvas.width; x++) {
        const y = this.hillParabola(x);
        context.lineTo(x, y);
      }
      context.stroke();
    }
  }

  private towerParabola(x: number): number {
    const progress = x / this._towerEndX;
    return 200 * (1 - Math.pow(progress - 1, 2));
  }

  private hillParabola(x: number): number {
    const progress =
      ((x - this._towerEndX) / (this._canvas.width - this._towerEndX)) * 2;
    return 230 + 200 * Math.pow(progress, 2);
  }

  private resetGame(): void {
    this.game.state.jumperX = 0;
    this.game.state.jumperY = 0;
    this.game.state.isJumping = false;
    this.game.state.distance = 0;
    this._jumperRideVelocity = 0;
    this.game.state.jumperVelocityX = 0;
    this.game.state.jumperVelocityY = 0;
    this._jumped = false;
    this._landed = false;
    this.game.state.wind = Math.random() * 2;
  }

  private startJump(): void {
    console.log('start jump');
    this.game.state.isJumping = true;
  }

  private endJump(): void {
    this.game.state.isJumping = false;
    this.resetGame();
  }

  private updatePhysics(): void {
    if (!this.game.state.isJumping) {
      if (this.game.players[0].inputData['space'] === 1) {
        this.startJump();
      } else {
        return;
      }
    }

    if (this.game.state.jumperX < this._towerEndX) {
      this.ride();
    } else {
      if (this.game.state.jumperY < this._canvas.height) {
        if (
          this.game.state.jumperY < this.hillParabola(this.game.state.jumperX)
        ) {
          this.fly();
        } else {
          if (this._landed) {
            this.game.state.jumperX += this.game.state.jumperVelocityX;
            this.game.state.jumperY = this.hillParabola(
              this.game.state.jumperX
            );
          } else {
            this._landed = true;
            console.log(this.game.state.distance);
          }
        }
      } else {
        this.endJump();
      }
    }
  }

  private updateWind(): void {
    this._windInterval = setInterval(() => {
      const windChange = (Math.random() - 0.5) * 0.1;
      this.game.state.wind += windChange;

      if (this.game.state.wind < 0) {
        this.game.state.wind = 0;
      } else if (this.game.state.wind > 2) {
        this.game.state.wind = 2;
      }

      if (this.game.state.wind < 0.1) {
        this.game.state.windDirection = Math.random() > 0.5 ? 'left' : 'right';
      }
    }, 1000);
  }

  private ride(): void {
    this.game.state.jumperY = this.towerParabola(this.game.state.jumperX);
    this.game.state.jumperX += this._jumperRideVelocity;
    this._jumperRideVelocity += 0.03;

    const distance = Math.abs(this.game.state.jumperX - this._towerEndX);
    if (
      distance < 40 &&
      this.game.players[0].inputData['space'] === 1 &&
      !this._jumped
    ) {
      this.game.state.jumperVelocityY -= (Math.log(distance) / 5) * 2;
      this._jumped = true;
    }
  }

  private fly(): void {
    if (this.game.state.windDirection === 'left') {
      this.game.state.jumperVelocityX -= this.game.state.wind / 180;
      this.game.state.jumperVelocityY -= this.game.state.wind / 180;
    } else {
      this.game.state.jumperVelocityX += this.game.state.wind / 180;
      this.game.state.jumperVelocityY += this.game.state.wind / 180;
    }

    this.game.state.jumperVelocityX = this._jumperRideVelocity;
    this.game.state.jumperVelocityY += 0.08;
    this.game.state.jumperX += this.game.state.jumperVelocityX;
    this.game.state.jumperY += this.game.state.jumperVelocityY;

    this.game.state.distance = (this.game.state.jumperX - this._towerEndX) / 5;
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const player = this.game.players[0];

    if (player.playerType === PlayerSourceType.KEYBOARD) {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          this.game.players[0].inputData['space'] = 1;
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.game.players[0].inputData['up'] = 1;
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.game.players[0].inputData['down'] = 1;
          break;
      }
    }
  }

  protected onKeyUp(event: KeyboardEvent): void {
    const player = this.game.players[0];

    if (player.playerType === PlayerSourceType.KEYBOARD) {
      switch (event.key) {
        case ' ':
          this.game.players[0].inputData['space'] = 0;
          break;
        case 'ArrowUp':
          this.game.players[0].inputData['up'] = 0;
          break;
        case 'ArrowDown':
          this.game.players[0].inputData['down'] = 0;
          break;
      }
    }
  }
}
