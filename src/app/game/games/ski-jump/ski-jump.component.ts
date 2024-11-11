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
      <b>{{ game.state.windDirection }}</b
      >, style:<b> {{ game.state.stylePoints }} pts</b>, wind:<b>
        {{ game.state.windPoints | number: '1.0-1' }} pts</b
      >, total:<b> {{ game.state.totalPoints | number: '1.0-1' }} pts</b>
    </div>
    <app-canvas #gameCanvas></app-canvas> <b>FPS: {{ fps }}</b> `,
})
export class SkiJumpGameWindowComponent
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _jumperHeight = 10;
  private _jumperRideVelocity = 0;
  private _towerEndX = 250;
  private hasPressedLand = false;
  private _wrongFlightCounter = 0;

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

      const lineLength = 25;
      context.strokeStyle = 'red';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(this.game.state.jumperX, this.game.state.jumperY);
      context.lineTo(
        this.game.state.jumperX +
          lineLength * Math.cos(this.game.state.jumperInclineRad),
        this.game.state.jumperY +
          lineLength * Math.sin(this.game.state.jumperInclineRad)
      );
      context.stroke();
      context.lineWidth = 1;
      context.save();

      if (this.game.state.isFlying) {
        context.translate(this.game.state.jumperX, this.game.state.jumperY);
        context.rotate(this.game.state.jumperInclineRad + Math.PI / 4);
        context.fillStyle = 'blue';
        context.fillRect(3, -25, 2, 20);
        context.restore();
      } else if (this.game.state.isLanded) {
        context.translate(this.game.state.jumperX, this.game.state.jumperY);
        context.rotate(this.game.state.jumperInclineRad);
        context.fillStyle = 'blue';
        context.fillRect(3, -20, 2, 20);
        context.restore();
      } else {
        context.translate(this.game.state.jumperX, this.game.state.jumperY);
        context.rotate(this.game.state.jumperInclineRad);
        context.fillStyle = 'blue';
        context.font = '20px Arial';
        context.fillText('T', 0, 0);
        context.restore();
      }

      context.strokeStyle = 'black';
      context.lineWidth = 2;
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
      context.lineWidth = 1;
      context.save();
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
    setTimeout(() => {
      this.game.state.jumperX = 0;
      this.game.state.jumperY = 0;
      this.game.state.isMoving = false;
      this.game.state.distance = 0;
      this._jumperRideVelocity = 0;
      this.game.state.jumperFlightVelocityX = 0;
      this.game.state.jumperFlightVelocityY = 0;
      this.game.state.isFlying = false;
      this.game.state.isLanded = false;
      this.game.state.wind = Math.random() * 2;
      this.game.state.windDirection = Math.random() > 0.5 ? 'left' : 'right';
      this.game.state.jumperInclineRad = this.calculateSkisInclination(
        this.towerParabola(0),
        this.towerParabola(1)
      );
      this.hasPressedLand = false;
      this.game.state.isCrashed = false;
      this._wrongFlightCounter = 0;
      this.game.state.stylePoints = 0;
      this.game.state.windPoints = 0;
      this.game.state.totalPoints = 0;
    });
  }

  private startJump(): void {
    this.game.state.isMoving = true;
  }

  private endJump(): void {
    this.resetGame();
  }

  private updatePhysics(): void {
    if (!this.game.state.isMoving) {
      if (this.game.players[0].inputData['space'] === 1) {
        this.startJump();
      } else {
        return;
      }
    }

    if (this.game.state.jumperX < this._towerEndX) {
      this.ride();
    } else {
      if (this.game.state.jumperY + this._jumperHeight < this._canvas.height) {
        if (
          this.game.state.jumperY < this.hillParabola(this.game.state.jumperX)
        ) {
          this.fly();
        } else {
          if (!this.hasPressedLand || !this.wasLandingPossible()) {
            this.game.state.isCrashed = true;
          } else {
            this.game.state.isLanded = true;
          }

          this.game.state.jumperX += this.game.state.jumperFlightVelocityX;
          this.game.state.jumperY = this.hillParabola(this.game.state.jumperX);

          if (this.game.state.isCrashed) {
            this.game.state.jumperInclineRad += Math.PI / 8;
          } else {
            this.game.state.jumperInclineRad = this.calculateSkisInclination(
              this.hillParabola(this.game.state.jumperX),
              this.hillParabola(this.game.state.jumperX + 1)
            );
          }
          this.game.state.isFlying = false;
        }
      } else {
        this.game.state.jumperFlightVelocityX = 0;
        this.game.state.jumperFlightVelocityY = 0;
        this.game.state.isMoving = false;
        this.game.state.stylePoints = 20;
        if (this.game.state.isCrashed) {
          this.game.state.stylePoints -= 12;
        }
        let style = 0;
        if (this._wrongFlightCounter > 15) {
          style = 5;
        } else if (this._wrongFlightCounter > 12) {
          style = 4;
        } else if (this._wrongFlightCounter > 9) {
          style = 3;
        } else if (this._wrongFlightCounter > 6) {
          style = 2;
        } else if (this._wrongFlightCounter > 3) {
          style = 1;
        }

        this.game.state.windPoints =
          (this.game.state.windDirection === 'left' ? -1 : 1) *
          this.game.state.wind *
          5;

        this.game.state.stylePoints -= style;

        this.game.state.totalPoints =
          this.game.state.distance +
          this.game.state.stylePoints +
          this.game.state.windPoints;

        if (this.game.players[0].inputData['space'] === 1) {
          this.endJump();
          this.game.players[0].inputData['space'] = 0;
        }
      }
    }
  }

  private wasLandingPossible(): boolean {
    return (
      Math.abs(
        this.game.state.jumperInclineRad -
          this.calculateSkisInclination(
            this.hillParabola(this.game.state.jumperX),
            this.hillParabola(this.game.state.jumperX + 1)
          )
      ) <
      Math.PI / 8
    );
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

    this.game.state.jumperInclineRad = this.calculateSkisInclination(
      this.towerParabola(this.game.state.jumperX),
      this.towerParabola(this.game.state.jumperX + 1)
    );

    const distance = Math.abs(this.game.state.jumperX - this._towerEndX);
    if (
      distance < 40 &&
      this.game.players[0].inputData['space'] === 1 &&
      !this.game.state.isFlying
    ) {
      this.game.state.jumperFlightVelocityY -= (Math.log(distance) / 4.7) * 2;
      this.game.state.isFlying = true;
    }
  }

  private fly(): void {
    if (this.game.state.windDirection === 'left') {
      this.game.state.jumperFlightVelocityX -= this.game.state.wind / 230;
      this.game.state.jumperFlightVelocityY -= this.game.state.wind / 230;
    } else {
      this.game.state.jumperFlightVelocityX += this.game.state.wind / 230;
      this.game.state.jumperFlightVelocityY += this.game.state.wind / 230;
    }

    this.game.state.jumperFlightVelocityX = this._jumperRideVelocity;
    this.game.state.jumperFlightVelocityY += 0.08;
    this.game.state.jumperX += this.game.state.jumperFlightVelocityX;
    this.game.state.jumperY += this.game.state.jumperFlightVelocityY;

    this.game.state.distance = (this.game.state.jumperX - this._towerEndX) / 5;

    if (this.game.players[0].inputData['up']) {
      this.game.state.jumperInclineRad += 0.02;
    }
    if (this.game.players[0].inputData['down']) {
      this.game.state.jumperInclineRad -= 0.02;
    }

    if (
      this.game.players[0].inputData['space'] === 1 &&
      this.game.state.distance > 10
    ) {
      this.game.state.jumperFlightVelocityY += 0.2;
      this.game.state.jumperFlightVelocityX -= 0.1;
      this.hasPressedLand = true;
    }

    if (
      Math.abs(
        this.game.state.jumperInclineRad -
          this.calculateSkisInclination(
            this.hillParabola(this.game.state.jumperX),
            this.hillParabola(this.game.state.jumperX + 1)
          )
      ) >
      Math.PI / 32
    ) {
      this._wrongFlightCounter++;
    }
  }

  private calculateSkisInclination(y1: number, y2: number): number {
    return Math.atan(y2 - y1);
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
