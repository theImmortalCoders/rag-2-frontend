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

    this.updateScore();
    this.render();
  }

  //

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

  private render(): void {
    const context = this._canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);

    context.save();
    context.translate(this._carX, this.game.state.carY - this._carHeight / 2);
    context.rotate(this.game.state.carAngle);
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
    const contextWidth = this._canvas.width;
    const vertexesNumber = this.game.state.visibleTerrain.length;
    const vertexStep = contextWidth / vertexesNumber;

    context.beginPath();
    context.lineWidth = 5;
    context.moveTo(
      0,
      this._canvas.height - 200 - this.game.state.visibleTerrain[0]
    );
    for (let i = 1; i < vertexesNumber; i++) {
      const vertexHeight = this.game.state.visibleTerrain[i];
      context.lineTo(i * vertexStep, this._canvas.height - 200 - vertexHeight);
    }
    context.lineTo(contextWidth, this._canvas.height - 200);
    context.strokeStyle = 'green';
    context.stroke();
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private round(value: number, decimals = 2): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
