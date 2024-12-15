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
      >, distance: <b>{{ game.state.distance | number: '1.0-0' }}</b> , speed:
      <b>{{ game.state.carXSpeed * 20 | number: '1.0-0' }}</b>
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

    if (this.game.players[0].inputData['gas'] === 1) {
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
    this.updateCarPosition();

    this.updateScore();

    this.render();
  }

  private updateCarPosition(): void {
    const terrain = this.game.state.visibleTerrain;
    const contextWidth = this._canvas.width;
    const segmentWidth = contextWidth / (terrain.length - 1);

    const carXInTerrain = this._carX % contextWidth;
    const segmentIndex = Math.floor(carXInTerrain / segmentWidth);
    const segmentOffset = (carXInTerrain % segmentWidth) / segmentWidth;

    const terrainY1 = terrain[segmentIndex] || 0;
    const terrainY2 = terrain[segmentIndex + 1] || 0;
    const targetCarY =
      this._canvas.height / 2 -
      (terrainY1 * (1 - segmentOffset) + terrainY2 * segmentOffset);

    const targetCarAngle = Math.atan2(terrainY2 - terrainY1, segmentWidth);

    const smoothingFactor = 0.2;
    this.game.state.carY = this.lerp(
      this.game.state.carY,
      targetCarY,
      smoothingFactor
    );
    this.game.state.carAngle = this.lerp(
      this.game.state.carAngle,
      targetCarAngle,
      smoothingFactor
    );
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

  private resetValues(): void {
    this.game.state.score = 0;
    this.game.state.distance = 0;
    this.game.state.carY = 400;
    this.game.state.carAngle = 0;
    this.game.state.carXSpeed = 0;
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
    context.translate(this._carX, this.game.state.carY - this._carHeight / 2);
    context.rotate(-this.game.state.carAngle);
    context.fillStyle = 'blue';
    context.fillRect(
      -this._carWidth / 2,
      -this._carHeight / 2,
      this._carWidth,
      this._carHeight
    );
    context.restore();

    this.drawTerrain(context);
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
    context.lineTo(contextWidth, contextHeight);
    context.lineTo(0, contextHeight);
    context.closePath();
    context.fillStyle = 'green';
    context.fill();
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private round(value: number, decimals = 2): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
