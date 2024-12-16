/* eslint-disable complexity */
/* eslint-disable max-lines */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasComponent } from 'app/game/components/canvas/canvas.component';
import { BaseGameWindowComponent } from '../base-game.component';
import { ClimbHill, ClimbHillState } from './models/climbhill.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-climbhill',
  standalone: true,
  imports: [CanvasComponent, CommonModule],
  template: `<div>
      score: <b>{{ game.state.score | number: '1.0-0' }}</b
      >, distance: <b>{{ game.state.distance | number: '1.0-0' }}</b
      >, speed: <b>{{ game.state.carXSpeed * 20 | number: '1.0-0' }}</b
      >, fuel: <b>{{ game.state.fuel | number: '1.0-0' }}</b>
    </div>
    <app-canvas
      [displayMode]="'horizontal'"
      class="bg-zinc-300"
      #gameCanvas></app-canvas>
    <b>FPS: {{ fps }}</b> `,
})
export class ClimbHillComponent
  extends BaseGameWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _carX = 150;
  private _carWidth = 100;
  private _carHeight = 50;
  private _frontWheelY = 0;
  private _rearWheelY = 0;
  private _wheelRadius = 20;
  private _wheelDamping = 0.3;
  private _lastFuelGenerated = 0;
  private _fuelX = 0;

  public override game!: ClimbHill;

  public override ngOnInit(): void {
    super.ngOnInit();
    this.game = this.game as ClimbHill;
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.render();
  }

  public override restart(): void {
    this.game.state = new ClimbHillState();
    this.resetValues();
  }

  protected override update(): void {
    super.update();

    if (this.game.state.fuel <= 0) {
      this.game.state.carXSpeed -= 0.1;
      if (this.game.state.carXSpeed < 0) {
        this.game.state.carXSpeed = 0;
      }
    }

    this.game.state.fuel -= 0.1;
    if (this.game.state.fuel < 0) {
      this.game.state.fuel = 0;
    }

    if (
      this.game.players[0].inputData['gas'] === 1 &&
      this.game.state.fuel > 0
    ) {
      this.game.state.carXSpeed += 0.07;
      if (this.game.state.carXSpeed > 5) {
        this.game.state.carXSpeed = 5;
      }
    } else {
      this.game.state.carXSpeed -= 0.03;
    }
    if (this.game.players[0].inputData['brake'] === 1) {
      this.game.state.carXSpeed -= 0.09;
    }
    if (this.game.state.carXSpeed < 0) {
      this.game.state.carXSpeed = 0;
    }
    this.game.state.distance += this.game.state.carXSpeed;

    this.generateTerrain();
    if (this._lastFuelGenerated > 12000) {
      const generateFuel = [0, 0, 0, 0, 0, 0, 1];
      const shouldGenerateFuel = generateFuel[this.random(0, 6)] === 1;
      if (shouldGenerateFuel) {
        this.generateFuelPickups();
      }
      this._lastFuelGenerated = 0;
    } else this._lastFuelGenerated += this.game.state.carXSpeed * 100;
    this.game.state.nextFuel -= this.game.state.carXSpeed * 1.095;
    if (this.game.state.nextFuel < 1000 && this._fuelX == 0)
      this._fuelX =
        this.game.state.visibleTerrain[
          this.game.state.visibleTerrain.length - 1
        ] - 30;
    if (this.game.state.nextFuel < 0) this._fuelX = 0;
    this.updateCarPosition();
    this.checkFuelPickupCollision();
    this.updateScore();

    this.render();
  }

  private updateCarPosition(): void {
    const terrain = this.game.state.visibleTerrain;
    const contextWidth = this._canvas.width;
    const segmentWidth = contextWidth / (terrain.length - 1);

    const carXInTerrain = this._carX % contextWidth;
    const segmentIndex = Math.floor(carXInTerrain / segmentWidth);

    const frontWheelTerrainHeight = terrain[segmentIndex + 1] || 0;
    const targetFrontWheelY =
      this._canvas.height / 2 - frontWheelTerrainHeight + this._wheelRadius;
    this._frontWheelY = this.lerp(
      this._frontWheelY,
      targetFrontWheelY,
      this._wheelDamping
    );

    const rearWheelTerrainHeight = terrain[segmentIndex] || 0;
    const targetRearWheelY =
      this._canvas.height / 2 - rearWheelTerrainHeight + this._wheelRadius;
    this._rearWheelY = this.lerp(
      this._rearWheelY,
      targetRearWheelY,
      this._wheelDamping
    );

    const carHeightOffset = (this._frontWheelY + this._rearWheelY) / 2;
    this.game.state.carY = carHeightOffset;

    const wheelAngle = Math.atan2(
      this._frontWheelY - this._rearWheelY,
      this._carWidth
    );
    this.game.state.carAngle = wheelAngle;
  }

  private generateTerrain(): void {
    const terrainShiftAmount = this.game.state.carXSpeed * 0.03;
    this.game.state.terrainShiftBuffer += terrainShiftAmount;

    if (this.game.state.terrainShiftBuffer >= 1) {
      this.game.state.visibleTerrain.shift();
      const lastValue =
        this.game.state.visibleTerrain[
          this.game.state.visibleTerrain.length - 1
        ];
      let newTerrainValue = lastValue + this.random(-15, 15);
      if (newTerrainValue < -70) {
        newTerrainValue = -70;
      }
      if (newTerrainValue > 120) {
        newTerrainValue = 120;
      }
      this.game.state.visibleTerrain.push(newTerrainValue);

      this.game.state.terrainShiftBuffer -= 1;
    }
  }

  private generateFuelPickups(): void {
    if (this.game.state.nextFuel <= 0) {
      this.game.state.nextFuel = 1000;
      this._lastFuelGenerated = this.game.state.nextFuel;
    }
  }

  private checkFuelPickupCollision(): void {
    if (
      this.game.state.nextFuel > 0 &&
      this.game.state.nextFuel < 200 &&
      this.game.state.fuel <= this._carX
    ) {
      this.game.state.fuel = 100;
      this.game.state.nextFuel = 0;
    }
  }

  private resetValues(): void {
    this.game.state.score = 0;
    this.game.state.distance = 0;
    this.game.state.carY = 400;
    this.game.state.carAngle = 0;
    this.game.state.carXSpeed = 0;
    this.game.state.fuel = 100;
    this.game.state.nextFuel = 0;
  }

  private updateScore(): void {
    this.game.state.score = this.round(this.game.state.distance / 100);
  }

  private lerp(start: number, end: number, alpha: number): number {
    return start * (1 - alpha) + end * alpha;
  }

  private render(): void {
    const context = this._canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, this._canvas.width, this._canvas.height);

    context.save();
    context.translate(
      this._carX,
      this.game.state.carY - 30 - this._carHeight / 2
    );
    context.rotate(this.game.state.carAngle);
    context.fillStyle = 'blue';
    context.fillRect(
      -this._carWidth / 2,
      -this._carHeight / 2,
      this._carWidth,
      this._carHeight
    );
    context.restore();

    this.drawWheels(context);
    this.drawTerrain(context);
    if (this.game.state.nextFuel > 0) this.drawFuelPickups(context);
  }

  private drawWheels(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(
      this._carX + this._carWidth / 2,
      this._frontWheelY - 30,
      this._wheelRadius,
      0,
      2 * Math.PI
    );
    context.fillStyle = 'black';
    context.fill();

    context.beginPath();
    context.arc(
      this._carX - this._carWidth / 2,
      this._rearWheelY - 30,
      this._wheelRadius,
      0,
      2 * Math.PI
    );
    context.fillStyle = 'black';
    context.fill();
  }

  private drawTerrain(context: CanvasRenderingContext2D): void {
    const terrain = this.game.state.visibleTerrain;
    const contextWidth = this._canvas.width;
    const contextHeight = this._canvas.height;

    const segmentWidth = contextWidth / (terrain.length - 1);
    const pixelOffset = this.game.state.terrainShiftBuffer * segmentWidth;

    context.beginPath();
    context.moveTo(-pixelOffset, contextHeight / 2 - terrain[0]);
    for (let i = 1; i < terrain.length; i++) {
      const x = i * segmentWidth - pixelOffset;
      const y = contextHeight / 2 - terrain[i];
      context.lineTo(x, y);
    }
    context.lineTo(
      contextWidth,
      contextHeight / 2 - terrain[terrain.length - 2]
    );
    context.lineTo(contextWidth, contextHeight);
    context.lineTo(0, contextHeight);
    context.closePath();
    context.fillStyle = 'green';
    context.fill();
  }

  private drawFuelPickups(context: CanvasRenderingContext2D): void {
    context.fillStyle = 'red';
    context.fillRect(this.game.state.nextFuel, 240 - this._fuelX, 20, 20);
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private round(value: number, decimals = 2): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
