import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  DoCheck,
  AfterViewInit,
} from '@angular/core';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { Player } from '@gameModels/player.class';
import { Observable, Subscription } from 'rxjs';
import { CanvasComponent } from '../components/canvas/canvas.component';
import { Game } from '@gameModels/game.class';
import { IPlayerInputData } from '@gameModels/player-input-data.type';
import { VisibilityService } from 'app/shared/services/visibility.service';

@Component({
  selector: 'app-base-game-window',
  standalone: true,
  template: `<app-canvas #gameCanvas></app-canvas> <b>FPS: {{ fps }}</b>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CanvasComponent],
})
export abstract class BaseGameWindowComponent
  implements OnInit, OnDestroy, DoCheck, AfterViewInit
{
  @Input({ required: true }) public gameRestart = new Observable<void>();
  @Input({ required: true }) public gamePause = new Observable<boolean>();
  @Input({ required: true }) public abstractGame!: Game;
  @Input({ required: true }) public set setSocketInputDataReceive(
    value: TExchangeData
  ) {
    const playerInputData = this.mapReceivedToPlayerAndData(value);
    if (!playerInputData.data || !playerInputData.player) return;

    this.game.players.forEach(player => {
      if (player.id === playerInputData.player.id) {
        player.inputData = playerInputData.data;
      }
    });
  }

  @Output() public gameStateDataEmitter = new EventEmitter<TExchangeData>();
  @ViewChild('gameCanvas') public gameCanvas!: CanvasComponent;

  private _restartSubscription = new Subscription();
  private _pauseSubscription = new Subscription();

  public fps = 0;
  private _fpsMeasureInterval = 500;
  private _lastFrameTime = performance.now();
  private _deltaTimeAccumulator = 0;
  private _frameCount = 0;

  protected isPaused = false;
  protected game: Game = this.abstractGame;
  protected _canvas!: HTMLCanvasElement;

  //always call super on override (at top)
  public ngOnInit(): void {
    this._restartSubscription = this.gameRestart.subscribe(() => {
      this.restart();
      console.info('Game restarted');
    });
    this._pauseSubscription = this.gamePause.subscribe(value => {
      this.isPaused = value;
      console.info('Pause state: ', this.isPaused);
    });
  }

  //always call super on override (at top)
  public ngAfterViewInit(): void {
    this._canvas = this.gameCanvas.canvasElement.nativeElement;

    this.update();
    this.restart();
  }

  //always call super on override (at top)
  public ngOnDestroy(): void {
    this._restartSubscription.unsubscribe();
    this._pauseSubscription.unsubscribe();
  }

  //always call super on override (at top)
  public ngDoCheck(): void {
    this.emitGameStateData();
  }

  //called on reset button click; implement to reset all values to initial state
  public abstract restart(): void;

  //called efery frame; always call super on override (at top)
  protected update(): void {
    this.calculateFPS();

    requestAnimationFrame(() => this.update());
  }

  //

  private calculateFPS(): void {
    const now = performance.now();
    const delta = now - this._lastFrameTime;
    this._lastFrameTime = now;

    this._deltaTimeAccumulator += delta;
    this._frameCount++;

    if (this._deltaTimeAccumulator >= this._fpsMeasureInterval) {
      this.fps = Math.round(
        (this._frameCount * 1000) / this._deltaTimeAccumulator
      );
      this._deltaTimeAccumulator = 0;
      this._frameCount = 0;
    }
  }

  private emitGameStateData(): void {
    this.gameStateDataEmitter.emit({
      state: this.game || {},
    });
  }

  private mapReceivedToPlayerAndData(value: TExchangeData): IPlayerInputData {
    const data = value['data'] as TExchangeData;
    const player = value['player'] as Player;

    return {
      data: data,
      player: player,
    };
  }
}
