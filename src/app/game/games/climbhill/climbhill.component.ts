/* eslint-disable max-lines */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasComponent } from 'app/game/components/canvas/canvas.component';
import { BaseGameWindowComponent } from '../base-game.component';
import { ClimbHill, ClimbHillState } from './models/climbhill.class';

@Component({
  selector: 'app-climbhill',
  standalone: true,
  imports: [CanvasComponent],
  template: `<div>
      score: <b>{{ game.state.score }}</b>
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
  }

  protected override update(): void {
    super.update();

    //update

    this.render();
  }

  //

  private render(): void {
    const context = this._canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private round(value: number, decimals = 2): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
